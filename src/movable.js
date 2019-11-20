const mx = require('./mx');
const mxgl = require ('gl-matrix')

mxgl.vec4.setLength = function(out, a, length) {
    var x = a[0],
       y = a[1],
       z = a[2],
       w = a[3];
   var len = x*x + y*y + z*z + w*w;
   if (len > 0) {
       len = length / Math.sqrt(len);
       out[0] = x * len;
       out[1] = y * len;
       out[2] = z * len;
       out[3] = w * len;
   }
   return out;
}

module.exports = Movable;

function Movable() {

}

Movable.prototype.move = function (o) {

    var path = o.path,
        direction = o.direction,
        position = o.position,
        nextPoint,
        distanceToNextPoint
        ;
    if (path.length > 0) {

        nextPoint = path[0];
        mx.mat4GetVec4(position, o.matrix); // o.position,
        mxgl.vec4.subtract(direction, nextPoint, position);
        distanceToNextPoint = mxgl.vec4.length(direction);
        mxgl.vec4.setLength(direction, direction, o.speed);

        if (distanceToNextPoint >= o.speed) {
            //mxgl.vec4.add(position, position, direction);
            //mxgl.mat4.translate(o.matrix, o.matrix, direction);
            mx.mat4TranslateRaw(o.matrix, direction);
            //     console.log(distanceToNextPoint.toFixed(3));

        } else {
            mxgl.vec4.setLength(direction, direction, distanceToNextPoint);
            // mxgl.mat4.translate(o.matrix, o.matrix, direction);
            mx.mat4TranslateRaw(o.matrix, direction);
            // mx.mat4GetVec4(position, o.matrix); // o.position,
            // mxgl.vec4.subtract(direction, nextPoint, position);
            // distanceToNextPoint = mxgl.vec4.length(direction);
            // console.log("distance to target:" + distanceToNextPoint.toFixed(3));
            path.splice(0, 1);
            this.move(o);
        }
        //  mxgl.mat4.translate(o.matrix, o.matrix, nextPoint);
        //  path.splice(0, 1);

    }

};

