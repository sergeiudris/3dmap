attribute vec3 aPosition;

uniform mat4 uMMatrix;
uniform mat4 uVMatrix;
uniform mat4 uPMatrix;
uniform vec4 uColor;

varying vec4 vColor;

void main(void){
    
    gl_PointSize = 1.0; // default point size is 0 so pint are not visible
    
    vec3 pos = aPosition;
     
    gl_Position = uPMatrix*uVMatrix* uMMatrix*vec4(aPosition,1.0); 
  
    vColor = uColor;
}