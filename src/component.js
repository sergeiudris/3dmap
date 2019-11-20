

class Component {

    constructor(options) {
        
        this.query = "";
        this.id = 'root';//(Math.random() * Math.pow(32, 6)).toString(36).slice(0, 5);
        this.ids = 1000;

        this.children = new Map();
        this.parent = null;
        this.state = {};

        this.subs = {};

        this.echo = {};

        Object.assign(this, options);
        this.location = this.id;
        this.address = this.location + "?"+this.query;
        
        return this;
    }

    addChild(node) {
        if (node.parent) {
            node.parent.removeChild(node);
        }
        //wrong if add to root last - children not affected
        node.id = String(this.ids++);
        node.location = node.location.split('-').slice(0,-1).concat([node.id]).join('-');
        node.address = node.address.split('-').slice(0,-1).concat([node.id+"?"+node.query]).join('-');

        node.children.forEach(function(v,k,m){
            v.location = [node.id].concat(v.location.split('-').slice(1)).join('-');
            v.address = [node.id+"?"+node.query].concat(v.address.split('-').slice(1)).join('-');
        }.bind(this))

        this.children.set(node.id, node);
        node.parent = this;
        node.goDown(function (node) {
            node.root = this.root || this;
            node.location = this.location +"-"+ node.location;
            node.address = this.address +"-"+ node.address;
        }.bind(this));

        this.nodeAdded && this.nodeAdded(node);

        node.root.nodeAddedDeep && node.root.nodeAddedDeep(node);

        return node;
    }

    removeChild(node) {
        node.children.delete(node.id);
        node.address = "";
        node.location = "";
        node.parent = null;

        this.nodeRemoved && this.nodeRemoved(node);

        node.root.nodeRemovedDeep && node.root.nodeRemovedDeep(node);

        return node;
    }

    setState(partialState) {
        this.state = Object.assign({}, this.state, partialState);
        if (this.root) {
            var obj = Object.assign({
                address: this.address,
                location: this.location,
            },this.state)
            this.root.dispatch(obj);
            this.root.pack(obj);
        }

    }

    setEcho(props){
        this.state = Object.assign({},this.state,props);
        this.onEcho && this.onEcho(props);
        this.root && this.root.onEchoDeep && this.root.onEchoDeep(props,this);
    }

    goUp(fn) {
        var parent = this.parent;
        var result = undefined;
        while (parent && typeof result === "undefined") {
            result = fn(parent);
            parent = parent.parent;
        }
        return result;
    }

    goDown(fn, result) {
        result = fn(this);
        if (typeof result !== "undefined") {
            return result;
        }

        for (var child of this.children) {
            result = child[1].goDown(fn, result);
            if (typeof result !== "undefined") {
                return result;
            }
        }
        return result;
    }

    on(eventType, fn) {
        var exp = new RegExp(eventType, 'gi')
        this.subs[eventType] = this.subs[eventType] || { exp: new RegExp(eventType), fns: new Set() };
        this.subs[eventType].fns.add(fn);
        return fn; // the index to splice in array
    }

    off(eventType, fn) {
        this.subs[eventType].fns.delete(fn);
    }

    dispatch(obj) {
        for (var p in this.subs) {
            if (this.subs[p].exp.test(obj.address)) {
                this.subs[p].fns.forEach(function (f) {
                    f(obj);
                })
            }
        }
    }

    deliver(props) {
        const location = props.location;
        if(!location){
            console.log('warn: delivering with no location',props);
            return;
        }
        var ids = location.split('-').slice(1);
        var node = this;
        for (var id of ids) {
            node = node.children.get(id);
            if (!node) {
                break;
            }
        }
        if (node) {
            console.log('delivering:',props)
            node.state = Object.assign({},node.state,props);
            if (node.root) {
                Object.assign({
                    address: node.address,
                    location: node.location,
                },node.state)
                var obj = 
                node.root.pack(props);
            }
            return true;
        }
        return false;
    }

    pack(props) {
        const address = props.address;
        const location = props.location;
        var ids = location.split('-').slice(1);
        var node = this.echo;
        for (var id of ids) {
            node.c = node.c || {};
            node = node.c[id] = node.c[id] || {};
        }
        Object.assign(node, props);
    }

    unpack(props) {
        const c = props.c;
        var child;
        this.setEcho(props);
        for (var p in c) {
            if (child = this.children.get(p)) {
                child.unpack(c[p]);
            }
        }
    }

}

module.exports = Component;
