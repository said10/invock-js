import dom from './dom';
import utils from './utils';
export default class Layout {
    constructor(params) {
        this.name = params.name || "";
        this.utils = utils;
        this.slug = this.utils.slugify(this.name);
        this.parent = params.parent || dom.get("body");
        this.parent_layout = null;
        this.list_parents = {};
        this.ID = this.generateID();
    }
    
    runLayout() {
        var layout_parent = dom.get("layout[name='"+this.name+"']");
        if(layout_parent !== null) {
            layout_parent.setAttr("id", this.name+"-"+this.ID);
            this.parent = layout_parent;
            return layout_parent;
        }
        else {
            return this.parent;
        }
    }
    generateID() {
        return this.utils.generateID();
    }
    getParent(name) {
        return this.list_parents[name];
    }
    
    style(css) {
        this.parent.prependTo("<style type='text/css'>"+css+"</style>");
    }
    AddCSS(url) {
        this.parent.prependTo('<link rel="stylesheet" href="'+url+'" media="all" />');
    }
    
    addBlock(name, class_css, parent) {
        this.slug = this.utils.slugify(this.name);
        if (typeof parent === "undefined") {
            parent = this.parent;
        }
        else {
            parent = this.getParent(parent);
            if (typeof parent === "undefined") {
                parent = this.parent.find(parent);
            }
        }
         if (typeof class_css === "undefined" || typeof class_css !== "string") {
            class_css = "";
         }
        var block = parent.appendTo("<div data-layout='"+this.slug+"' id='"+name+"' class='"+class_css+"'></div>");
        this.list_parents[name] = block;
    }
    getInfos() {
        var infos = [];
        for (var parent in this.list_parents) {
            if (!this.list_parents.hasOwnProperty(parent)) {
                continue;
            }
            var value = this.list_parents[parent];
            infos.push(value);
        }
        return infos;
    }
}