
module.exports = WebGLContext;


function WebGLContext(canvas) {

    this.canvas = canvas; //document.getElementById(canvasID);
    this.id = (Math.random() * Math.pow(32, 6)).toString(36).slice(0, 4);
    this.programs = {};
    this.buffers = new Map();
    this.meshes = new Map();
    this.activeProgram = null;
    if (!this.canvas) {
        console.error("Couldn't find DOM element " + canvas);
        return null;
    }
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;

    try {
        this.gl = this.canvas.getContext("webgl", { antialias: true }) || this.canvas.getContext("experimental-webgl", { antialias: true });
    } catch (e) {
        alert("You are not webgl compatible :(");
        console.error("Couldn't inititalize webgl context...");
    }

    this.initGL();
}

WebGLContext.prototype.initGL = function () {

    var gl = this.gl,
        canvas = this.canvas
        ;

    gl.getExtension("OES_element_index_uint") ||
        gl.getExtension("MOZ_OES_element_index_uint") ||
        gl.getExtension("WEBKIT_OES_element_index_uint");

    gl.viewport(0.0, 0.0, canvas.width, canvas.height);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clearDepth(1.0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    //gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    //  gl.enable(gl.CULL_FACE);
    // OPTIONAL
    // gl.enable(gl.VERTEX_PROGRAM_POINT_SIZE);// enables setting point size, although works without it
};




WebGLContext.prototype.getProgram = function (name) {

    return this.programs[name];

}

WebGLContext.prototype.allocateBuffers = function (mesh) {

    var gl = this.gl,
        buffer = {
            vbo: gl.createBuffer(),
            ibo: gl.createBuffer()
        }
        ;

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertices), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices), gl.STATIC_DRAW);


    this.buffers.set(mesh[this.id], buffer);
    return buffer;

}

WebGLContext.prototype.getBuffersById= function(id){
    return this.buffers.get(id);
}

WebGLContext.prototype.getBuffersByIndex = function (index) {

    return this.buffers[index]

}




WebGLContext.prototype.addMesh = function (mesh) {
    mesh.index = this.meshes.length;
    this.meshes.push(mesh);
}

