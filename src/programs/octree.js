
import GLSLProgram from '../program';

module.exports = function (gl) {

    return new GLSLProgram({
        name: "octree",
        attributeNames: ["aPosition"],
        uniformNames: ["uVMatrix", "uMMatrix", "uSizeCell", "uCenterCell", "uColor", "uPMatrix"],
        vsCode: require('./octree.vs.cpp'),
        fsCode: require('./octree.fs.cpp'),
    })
        .init(gl);

};