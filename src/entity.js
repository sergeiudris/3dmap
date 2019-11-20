
var SceneObject = require('./scene-object');
var Cube = require('./meshes/cube');

module.exports = Entity;

function Entity(props) {

    SceneObject.call(this);

    this.isSelected = false;
    this.health_ = 100;
    this.speed_ = 1;
    this.determination_ = 100;
    this.strike_ = 10;
    this.direction = [1, 0, 0, 0];
    this.position = [1, 0, 0, 0];
    this.path = [];

    this.state ={
        color: [1.0,1.0,1.0,1.0]
    }

    Object.assign(this, props);

    this.BODY = new SceneObject({
        mesh: Cube,
        textureUrl: "resources/wood.png",
        programName: "position_uv",
        mode: "TRIANGLES"
    });

    this.addChild(this.BODY);

}
Entity.prototype = Object.create(SceneObject.prototype);
Entity.prototype.constructor = Entity;

