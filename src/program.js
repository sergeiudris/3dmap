"use strict";


module.exports = GLSLProgram;

function GLSLProgram(props) {
    // if (!props.gl) {
    //     console.error("no context was passed to GLSLProgram constructor");
    //     return;
    // }
    this.name = props.name;
    this.gl = props.gl;
    this.attributeNames = props.attributeNames || [];
    this.uniformNames = props.uniformNames || [];
    this.UNIFORMS = {};
    this.ATTRIBUTES = {};
    this.vsCode = props.vsCode || "no vs code";
    this.fsCode = props.fsCode || "no fs code";
    this.vertexShader = null;
    this.fragmentShader = null;
    this.program = null;
    this.prepareBuffers = props.prepareBuffers;
    this.loadUniforms = props.loadUniforms

    return this;
}

GLSLProgram.prototype.init = function (gl) {
    this.gl = gl;
    this.compileShaders();
    this.linkShaders();
    this.bindAttributes();
    this.getUniformLocations();

    console.info("GLSL program '" + this.name + "' created");
    return this;
    

};
GLSLProgram.prototype.use = function () {

    this.gl.useProgram(this.program);
    for (var i = 0, l = this.attributeNames.length; i < l; i++) {
        this.gl.enableVertexAttribArray(i);
    }

};
GLSLProgram.prototype.unuse = function () {

    this.gl.useProgram(null);
    for (var i = 0, l = this.attributeNames.length; i < l; i++) {
        this.gl.disableVertexAttribArray(i);
    }

};
GLSLProgram.prototype.compileShaders = function () {
    var gl = this.gl
        ;
    this.program = gl.createProgram();
    this.vertexShader = this.compileShader(gl.VERTEX_SHADER, this.vsCode);
    this.fragmentShader = this.compileShader(gl.FRAGMENT_SHADER, this.fsCode);

};


GLSLProgram.prototype.bindAttributes = function () {

    for (var i = 0, l = this.attributeNames.length; i < l; i++) {
        var attributeName = this.attributeNames[i];
        this.gl.bindAttribLocation(this.program, i, this.attributeNames[i]);
        this.ATTRIBUTES[attributeName] = this.gl.getAttribLocation(this.program, attributeName);
    }

};
GLSLProgram.prototype.getUniformLocations = function () {
    for (var i = 0, l = this.uniformNames.length; i < l; i++) {
        var unifromName = this.uniformNames[i];
        this.UNIFORMS[unifromName] = this.gl.getUniformLocation(this.program, unifromName);
    }
};

GLSLProgram.prototype.linkShaders = function () {
    var gl = this.gl
        ;
    gl.attachShader(this.program, this.vertexShader);
    gl.attachShader(this.program, this.fragmentShader);
    gl.linkProgram(this.program);

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
        console.log("couldn't initialize shaders");
    }

};
GLSLProgram.prototype.compileShader = function (type, shaderCode) {

    var gl = this.gl,
        shader = gl.createShader(type)
        ;

    gl.shaderSource(shader, shaderCode);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw gl.getShaderInfoLog(shader);
    }

    return shader;

};


