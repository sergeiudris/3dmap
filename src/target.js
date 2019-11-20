
var mx = require('./mx');
var mxgl = require('gl-matrix');
var Entity = require('./entity');
var Movable = require('./movable');

module.exports = Target;


function Target(props) {
    Entity.call(this);

    this.query = "entity&target";

    this.rotation = Math.random() * 0.01 - 0.01;
    this.speed = 0.01;

    this.movable_ = new Movable();

    this.setColor(1, 1, 0, 0.2);

    Object.assign(this, props);
}

Target.prototype = Object.create(Entity.prototype);
Target.prototype.constructor = Target;

Target.prototype.update = function () {

    // mxgl.mat4.rotate(this.matrix, this.matrix, this.rotation, [0, 1, 0]);
    this.movable_.move(this);
    mx.mat4RotateY(this.matrix, this.rotation);
    mx.mat4RotateX(this.matrix, this.rotation);



}
Target.prototype.setColor = function (r, g, b, a) {

    var color = this.state.color;
    if (color) {

        color[0] = r;
        color[1] = g;
        color[2] = b;
        color[3] = a;

    } else {
        color = [r, g, b, a];
    }

};


