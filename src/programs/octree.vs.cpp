attribute vec3 aPosition;

uniform mat4 uVMatrix,  uMMatrix,uPMatrix;

uniform vec3 uSizeCell, uCenterCell;

void main(void) { 
    gl_Position = uPMatrix*uVMatrix*uMMatrix*vec4(uCenterCell+(aPosition*uSizeCell), 1.0);
}