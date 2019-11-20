var InputManager = require('./input-manager');
var Scene = require('./scene');
var Camera = require('./camera');
var picker = require('./mouse-picker');
var WorldMap = require('./world-map');
var mx = require('./mx');

module.exports = WorldScene;

function WorldScene(props) {
    Scene.call(this);

    Object.assign(this, props);

    return this;
};
WorldScene.prototype = Object.create(Scene.prototype);
WorldScene.prototype.constructor = WorldScene;

WorldScene.prototype.processInput = function () {

    this.camera.processInput(this.inputManager);

    this.worldMap.processInput(this.inputManager);
    this.inputManager.doInertia();
}
WorldScene.prototype.update = function () {

    this.worldMap.updateMouseMoveTargets();


}

WorldScene.prototype.draw = function (context, textureManager) {

    var gl = context.gl
        ;
    gl.clearColor(0.0, 0.15, 0.3, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    this.render(context, textureManager);


}
WorldScene.prototype.init = function (ioManager, domElement) {

    this.camera = new Camera();
    this.camera.init(domElement.width, domElement.height);
    this.inputManager = new InputManager();
    this.inputManager.init(domElement, this.camera);

    this.worldMap = new WorldMap({
        countryFeatures: ioManager.getResource("resources/geoLOW-min.json").features
    });

    this.addChild(this.worldMap);

    //TODO this is wrong  - need to pass context - otherwise wi bound prototype function to last this instace - HUGE BUG 
    this.inputManager.on("keydown", this.worldMap.onKeyDown.bind(this.worldMap));
    this.inputManager.on("mousemove", this.worldMap.onMouseMove.bind(this.worldMap));
    // this.inputManager.on("mousedownleft", this.worldMap.onMouseDownLeft.bind(this.worldMap));

    this.inputManager.on("mousedown0", this.worldMap.onMouseDownLeft.bind(this.worldMap));
    mx.mat4TranslateX(this.worldMap.matrix, 0.5);

    return this;

};

WorldScene.prototype.onMouseMove = function (evt) {

    // //TODO: get rid of it - choose way to subscrbe
    return;

    var mouse = this.inputManager.getStageMouse(evt);
    var normalizedMouse = this.inputManager.getNormalizedMouse(mouse);
    this.worldMap.onMouseMove(evt, normalizedMouse, this.inputManager, this.camera);


}
