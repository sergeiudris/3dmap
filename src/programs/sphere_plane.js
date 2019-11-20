

import GLSLProgram from '../program';

module.exports = function (gl) {

    return new GLSLProgram({
        name: "sphere_plane",
        attributeNames: ["aPosition"],
        uniformNames: ["uPMatrix", "uMMatrix", "uColor", "uVMatrix", "uIsFlat", "uCoeff"],
        vsCode: require('./sphere_plane.vs.cpp'),
        fsCode: require('./sphere_plane.fs.cpp'),
        prepareBuffers: function (model, buffers) {
            var gl = this.gl,
                stride = model.aPosition + model.aColor + model.aUV
                ;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vbo);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.ibo);
            gl.vertexAttribPointer(0, model.aPosition, gl.FLOAT, false, stride * 4, 0 * 4);

        },
        loadUniforms: function (mesh) {
            var gl = this.gl;
            //TODO this is very LOW performance. how to c++ ?
            gl.uniform4fv(this.UNIFORMS.uColor, mesh.searchTreeUp("color"));
            gl.uniform1i(this.UNIFORMS.uIsFlat, mesh.searchTreeUp("uIsFlat"));
            gl.uniform1f(this.UNIFORMS.uCoeff, mesh.searchTreeUp("uCoeff"));
        }

    })
        .init(gl);

};