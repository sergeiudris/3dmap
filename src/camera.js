
var mx = require('./mx');
var mxgl  = require('gl-matrix');

module.exports = Camera;

function Camera(props) {

    this.width = 0;
    this.height = 0;

    Object.assign(this, props);

}

Camera.prototype.init = function (width, height) {
    this.width = width;
    this.height = height;

    this.vMatrix = mx.mat4Create();

    // this.pMatrix =  mx.mat4GetProjection(70.0, width / height, 0.1, 100.0);
    this.pMatrix = mx.mat4Create();
    mxgl.mat4.perspective(this.pMatrix, 70.0, width / height, 0.1, 100.0);
    //mx.mat4TranslateZ(this.vMatrix, -3);
    mxgl.mat4.translate(this.vMatrix, this.vMatrix, [0, 0, -3]);

};

Camera.prototype.processInput = function (inputManager) {

    var matrix = this.vMatrix
        ;

    if (inputManager.checkIsKeyDown(33, 81)) {
        mx.mat4TranslateZ(this.vMatrix, -0.01);
    } else if (inputManager.checkIsKeyDown(34, 69)) {
        mx.mat4TranslateZ(this.vMatrix, 0.01);

    }

    if (inputManager.checkIsKeyDown(37, 65)) {
        mx.mat4TranslateX(this.vMatrix, 0.01);
    } else if (inputManager.checkIsKeyDown(39, 68)) {
        mx.mat4TranslateX(this.vMatrix, -0.01);
    }

    if (inputManager.checkIsKeyDown(38, 87)) {
        mx.mat4TranslateY(this.vMatrix, -0.01);

    } else if (inputManager.checkIsKeyDown(40, 83)) {
        mx.mat4TranslateY(this.vMatrix, +0.01);
    }

    if (inputManager.wheelDeltaY) {
        mx.mat4TranslateZ(this.vMatrix, inputManager.wheelDeltaY / 240);
        inputManager.wheelDeltaY = 0;
    }
};