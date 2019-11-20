
module.exports = TextureManager;

function TextureManager(props) {

    this.ioManager = null;
    this.store = {};
    this.idCounter = 0;
    if (props) {
        for (var p in props) {
            if (props.hasOwnProperty(p)) {
                this[p] = props[p];
            }
        }
    }

    if (!this.ioManager) {
        console.error("TextureManger was contructed without IOManager...");
    }    

}


TextureManager.prototype.getTexture = function(url) {
    var gl = this.gl;

    var textureObj = this.store[url];

    if (!textureObj) {
        var image = this.ioManager.getResource(url);
        if (!image) {
            console.log("getTexture() : image " + url + " has not been loaded");
            return;
        }
        var texture = this.createStandardTexture(image);
        this.store[url] = {
            texture: texture,
            id: this.idCounter++
        };
        textureObj = this.store[url];
    }

    return textureObj;
   
}




TextureManager.prototype.createStandardTexture = function(image) {
        var gl = this.gl;
        var texture = gl.createTexture();
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.activeTexture(gl["TEXTURE" + this.idCounter]);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);
        return texture;
};