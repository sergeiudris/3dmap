
precision mediump float;

attribute vec3 aPosition;

uniform mat4 uPMatrix;
uniform mat4 uMMatrix;
uniform mat4 uVMatrix;
uniform int uIsFlat; 
uniform float uCoeff;
//uniform mat4 uVMatrix;
varying vec4 vColor;
float PI = 3.1415926;

void main(void){

    gl_PointSize = 1.0; // default point size is 0 so pint are not visible
    vec3 pos = aPosition;
    
// at this point world map is just a squre x(-1.0,1.0), y(-1.0,1.0)
  
// option A: make world map a 2/1 rect
      pos.x *= 2.0;
       
    //   pos.x /= 2.0;
    //   pos.y /= 2.0;
    //   pos.z /= 2.0;

//option B: make world map a sphere
    if(uIsFlat == 0){
     pos.x /= 2.0; 
     float lon = (pos.x  + 1.0)* (1.0 - uCoeff + PI*uCoeff);
     float lat = (pos.y + 1.0) / 2.0* (1.0 - uCoeff + PI*uCoeff);
     
     //spere equation : F(u, v) = [ cos(u)*sin(v)*r, cos(v)*r, sin(u)*sin(v)*r ]
     pos.x = cos(lon)*sin(lat)*(-1.0); // multiply by -1 one to get rid of mirror effect 
     pos.y = cos(lat)*(-1.0); // multiply by -1 one to make north north
     pos.z = sin(lon)*sin(lat);

     // pos.y /= 2.0;
    //  pos.z /= 2.0;
    }
// new position vector  
  gl_Position =  uPMatrix*uVMatrix* uMMatrix*vec4(pos,1.0); 
}