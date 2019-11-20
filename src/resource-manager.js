
function ResourceManager(props) {

    // this.files = null;
    // this.finalCallback = null;
    this.store = {};

    Object.assign(this, props);
};
// test: /\.(md)$/,
//     loader: path.resolve(__dirname, './utils/markdown-loader.js'),
//       },
// {
//     test: /\.(txt|shader)$/,
//         loader: 'raw-loader',
//       },
// {
//     test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
//         loader: 'url-loader?limit=10000',
//       },
// {
//     test: /\.(eot|ttf|wav|mp3|ogv)$/,
//        loader: 'file-loader',
ResourceManager.prototype = {
    constructor: ResourceManager,
    load: function (urls) {
        return Promise.all(
            urls.map(function (url, i, a) {
                return fetch(window.location.origin+"/"+url).then(
                    function (response) {
                        return new Promise(function (resolve, reject) {
                            if (/\.(eot|ttf|wav|mp3|ogv)$/.test(url)) {
                                response.blob().then(function (blob) {
                                    var audio = new Audio();
                                    audio.src = URL.createObjectURL(blob)
                                    audio.onload = function (evt) {
                                        this.store[url] = audio;
                                        resolve(audio);
                                    }.bind(this)
                                    audio.onerror = function (evt) {
                                        reject(evt);
                                    }
                                }.bind(this), function (err) { reject(err); })
                            } else if (/\.ogv$/.test(url)) {
                                response.blob().then(function (blob) {
                                    var video = document.createElement('video');
                                    video.src = URL.createObjectURL(blob);
                                    video.onload = function (evt) {
                                        this.store[url] = video;
                                        resolve(video);
                                    }.bind(this)
                                    video.onerror = function (evt) {
                                        reject(evt);
                                    }
                                }.bind(this), function (err) { reject(err); })

                            } else if (/\.(png|jpg|jpeg|gif)$/.test(url)) {
                                response.blob().then(function (blob) {
                                    var image = new Image();
                                    image.src = URL.createObjectURL(blob);
                                    image.onload = function (evt) {
                                        this.store[url] = image;
                                        resolve(image);
                                    }.bind(this)
                                    image.onerror = function (evt) {
                                        reject(evt);
                                    }
                                }.bind(this), function (err) { reject(err); })

                            } else if (/\.json$/) {
                                response.json().then(function (json) {
                                    this.store[url] = json;
                                    resolve(json);
                                }.bind(this), function (err) { reject(err); })

                            } else {
                                response.text().then(function (text) {
                                    this.store[url] = text;
                                    resolve(text);
                                }.bind(this), function (err) { reject(err); })

                            }
                        }.bind(this));
                    }.bind(this),
                    function (err) {
                        console.log(err);
                    })
            }.bind(this))
        );
    },

};

// ResourceManager.prototype.loadAllResources = function (finalCallback) {
//     this.numFilesToLoad = this.files.length;
//     this.numFilesLoaded = 0;
//     this.finalCallback = finalCallback;

//     var fileName,
//         fileCallback
//         ;
//     for (var i = 0, l = this.files.length; i < l; i++) {
//         fileName = this.files[i].path;
//         fileCallback = this.files[i].callback;
//         if (this.files[i].type === "image") {
//             this.loadImage(fileName, fileCallback);
//         } else {
//             this.loadText(fileName, fileCallback);
//         }
//     }

// };


// ResourceManager.prototype.loadText = function (url, fileCallback) {
//     var xmlhttp = new XMLHttpRequest();
//     var that = this;
//     xmlhttp.onreadystatechange = function () {

//         if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
//             this.store[url] = xmlhttp.responseText;
//             if (fileCallback) {
//                 fileCallback(xmlhttp);
//             }
//             that.numFilesLoaded++;
//             if (this.finalCallback && that.numFilesLoaded == that.numFilesToLoad) {
//                 that.finalCallback();
//             }
//         };
//     }.bind(this);

//     xmlhttp.open("GET", url, true);
//     xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
//     xmlhttp.send();
// };

// ResourceManager.prototype.loadImage = function (url, fileCallback) {
//     var image = new Image();

//     image.src = url;
//     image.webglTexture = null;
//     image.onload = function (e) {

//         this.store[url] = image;
//         if (fileCallback) {
//             fileCallback(image);
//         }

//         this.numFilesLoaded++;
//         if (this.finalCallback && this.numFilesLoaded == this.numFilesToLoad) {
//             this.finalCallback();
//         }
//     }.bind(this);
// };

ResourceManager.prototype.getResource = function (url) {
    if (!this.store[url]) {
        console.log(" ResourceManager.prototype.getResource : no such resource " + url);
        return;
    }
    return this.store[url];
};


if (typeof module !== "undefined") {
    module.exports = ResourceManager;
}