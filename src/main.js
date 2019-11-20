
var WorldScene = require('./world-scene');
var BoxScene = require('./box-scene');

var Runner = require('./runner');


module.exports = {
    init: function () {

        var canvas = document.getElementById('target')

        var runner = new Runner({
            canvas:canvas,
            programs: {
                "sphere_plane": require('./programs/sphere_plane.js'),
                "position": require('./programs/position.js'),
                "position_uv": require('./programs/position_uv.js')
            },
            resources: [
                "./resources/geoLOW-min.json",
                "./resources/wood.png"
            ],
            initWorld: function () {
                this.scenes = {
                    WORLDSCENE: new WorldScene().init(this.resourceManager, this.context.canvas),
                    BOXSCENE: new BoxScene().init(this.resourceManager, this.context.canvas)
                }
                this.scene = this.scenes.WORLDSCENE;

                document.querySelector("#btn-map").addEventListener('click', function(){
                    this.scene = this.scenes.WORLDSCENE;
                    document.querySelector("#info").style.display = 'initial'

                }.bind(this))
                document.querySelector("#btn-boxes").addEventListener('click', function(){
                    this.scene = this.scenes.BOXSCENE;
                    document.querySelector("#info").style.display = 'none'

                }.bind(this))

            },
            presskey: function (evt) {
                var keyCode = evt.keyCode;
    
                if (this.scene) {
                    this.scene.inputManager.pressKey(evt);
                }
            }
    
        });

        runner.load().then(runner.init.bind(runner)).then(runner.startRunnerLoop.bind(runner));
    
    }
}
