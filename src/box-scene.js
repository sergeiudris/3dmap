var mxgl = require('gl-matrix');
var mx = require('./mx');
var InputManager = require('./input-manager');
var Scene = require('./scene');
var SceneObject = require('./scene-object');
var Camera = require('./camera');
var lattice = require('./meshes/lattice');
var picker = require('./mouse-picker');
var Target = require('./target');


module.exports = BoxScene;

function BoxScene(props) {

    Scene.call(this);


    this.hotkeys = {
        "move_left": [{ code: "ArrowLeft", keyCode: 37 }, { code: "KeyA", keyCode: 65 }],
        "move_right": [{ code: "ArrowRight", keyCode: 39 }, { code: "KeyA", keyCode: 68 }],
        "move_up": [{ code: "PageDown", keyCode: 34 }, { code: "KeyQ", keyCode: 81 }],
        "move_down": [{ code: "PageUp", keyCode: 33 }, { code: "KeyE", keyCode: 69 }],
        "move_forward": [{ code: "ArrowUp", keyCode: 38 }, { code: "KeyA", keyCode: 87 }],
        "move_backward": [{ code: "ArrowDown", keyCode: 40 }, { code: "KeyS", keyCode: 83 }],
    };

    Object.assign(this, props);

    return this;

};
BoxScene.prototype = Object.create(Scene.prototype);
BoxScene.prototype.constructor = BoxScene;

BoxScene.prototype.processInput = function () {

    //TODO fix this crap
    var matrix = this.camera.vMatrix,
        inputManager = this.inputManager
        ;

    if (inputManager.checkIsKeyDown(this.hotkeys["move_forward"])) {
        // mx.mat4TranslateZ(matrix, -0.02);
        mxgl.mat4.translate(matrix, matrix, [0, 0, +0.02]);

    } else if (inputManager.checkIsKeyDown(this.hotkeys["move_backward"])) {
        // mx.mat4TranslateZ(matrix, 0.02);
        mxgl.mat4.translate(matrix, matrix, [0, 0, -0.02]);

    }

    if (inputManager.checkIsKeyDown(this.hotkeys["move_left"])) {
        //mx.mat4RotateY(matrix, 0.02);
        mxgl.mat4.translate(matrix, matrix, [0.02, 0, 0]);
    } else if (inputManager.checkIsKeyDown(this.hotkeys["move_right"])) {
        // mx.mat4RotateY(matrix, -0.02);
        mxgl.mat4.translate(matrix, matrix, [-0.02, 0, 0]);
    }

    if (inputManager.checkIsKeyDown(this.hotkeys["move_up"])) {
        // mx.mat4TranslateY(matrix, -0.02);
        mxgl.mat4.translate(matrix, matrix, [0, -0.02, 0]);

    } else if (inputManager.checkIsKeyDown(this.hotkeys["move_down"])) {
        //  mx.mat4TranslateY(matrix, +0.02);
        mxgl.mat4.translate(matrix, matrix, [0, 0.02, 0]);
    }

    if (inputManager.wheelDeltaY) {
        mx.mat4TranslateZ(matrix, inputManager.wheelDeltaY / 240);
        // mxgl.mat4.translate(matrix, matrix, [0,  0,inputManager.wheelDeltaY / 240]);
        inputManager.wheelDeltaY = 0;
    }
    //mx.mat4SetIdentity(this.matrix);
    //mx.mat4RotateY(this.matrix, this.inputManager.getTheta());

    if (inputManager.checkIsKeyDown(17)) {
        if (inputManager.isMouseDownLeft) {
            mxgl.mat4.rotate(this.matrix, this.matrix, this.inputManager.getTheta(), [0, 1, 0]);
            //mx.mat4RotateX(matrix,  this.inputManager.getTheta());
            this.inputManager.getPhi();
        } else if (inputManager.isMouseDownRight) {
            mx.mat4RotateX(matrix, this.inputManager.getPhi());
            this.inputManager.getTheta();
            //mx.mat4RotateY(matrix, this.inputManager.getTheta());
        }
    } else {
        this.inputManager.getTheta();
        this.inputManager.getPhi();
    }


    //mx.mat4RotateX(this.matrix, this.inputManager.getPhi());
    //this.inputManager.doInertia();

}

BoxScene.prototype.update = function () {
    var entities = this.entities;
    for (var i = 0, il = entities.length; i < il; i++) {

        entities[i].update();

    }

}

BoxScene.prototype.draw = function (context, textureManager) {

    var gl = context.gl
        ;
    gl.clearColor(0.3, 0.3, 0.3, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    this.render(context, textureManager);



}
BoxScene.prototype.init = function (ioManager, domElement) {

    this.camera = new Camera();
    this.camera.init(domElement.width, domElement.height);
    this.inputManager = new InputManager();
    this.inputManager.init(domElement, this.camera);

    //  var cube = new Cube();

    this.selectedEntities = [];
    this.entities = [];
    this.rows = 25;
    this.columns = 25;
    this.localPlayer = new SceneObject({ query: 'localPlayer' });
    this.addChild(this.localPlayer);
    for (var i = 0; i <= this.rows * this.columns; i++) {

        var x = 1 - 2 * (i % this.rows) / this.rows; //how far in the row
        var z = 1 - 2 * (Math.floor(i / this.rows)) / this.columns; // how many rows

        //skip one x,0,1 row and 1,0,z column 
        if (z == 1 || x == 1) {
            continue;
        }
        var target = new Target();
        mx.mat4Scale(target.matrix, [0.01, 0.01, 0.01]);
        mx.mat4TranslateX(target.matrix, x);
        mx.mat4TranslateZ(target.matrix, z);
        this.entities.push(target);
        target.uoa += this.localPlayer.children.size;
        this.localPlayer.addChild(target);
    }
    console.info("Number of entities: " + this.entities.length);


    //add lattice
    this.lattice = new SceneObject({
        mesh: lattice(25, 25),
        mode: "LINES",
        color: [1, 0.5, 0.2, 1],
        programName: "position"
    });
    this.addChild(this.lattice);

    this.line001 = new SceneObject({
        mesh: {
            aPosition: 3,
            aColor: 0,
            aUV: 0,
            vertices: [0, 0, 0, -1, 1, -1],
            indices: [0, 1]
        },
        mode: "LINES",
        color: [1, 0, 0, 1],
        programName: "position"
    });
    this.addChild(this.line001);

    mxgl.mat4.rotate(this.camera.vMatrix, this.camera.vMatrix, 35 / 180 * Math.PI, [1, 0, 0]);

    //TODO this is wrong  - need to pass context - otherwise wi bound prototype function to last this instace - HUGE BUG 
    this.onMouseMove = function (evt, mouse, inputManager) {


        if (inputManager.isMouseDownRight || inputManager.isMouseDownLeft) {
            return;
        }

        var entitiesUnderMouse = picker.getObjectsUnderMouse(
            this.entities,
            mouse.x,
            mouse.y,
            inputManager.domElement.width,
            inputManager.domElement.height,
            inputManager.camera.pMatrix,
            inputManager.camera.vMatrix,
            5,
            function (entity) {
                //  entity.BODY.color = [1, 1, 1, 1];
                if (!entity.isSelected) {
                    entity.setColor(1, 1, 1, 1);
                }
                return entity.BODY;
            }
        );
        var coordinatesString = "";
        for (var i = 0, il = entitiesUnderMouse.length; i < il; i++) {
            var entity = entitiesUnderMouse[i];
            //  entity.color = [0, 1, 0, 1];

            if (!entity.isSelected) {
                entity.setColor(0, 1, 0, 1);

            }
            //var cm = entity.BODY.getConcatenatedMatrix();

            //mx.mat4Multiply(cm, inputManager.camera.vMatrix, cm);
            //coordinatesString += [cm[12].toFixed(2), cm[13].toFixed(2), cm[14].toFixed(2)].join(',');
            //entity.setState({position:coordinatesString})
        }
        // document.getElementById("indicator3").innerHTML = coordinatesString;

    };

    this.onMouseUpLeft = function (evt, mouse, inputManager) {

        if (inputManager.isMouseDownRight) {
            return;
        }

        var entitiesUnderMouse = picker.getObjectsUnderMouse(
            this.entities,
            mouse.x,
            mouse.y,
            inputManager.domElement.width,
            inputManager.domElement.height,
            inputManager.camera.pMatrix,
            inputManager.camera.vMatrix,
            5,
            function (child) {
                // entity.color = [1, 1, 1, 1];
                return child.BODY;
            }
        );
        var coordinatesString = "";

        if (entitiesUnderMouse.length > 0) {
            for (var i = 0, il = this.selectedEntities.length; i < il; i++) {
                this.selectedEntities[i].isSelected = false;
            }
            this.selectedEntities.splice(0);
        }



        for (var i = 0, il = entitiesUnderMouse.length; i < il; i++) {
            var entity = entitiesUnderMouse[i];
            //  entity.BODY.color = [1, 0, 0, 1];
            entity.isSelected = true;
            entity.setColor(0.1, 0.3, 1, 1);
            // entity.path.push([-1, 1, -1, 1]);
            this.selectedEntities.push(entity);
            console.log(entity.uoa);

            var cm = entity.BODY.getConcatenatedMatrix();
            coordinatesString += [cm[12].toFixed(2), cm[13].toFixed(2), cm[14].toFixed(2)].join(',');
            entity.setState({ position: coordinatesString })

        }

        //drawing ray

        // var vectors = picker.get_direction_and_origin(
        //     mouse.x,
        //     mouse.y,
        //     inputManager.domElement.width,
        //     inputManager.domElement.height,
        //     inputManager.camera.pMatrix,
        //     inputManager.camera.vMatrix,
        //     this.getConcatenatedMatrix());
        // var o = vectors.origin;
        // var d = vectors.direction;


        // var line = new Mesh({
        //     model: new Model({
        //         aPosition: 3,
        //         aColor: 0,
        //         aUV: 0,
        //         vertices: [o[0], o[1], o[2], d[0], d[1], d[2]],
        //         indices: [0, 1]
        //     }),
        //     mode: "LINES",
        //     color: [0, 1, 1, 1],
        //     programName: "mesh_position"
        // });
        // console.log(line.model.vertices);
        // this.addChild(line);


        // arguments:  mouseX, mouseY, viewportWidth, viewportHeight, pMatrix, vMatrix, mMatrix, A, B, C/*unused*/, D


    };

    this.onMouseUpRight = function (evt, mouse, inputManager) {



        var point = picker.ray_plane(
            mouse.x,
            mouse.y,
            inputManager.domElement.width,
            inputManager.domElement.height,
            inputManager.camera.pMatrix,
            inputManager.camera.vMatrix,
            this.lattice.getConcatenatedMatrix(),
            [-1, 0, 1], // A
            [-1, 0, -1], // B
            [1, 0, -1], // C
            [1, 0, 1] // D
        );

        console.log(point);

        for (var i = 0, il = this.selectedEntities.length; i < il; i++) {

            var entity = this.selectedEntities[i];
            //  entity.setColor(1, 0, 0, 1);
            if (point) {
                entity.path.push(point.slice(0));
            }
            //entity.path.push([1,0,1,1]);
        }


    }

    this.inputManager.on("mouseup0", this.onMouseUpLeft.bind(this));
    this.inputManager.on("mouseup2", this.onMouseUpRight.bind(this));
    this.inputManager.on("mousemove", this.onMouseMove.bind(this));


    return this;



};



