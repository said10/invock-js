import Templating from './templating';
import dom from './dom';

export default class Router {
  // classe pour Router
  constructor() {
    this.urls = [];
    this.current_url = location.pathname;
    this.query = location.search;
    this.current_path = null;
    this.counter = 0;
    this.utils = utils;
    this.templating = new Templating();
  }
  route(list_urls) {
    var self = this;
    $("a[type='push']").click(function(evt) {
      var href = $(this).attr("href");
      history.pushState({ page : self.counter++ }, "", href);
      self.setUrl(href);
      evt.preventDefault();
      return false;
    });
    window.onpopstate = function(event) {
        console.log(event);
    };
    this.urls = list_urls;
    this.initPaths();
    this.apply();
  }

  initPaths() {
    var nbr_urls = this.urls.length;
    for (var i = 0; i < nbr_urls; i++) {
      var path_temp = this.getAttribute(this.urls[i], "path");
      var name = this.getAttribute(this.urls[i], "name");
      var name_path = path_temp.split(":")[0];
      name_path = name_path.split("/")[1];
      if (name === "undefined") {
        name = this.cleanSlash(name_path);
      }
      var children = this.getAttribute(this.urls[i], "children");
      if (typeof children !== "undefined") {
        if (children.length > 0) {
          this.urls[i].children = this.changeChildrenValues(children, name);
        }
      }
    }
  }

  getCurrentPath(urls, not_found) {
    if (typeof urls === "undefined") {
      urls = this.urls;
    }
    this.current_path = null;
    var nbr_urls = urls.length;
    for (var i = 0; i < nbr_urls; i++) {
      var path_temp = this.getAttribute(urls[i], "path");
      var view = this.getAttribute(urls[i], "view");
      var template = this.getAttribute(urls[i], "template") || "";
      var parent = this.getAttribute(urls[i], "parent") || "";
      var name = this.getAttribute(urls[i], "name") || this.utils.slugify(path_temp);
      var name_path = path_temp.split(":")[0];
      name_path = name_path.split("/")[1];

      var slug_url = this.utils.slugify(this.current_url);
      var slug_path = this.utils.slugify(path_temp);
      if (( this.current_url.indexOf(name) > -1 && name.length > 1 ) || (slug_url === slug_path) ) {
        this.current_path = {path : path_temp, index : i, view : view, template : template, parent : parent};
        i = nbr_urls;
      }
      if (typeof not_found !== "undefined" && slug_path === "**") {
        this.current_path = {path : path_temp, index : i, view : view, template : template, parent : parent};
      }
    }
    return this.current_path;
  }

  apply() {
      this.current_path = this.getCurrentPath();
      if (this.current_path !== null) {
        var index = this.current_path.index;
        var path = this.current_path.path;
        var name_path = this.cleanArray(path.split("/"))[0];
        var name ="";
        if (typeof this.getAttribute(this.urls[index], "name") === "undefined") {
          name = this.cleanSlash(name_path);
        }
        else {
          name = this.getAttribute(this.urls[index], "name");
        }

        var children = this.getAttribute(this.urls[index], "children");
        if (typeof children !== "undefined") {
          if (children.length > 0) {
            this.current_path = this.getCurrentPath(children, true);
            index = this.current_path.index;
            path = this.current_path.path;
          }
        }
      }
      else {
        this.current_path = this.getCurrentPath(this.urls, "404");
      }

      this.runPath();


  }

  runPath() {
    var path = this.current_path.path;
   // var view = this.current_path.view;
    var template = this.current_path.template;
    var params = this.getparams(path);
    if (typeof params.error === "undefined") {
      if (template !== "") {
        this.templating.data = params;
        var parent_dom = this.current_path.parent || "body";
        this.templating.render(template, parent_dom);
      }
    }
    else {
      console.log(params.error);
    }
  }

  redirectTo(url) {
    history.pushState({ page : this.counter++ }, "", url);
    this.setUrl(url);
  }

  setUrl(url) {
    if (url !== this.current_url) {
      this.current_url = location.pathname;
      this.apply();
    }
  }

  changeChildrenValues(array, name) {
    var nbr_children = array.length;
    for (var c = 0; c < nbr_children; c++) {
      var child = array[c];
      var path_child = child.path;
      path_child = "/"+name+path_child;
      child.path = path_child;
      array[c] = child;
    }
    return array;
  }

  getparams(path) {
    var objet_param = { };
    objet_param.query = this.getQuery();
    var split_slash = this.current_url.split("/");
    split_slash = this.cleanArray(split_slash);
    var path_split_slash = path.split("/");
    path_split_slash = this.cleanArray(path_split_slash);
    if (split_slash.length === path_split_slash.length) {
      for (var i = 0; i < split_slash.length; i++) {
        var param = path_split_slash[i];
        if (param.indexOf(":") > -1) {
          var name_param = param.split(":")[1];
          objet_param[name_param] = split_slash[i];
        }
      }
    }
    else {
      objet_param.error = "Il y a une erreur sur le path";
    }
    return objet_param;
  }
  getQuery() {
    var query = {};
    this.query = location.search;
    if (this.query !== "") {
      var split_query = this.query.split("&");
      for (var q = 0; q < split_query.length; q++) {
        var variable_query = split_query[q].split("=");
        var name_variable = variable_query[0];
        if (name_variable.indexOf("?") > -1) {
          name_variable = name_variable.substring(1, name_variable.length);
        }
        var value_variable = variable_query[1];
        if (!isNaN(value_variable)) {
          value_variable = parseInt(value_variable);
        }
        query[name_variable] = value_variable;
      }
    }
    return query;

  }
  cleanSlash(path) {
    var split_path = path.split("/");
    return this.cleanArray(split_path)[0];
  }

  cleanArray(array) {
    var new_array = [];
    var length_array = array.length;
    for (var c = 0; c < length_array; c++) {
         if (array[c] !== "undefined" && array[c] !== "" && array[c] !== " " && array[c] !== null) {
           new_array.push(array[c]);
         }
    }
    return new_array;
  }
  getAttribute(obj, attr) {
    if (typeof obj[attr] !== "undefined" && obj[attr] !== null) {
      return obj[attr];
    }
    else {
      return "";
    }
  }
}