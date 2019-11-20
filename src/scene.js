var SceneObject  = require('./scene-object');

module.exports = Scene;

function Scene(props) {

    SceneObject.call(this);

    this.models = [];
    this.camera = null;
    this.newModels = [];
    Object.assign(this, props);
}

Scene.prototype = Object.create(SceneObject.prototype);
Scene.prototype.constructor = Scene;

Object.assign(Scene.prototype, {

    nodeAddedDeep(node) {

        node.goDown(function (node) {
            if (node.mesh) {
                this.newModels.push(node);
            }
        }.bind(this))

    },
    nodeRemovedDeep(node) {

        node.goDown(function (node) {
            if (node.mesh) {
                var index = this.model.indexof(node);
                if (index !== -1) {
                    this.models.splice(index, 1);
                }
            }
        }.bind(this))
    },
    render(context, textureManager) {
        var contextId = context.id;
        if (this.newModels.length) {
            for (var i = this.newModels.length - 1; i >= 0; i--) {
                var m = this.newModels[i];
                if (!m.mesh[contextId]) {
                    m.mesh[contextId] = (Math.random() * Math.pow(32, 6)).toString(36).slice(0, 5);
                    context.meshes.set(m.mesh[contextId], m.mesh);
                    context.allocateBuffers(m.mesh);
                }
                this.models.push(this.newModels.splice(i, 1)[0]);
            }
            //inefficient
            this.models.sort(function (a, b) {
                var byMesh = a.mesh[contextId] < b.mesh[contextId] ? -1 : a.mesh[contextId] > b.mesh[contextId] ? 1 : 0;
                var byProgramName = a.programName < b.programName ? -1 : a.programName > b.programName ? 1 : 0;
                return byProgramName || byMesh;
            });
        }

        var models = this.models,
            model = null,
            program = null,
            buffers = null,
            mesh = null,
            currentProgramName = null,
            currentBufferId = null,
            gl = context.gl
            ;
            // OPTIMIZATION NEEDED  - less prop lookups
        for (var i = 0, il = models.length; i < il; i++) {

            model = models[i];
            mesh = model.mesh;
            if (currentProgramName !== model.programName) {
                if (program) {
                    program.unuse();
                }
                program = context.getProgram(model.programName);
                program.use();
                gl.uniformMatrix4fv(program.UNIFORMS.uPMatrix, false, this.camera.pMatrix);
                gl.uniformMatrix4fv(program.UNIFORMS.uVMatrix, false, this.camera.vMatrix);
                currentProgramName = model.programName;
            }
            if (currentBufferId !== mesh[contextId]) {
                buffers = context.getBuffersById(mesh[contextId]);
                program.prepareBuffers(mesh, buffers);
                currentBufferId = mesh[contextId];
            }

            program.loadUniforms(model, textureManager);
            gl.uniformMatrix4fv(program.UNIFORMS.uMMatrix, false, model.getConcatenatedMatrix());
            gl.drawElements(gl[model.mode || 'TRIANGLES'], mesh.indices.length, gl.UNSIGNED_SHORT, 0);

        }


    }

});