
var WebGLContext = require('./webgl-context');
var ResourceManager = require('./resource-manager');
var TextureManager = require('./texture-manager');

module.exports = Runner;

function Runner(options) {

    this.canvas = null;
    this.context = null;
    this.animationID = -1;
    this.textureManager = null;
    this.resourceManager = null;
    this.scenes = {};
    this.scene = null;
    this.socket = null;
    this.players = [];
    this.echos = [];
    this.commands = new Map();
    this.programs = {};
    Object.assign(this, options);
};


Runner.prototype = {
    constructor: Runner,

    load: function () {
        this.resourceManager = new ResourceManager();
        return this.resourceManager.load(this.resources);
    },
    init: function () {
        this.context = new WebGLContext(this.canvas);
        this.context.programs = Object.keys(this.programs).reduce(function (p, c, i, arr) {
            p[c] = this.programs[c](this.context.gl);
            return p;
        }.bind(this), {});
        //  CONTEXT.gl.clearColor(0.0, 0.15, 0.3, 1.0);
        //  GL.clearColor(1.0, 1.0, 1.0, 1.0);
        this.textureManager = new TextureManager({
            gl: this.context.gl,
            ioManager: this.resourceManager
        });
        //INPUTMANAGER = new InputManager();

        //INPUTMANAGER.init(CONTEXT.canvas);

        this.initWorld();

        this.initDOMListeners();
        //TODO : remove this reference

        // this.initSocket();

        return Promise.resolve(true);
    },

    releaseResources: function () {
        var gl = this.context.gl;

        this.context.meshes.forEach(function (v, k, a) {
            delete v[this.context.id];
        }.bind(this))

        this.context.buffers.forEach(function (v, k, a) {
            gl.deleteBuffer(v.ibo);
            gl.deleteBuffer(v.vbo);
        })
        Object.keys(this.textureManager.store).forEach(function (e, i) {
            gl.deleteTexture(this.textureManager.store[e].texture);
        }.bind(this))
        gl.getExtension('WEBGL_lose_context').loseContext();

    },

    startRunnerLoop(time) {

        this.runnerLoop();
    },

    stopRunnerLoop() {
        cancelAnimationFrame(this.animationID);
        this.animationID = -1;
        console.log('runner loop stopped');
    },

    runnerLoop: function () {

        if (this.scene) {
            //receive package  - has step
            //unpack 
            //this.scene.children[palyer].inputManager feed events
            //update ui
            // for(var echo of this.echos){
            //     this.scene.unpack(echo);
            // }
            // this.echos = [];

            for (var c of this.commands) {
                var player = this.scene[c[0]];
                if (c[1].length) {
                    console.log(c);
                }
                if (player) {
                    player.commandManager.notify(c[1]);
                }
                this.commands.delete(c[0]);
            }
            // this.scene.local.commandManager.notify(this.scene.local.commandManager.queue);

            this.scene.processInput();

            //at this point matrices must be identical on al endpoints
            this.scene.update();
            this.scene.draw(this.context, this.textureManager);
            // this.scene.render(CONTEXT, TEXTUREMANAGER);
            this.context.gl.flush();

            //all this in  a async function
            //gather input 
            //send the packet
            //then
            // if (this.scene.local.commandManager.queue.length) {
            //     this.socket.emit('player', { id: this.scene.local.ID, commands: this.scene.local.commandManager.queue });
            //     this.scene.local.commandManager.queue.splice(0);
            // }
            //this.socket.emit('echo',this.scene.echo);
            // if(Object.keys(this.scene.echo).length){
            //     console.log(this.scene.echo);
            // }
            //this.scene.echo = {};

            //this call whenever package is received unless static animations
            this.animationID = window.requestAnimationFrame(this.runnerLoop.bind(this));

        }
    },
    initSocket() {
        var socket = this.socket;


        // this.echoId = 0;
        // socket.on('echo',function(echo){

        //     this.echos.push(echo);
        //     this.echoId++;
        //     if(this.echoId%100 === 0){
        //         console.log('echo %d',this.echoId)
        //     }
        //     if(Object.keys(echo).length){
        //         console.log(echo);
        //     }
        // }.bind(this))

        this.commandID = 0;
        socket.on('player', function (player) {
            this.commands.set(player.id, player.commands);
            this.commandID++;
            if (this.commandID % 100 === 0) {
                console.log('commands %d', this.commandID)
            }
        }.bind(this))
    },
    initDOMListeners: function () {

        var domElement = this.context.canvas;

        domElement.addEventListener("dblclick", this.doubleClick.bind(this));

        document.onkeyup = this.releaseKey.bind(this);
        document.onkeydown = this.pressKey.bind(this);


        domElement.addEventListener("mousedown", this.mouseDown.bind(this));
        domElement.addEventListener("mouseup", this.mouseUp.bind(this));
        domElement.addEventListener("mousemove", this.mouseMove.bind(this));

        domElement.addEventListener("touchstart", this.mouseDown.bind(this));
        domElement.addEventListener("touchend", this.mouseUp.bind(this));
        domElement.addEventListener("touchmove", this.mouseMove.bind(this));
        domElement.onwheel = this.wheel.bind(this);
        domElement.oncontextmenu = this.contextMenu.bind(this);
        window.addEventListener("resize", this.onResize.bind(this));


    },
    pressKey: function (evt) {
        // var keyCode = evt.keyCode;

        // if (keyCode == 49) {
        //     this.scene = EARTHSCENE;
        // } else if (keyCode == 50) {
        //     this.scene = DRAGONSCENE;
        // } else if (keyCode == 51) {
        //     this.scene = BATTLESCENE;
        // } else if (keyCode == 52) {
        //     this.scene = WORLDSCENE;
        // } else if (keyCode == 53) {
        //     this.scene = BATTLESCENE2;
        // }

        if (this.scene) {
            this.scene.inputManager.keydown(evt);
        }
    },
    releaseKey: function (evt) {

        if (this.scene) {
            this.scene.inputManager.keyup(evt);
        }

    },

    mouseDown: function (evt) {
        if (this.scene) {
            this.scene.inputManager.mouseDown(evt);
        }
    },
    mouseUp: function (evt) {

        if (this.scene) {
            this.scene.inputManager.mouseUp(evt);
        }

    },


    mouseMove: function (evt) {

        if (this.scene) {
            var mouse = this.scene.inputManager.mouseMove(evt);
        }

    },

    wheel: function (evt) {

        if (this.scene) {
            this.scene.inputManager.onWheel(evt);
        }
    },


    contextMenu: function (evt) {

        if (this.scene) {
            this.scene.inputManager.onContextMenu(evt);
        }

        return false;
    },



    doubleClick: function (evt) {

        if (this.animationID === -1) {
            this.startRunnerLoop();
        } else {
            this.stopRunnerLoop();
        }

    },

    onResize: function (evt) {


    }
};




