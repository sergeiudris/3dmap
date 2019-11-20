
var SceneObject = require('./scene-object');

module.exports = Country;

function Country(props) {

    SceneObject.call(this);

    Object.assign(this, props);

    this.init();
};
Country.prototype = Object.create(SceneObject.prototype);
Country.prototype.constructor = Country;


Country.prototype.init = function () {

    this.LAND = new SceneObject({
        color: this.landColor,
        mesh: {
            aPosition: 3,
            aColor: 0,
            aUV: 0,
            vertices: this.landVertices,
            indices: this.landIndices
        },
        programName: "sphere_plane"
    });
    this.addChild(this.LAND);

};
Country.prototype.update = function () {

};

