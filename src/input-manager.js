

module.exports = InputManager;

function InputManager() {


};


InputManager.prototype.init = function (domElement, camera) {

    this.pressed = new Map();

    this.mice = new Map();

    this.subscribers = {};

    this.domElement = domElement;
    this.camera = camera;

    this.mouse = { x: 0, y: 0 };
    this.delta = { x: 0, y: 0 };
    this.wheelDeltaY = 0;
    this.phi = 0;
    this.theta = 0;
    this.amortization = 0.95;
    this.zoomLevel = 1;

};
InputManager.prototype.onContextMenu = function (evt) {
    //TODO implement
};

InputManager.prototype.onWheel = function (evt) {
    this.wheelDeltaY = evt.wheelDeltaY;
    this.computeZoomLevel();
    evt.preventDefault();
};
InputManager.prototype.checkIsKeyDown = function (arg) {

    if (typeof arg === "object") {
        return this._checkIsKeyDownCommand.apply(this, arguments);
    } else {
        return this._checkIsKeyDownKeyCode.apply(this, arguments);
    }
};
InputManager.prototype._checkIsKeyDownKeyCode = function (/*args*/) {
    for (var i = 0, il = arguments.length; i < il; i++) {
        var keyCode = arguments[i];
        if (this.pressed.get(keyCode)) {
            return true;
        }
    }
    return false;
}

InputManager.prototype._checkIsKeyDownCommand = function (commands) {
    for (var i = 0, il = commands.length; i < il; i++) {
        var keyCode = commands[i].keyCode;
        if (this.pressed.get(keyCode)) {
            return true;
        }
    }
    return false;
}


InputManager.prototype.keydown = function (evt) {
    this.pressed.set(evt.keyCode, true);
    this.notify(evt.type, evt, evt.keyCode, this);
    // console.log(evt);
    //evt.preventDefault();
};

InputManager.prototype.keyup = function (evt) {

    this.pressed.delete(evt.keyCode);
    this.notify(evt.type, evt, evt.keyCode, this);
    //evt.preventDefault();
};

InputManager.prototype.mouseDown = function (evt) {

    var mouse = this.getStageMouse(evt);
    var code = evt.type + evt.button;
    this.pressed.set(code, true);
    this.mice.set(code, mouse);
    this.notify(code, evt, mouse, this);
    this.mouse = mouse;
    evt.preventDefault();
};



InputManager.prototype.mouseUp = function (evt) {

    var mouse = this.getStageMouse(evt);
    var code = evt.type + evt.button;
    this.mice.set(code, mouse);
    this.notify(code, evt, mouse, this);
    this.mouse = mouse;
    this.pressed.delete('mousedown' + evt.button);
    evt.preventDefault();

};
InputManager.prototype.mouseMove = function (evt) {

    var mouse = this.getStageMouse(evt);

    this.notify("mousemove", evt, mouse, this);

    //
    if (!this.pressed.get('mousedown2') && !this.pressed.get('mousedown0')) {
        return mouse;
    }

    this.computeDelta(mouse);
    this.computeThetaPhi();

    this.mouse.x = mouse.x;
    this.mouse.y = mouse.y;

    evt.preventDefault();
    return mouse;
};

InputManager.prototype.on = function (type, fn) {
    if (!this.subscribers[type]) {
        this.subscribers[type] = [];
    }
    this.subscribers[type].push(fn);
};
InputManager.prototype.off = function (type, fn) {
    var arr = this.subscribers[type]
        ;
    if (arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === fn) {
                this.subscribers.slice(i, 1);
                return;
            }
        }
    }
};

InputManager.prototype.notify = function (type, evt, data, inputManager) {
    var arr = this.subscribers[type]
        ;
    if (arr) {
        for (var i = 0; i < arr.length; i++) {
            arr[i](evt, data, inputManager);
        }
    }
}

InputManager.prototype.doInertia = function () {

    if (!this.pressed.get('mousedown2')) {
        if (Math.abs(this.delta.x) > 0.001
            || Math.abs(this.delta.y) > 0.001) {
            this.delta.x *= this.amortization;
            this.delta.y *= this.amortization;
            this.theta += this.delta.x;
            this.phi += this.delta.y;
        } /*else {
            this.delta.x = 0;
            this.delta.y = 0;
            this.theta = 0;
            this.phi = 0;
        }*/
    }

};

InputManager.prototype.getNormalizedMouse = function (mouse) {

    var worldX = mouse.x / (this.domElement.width / 2) - 1;
    var worldY = 1 - mouse.y / (this.domElement.height / 2);

    return {
        x: worldX,
        y: worldY
    };
};

InputManager.prototype.computeDelta = function (mouse) {
    var zoomFactor = this.zoomLevel > 0 ? Math.min(this.zoomLevel, 7) : 1;
    this.delta.x = (mouse.x - this.mouse.x) * 4 * Math.PI / this.domElement.width / zoomFactor;
    this.delta.y = (mouse.y - this.mouse.y) * 4 * Math.PI / this.domElement.height / zoomFactor;
};
InputManager.prototype.computeThetaPhi = function () {
    this.theta += this.delta.x;
    this.phi += this.delta.y;
};
InputManager.prototype.getPhi = function () {
    var phi = this.phi;
    this.phi = 0;
    return phi;
};
InputManager.prototype.getTheta = function () {
    var theta = this.theta;
    this.theta = 0;
    return theta;
};

InputManager.prototype.computeZoomLevel = function () {
    if (this.wheelDeltaY > 0) {
        this.zoomLevel++;
    } else if (this.wheelDeltaY < 0) {
        this.zoomLevel--;
    }
};

InputManager.prototype.getStageMouse = function (evt) {
    var boundingRect = this.domElement.getBoundingClientRect(),
        offsetX = boundingRect.left || 0,
        offsetY = boundingRect.top || 0,
        mouseX = 0,
        mouseY = 0
        ;

    if (evt.targetTouches && (evt.targetTouches.length >= 1)) {

        mouseX = evt.targetTouches[0].clientX - offsetX;
        mouseY = evt.targetTouches[0].clientY - offsetY;

    } else {

        mouseX = evt.clientX - offsetX;
        mouseY = evt.clientY - offsetY;
    }
    return {
        x: mouseX,
        y: mouseY
    };
};
