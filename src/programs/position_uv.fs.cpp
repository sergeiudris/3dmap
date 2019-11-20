//fragment shader

precision mediump float;

varying vec2 vUV;
varying vec4 vColor;


uniform sampler2D uSampler;

void main(void){
    vec4 color  = vColor* texture2D(uSampler, vUV);
    gl_FragColor = vec4(color.rgb, 1.0);
}