/**
* Invock framework (v0.0.1) copyright 2018 Said Bensamdi
* Licensed under the MIT License.
* http://www.invock.com
*
* Copyright 2017 Said Bensamdi
* Licensed under the GPL License
* https://github.com/said10/invockjs
*/ 
/**
* Javascript Framework for building User Interface Components
*/ 

import Templating from './templating';
import store from './store';
import dom from './dom';


let instance_invock = null;
class Invock {
    constructor(params) {
       // this.parent = params.parent || "";
        this.dom = dom;
        this.NAME_SPACE = "invock";
        //window[this.NAME_SPACE] = {};
    }
    mount(param_mount) {
        dom.load(function() {
            var html_component = param_mount.root;
            var templating = new Templating();
            templating.render(html_component, param_mount.parent, true);
        });
    }
    
    addProps(object) {
        store.addProps(object);
    }
    
    mountInStore(param_mount, props) {
        
        dom.load(function() {
            var html_component = param_mount.root;
            var templating = new Templating();
            var split_props = props.split(",");
            var l_split_props = split_props.length;
            var result_object = {};
            for (var i = 0; i < l_split_props; i++) {
                var prop = split_props[i];
                var value_prop = store.getProp(prop);
                result_object[prop] = value_prop;
            }
            
            //store.addListener(current);
            
            templating.render(html_component, param_mount.parent, true, null, result_object);
        });
    }
    
    export(name, comp) {
        window[this.NAME_SPACE][name] = comp;
    }
}
var invock = new Invock();
export default invock;