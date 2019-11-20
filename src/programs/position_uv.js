
import GLSLProgram from '../program';


module.exports = function (gl) {

    return new GLSLProgram ({
        name: "position_uv",
        attributeNames: ["aPosition", "aUV"],
        uniformNames: ["uPMatrix", "uMMatrix", "uSampler", "uVMatrix", "uColor"],
        vsCode: require('./position_uv.vs.cpp'),
        fsCode: require('./position_uv.fs.cpp'),
        prepareBuffers: function (mesh, buffers) {
            var gl = this.gl,
                stride = mesh.aPosition + mesh.aColor + mesh.aUV
                ;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vbo);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.ibo);
            gl.vertexAttribPointer(0, mesh.aPosition, gl.FLOAT, false, stride * 4, 0 * 4);
            gl.vertexAttribPointer(1, mesh.aUV, gl.FLOAT, false, stride * 4, (mesh.aPosition + mesh.aColor) * 4);

        },
        loadUniforms: function (model, textureManager) {
            var gl = this.gl;
            gl.uniform4fv(this.UNIFORMS.uColor,model.color || model.state.color || model.goUp(function(node){
                if(node.state.color || node.color){
                    return node.state.color || node.color;
                }
            }));
            var t = textureManager.getTexture(model.textureUrl);
            gl.uniform1i(this.UNIFORMS.uSampler, t.id);
        }
    })
        .init(gl);

};