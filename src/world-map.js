
var Country =  require('./country');
var SceneObject = require('./scene-object');
var mx = require('./mx');
var mousePicker = require('./mouse-picker');
var geojson = require( './geojson');
var wiki = require( './wiki');



module.exports = WorldMap;

function WorldMap(props) {

    SceneObject.call(this);
    this.uIsFlat = 1;
    this.uCoeff = 0;
    this.mouseMoveTargets = [];
    this.selectColor = [0, 1, 0, 1];

    Object.assign(this, props);
    this.init();
};
WorldMap.prototype = Object.create(SceneObject.prototype);
WorldMap.prototype.constructor = WorldMap;



WorldMap.prototype.init = function () {

    var totalVertices = 0;

    for (var i = 0, l = this.countryFeatures.length; i < l; i++) {
        var countryFeature = this.countryFeatures[i];
        var buffers = geojson.getTriangulatedPolygon(countryFeature);
        var country = new Country({
            id: i,
            name: countryFeature.properties.name,
            name_long: countryFeature.properties.name_long,
            name_sort: countryFeature.properties.name_sort,
            admin: countryFeature.properties.admin,
             landColor: [Math.random(), Math.random(), Math.random(), 1.0],
            //landColor: [0.5, 0.5, 0.5, 0.3],
            landVertices: buffers.vertices,
            landIndices: buffers.indices

        });
        this.addChild(country);
        totalVertices += Array.from(this.children.values())[this.children.size - 1].landVertices.length;
    }
    console.info("Countries' total vertices: " + totalVertices);


    this.onMouseMove = function (evt, mouse, inputManager) {

        if (inputManager.isDragging) {
            return;
        }
        var objectsUnderPoint = mousePicker.getObjectsUnderMouse(
            Array.from(this.children.values()),
            mouse.x,
            mouse.y,
            inputManager.domElement.width,
            inputManager.domElement.height,
            inputManager.camera.pMatrix,
            inputManager.camera.vMatrix,
            3,
            WorldMap.prototype.processObject.bind(this),
            WorldMap.prototype.processVertex.bind(this)
        );

        this.mouseMoveTargets.splice(0);
        for (var i = 0, il = objectsUnderPoint.length; i < il; i++) {
            this.mouseMoveTargets.push({ id: objectsUnderPoint[i].id });
        }


    }

    this.onMouseDownLeft = function (evt, mouse, inputManager) {
        if (inputManager.isMouseDownRight) {
            return;
        }

        var objectsUnderPoint = mousePicker.getObjectsUnderMouse(
            Array.from(this.children.values()),
            mouse.x,
            mouse.y,
            inputManager.domElement.width,
            inputManager.domElement.height,
            inputManager.camera.pMatrix,
            inputManager.camera.vMatrix,
            3,
            WorldMap.prototype.processObject.bind(this),
            WorldMap.prototype.processVertex.bind(this)
        );

        if (objectsUnderPoint.length > 0) {
            wiki.getPage(
                this.children.get(objectsUnderPoint[0].id).admin, 
                function (page) {
                    document.getElementById("info").innerHTML = page.firstPassage;
                },
                10);
        }

         

    };
}
WorldMap.prototype.processInput = function (inputManager) {


    mx.mat4SetIdentity(this.matrix);
    mx.mat4Scale(this.matrix, [0.5, 0.5, 0.5]);


    if (this.uIsFlat == 1) {
        mx.mat4RotateX(this.matrix, inputManager.phi);
        mx.mat4RotateY(this.matrix, inputManager.theta);
        if (this.uCoeff > 0) {
            this.uCoeff -= 0.01;
        } else {
            this.uCoeff = 0;
        }
    } else {
        mx.mat4RotateY(this.matrix, inputManager.theta);
        mx.mat4RotateZ(this.matrix, 23.5 * Math.PI / 180);
        if (this.uCoeff < 1) {
            this.uCoeff += 0.01;
        } else {
            this.uCoeff = 1;
        }
    }

};
WorldMap.prototype.updateMouseMoveTargets = function () {
    var countryNames = "";
    for (var i = 0, il = this.mouseMoveTargets.length; i < il; i++) {
        var c = this.mouseMoveTargets[i];
        var country = this.children.get(c.id);
        country.LAND.color = c.color || this.selectColor;
        // countryNames = countryNames.concat(country.name).concat(' / ');
        // countryNames = countryNames.concat(country.name_long).concat(' / ');
        // countryNames = countryNames.concat(country.admin).concat(' / ');
        // countryNames = countryNames.concat(country.name_sort).concat("\n");
    }
    // document.getElementById("indicator2").innerHTML = countryNames;
};

WorldMap.prototype.onKeyDown = function (evt, keyCode, inputManager) {
    if (keyCode == 70) {
        this.uIsFlat = this.uIsFlat ? 0 : 1;
    }

}


WorldMap.prototype.processObject = function (country) {
    var land = country.LAND;
    land.color = country.landColor;
    return land;
}
WorldMap.prototype.processVertex = function (x, y, z) {

    if (this.uIsFlat == 1) {

        //    x /= 2.0;
        //    y /= 2.0;
        //    z /= 2.0;

        return [x * 2, y, z];
    } else if (this.uIsFlat == 0) {
        var lon = (x + 1.0) * Math.PI;
        var lat = (y + 1.0) / 2.0 * Math.PI;
        //spere equation :     F(u, v) = [ cos(u)*sin(v)*r, cos(v)*r, sin(u)*sin(v)*r ]
        var X = Math.cos(lon) * Math.sin(lat) * (-1.0); // multiply by -1 one to get rid of mirror effect 
        var Y = Math.cos(lat) * (-1.0); // multiply by -1 one to make north north
        var Z = Math.sin(lon) * Math.sin(lat);
        // X /= 2.0;
        // Y /= 2.0;
        // Z /= 2.0;
        return [X, Y, Z];
    }


}