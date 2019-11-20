
import GLSLProgram from '../program';


module.exports = function (gl) {

    return new GLSLProgram({
        name: "position",
        attributeNames: ["aPosition"],
        uniformNames: ["uPMatrix", "uMMatrix", "uColor", "uVMatrix"],
        vsCode: require('./position.vs.cpp'),
        fsCode: require('./position.fs.cpp'),
        prepareBuffers: function (mesh, buffers) {
            var gl = this.gl,
                stride = mesh.aPosition + mesh.aColor + mesh.aUV
                ;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vbo);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.ibo);
            gl.vertexAttribPointer(0, mesh.aPosition, gl.FLOAT, false, stride * 4, 0 * 4);

        },
        loadUniforms: function (model) {
            var gl = this.gl;
            gl.uniform4fv(this.UNIFORMS.uColor, model.color || model.state.color || model.goUp(function(node){
                if(node.state.color || node.color){
                    return node.state.color || node.color;
                }
            }));
        }
    })
        .init(gl);

};