
var SceneObject = require("./scene-object.js")

module.exports = Model;


function Model(props) {

    SceneObject.call(this);

    this.mesh = null;
    // this.color = [1.0, 1.0, 1.0, 1.0];
    this.textureUrl = null;
    this.programName = null;
    this.mode = "TRIANGLES";
    //matrix inherited identity
    //parent inherited null  
    //scene inherited null

    Object.assign(this, props);

    return this;
}
Model.prototype = Object.create(SceneObject.prototype);
Model.prototype.constructor = Model;



