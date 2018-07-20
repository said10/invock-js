/*
Class component
*/


import Templating from './templating';
import store from './store';
import dom from './dom';
import Http from './http';
import utils from './utils';
class Component {
  constructor(props) {
    this.props = props || {};
    this.state = {};
    this.name = "";
    this.parent = "";
    this.parent_events = null;
    this.templating = null;
    this.html = "";
    this.events = {};
    this.clone = false;
    this.alias = "";
    this.use_alias = false;
    
    //this.id = this.generateID();
    this.component = true;
    this.store_props = [];
    this.children = [];
    this.container_elements = [];
    this.list_parents = [];
    this.tree_component = [];
    this.rendering = true;
    this.utils = utils;
    this.key = this.utils.generateID(20).toString();
    this.http = new Http();
    this.acces_props = [];
  }
  
  generateID() {
      return this.utils.generateID(20).toString();
  }
    
  initComponent() {
    this.templating = new Templating({ data : { props : this.props, state : this.state } });
    this.templating.id_component = this.id;
    this.acceptStoreTemplating();
  }
  
  acceptStoreTemplating() {
      if (this.acces_props.length > 0) {
          this.templating.accept_store = true;
      }
  }
  applyFiltre(data, filtre, param) {
      return this.templating.filtre.applyFiltreManuel(data, filtre, param);
  }
  getDataJSON(url, error_fn) {
      var self = this;
      this.rendering = false;
      dom.ajax({
          url : url,
          type : "get",
          success : function(data) {
              if (self.utils.is_object) {
                  self.state = Object.assign(self.state, data);
              }
              else {
                  self.state.data = data;
              }
              self.rendering = true;
              self.runComponent(self.parent);
          },
          error : function(status, errors) {
              error_fn.call(self, errors, status);
          }
      });
  }
  
  getJSON(url, success, error_fn) {
      var self = this;
      dom.ajax({
          url : url,
          type : "get",
          success : function(data) {
              success.call(self, data);
          },
          error : function(status, error) {
              error_fn.call(self, error, status);
          }
      });
  }
  
  getText(url, success, error_fn) {
      var self = this;
      dom.ajax({
          url : url,
          type : "get",
          dataType : 'text',
          success : function(data) {
              success.call(self, data);
          },
          error : function(status, error) {
              error_fn.call(self, error, status);
          }
      });
  }
    
  postData(url, data, success, error_fn) {
      var self = this;
      dom.ajax({
          url : url,
          type : "get",
          data : data,
          success : function(data) {
              success.call(self, data);
          },
          error : function(status, error) {
              error_fn.call(self, error, status);
          }
      });
  }
  render() {
      return '';
  }
  exportMethode(name) {
      var fn = this[name];
      fn = fn.bind(this);
      store.exportMethode(this.name, name, fn);
  }
  importMethode(name_comp_fn, comp) {
      return store.importMethode(name_comp_fn, comp);
  }
  setState(object, callback_change, status) {
    this.setData(object, "state", status, callback_change);
  }
  setStateStore( object) {
    var count_props_attrs = 0;
    var object_store = {};
    for (var key in object) {
        count_props_attrs +=1;
        if (this.utils.findInArray(this.acces_props, key) == false) {
            this.utils.log("You are not access to "+key + " Value", "error");
        }
        else {
            object_store[key] = store.getProp(key);
        }
    }
    if (count_props_attrs <= this.acces_props.length) {
        this.setDataProps(object, object_store);
        /*this.afterRender.call(this);
         this.completeRender.call(this);
        this.runEvents();*/
    }
    if (count_props_attrs > this.acces_props.length) {
        this.utils.log("You are not access to all the values mounted", "error");
    }
    //this.setData(object, "props", status, callback_change,);
  }
    
 setDataProps(object, data_props) {
    var status_change = true;
    
    var data =  data_props;
    var change = false;
    var change_store = true;
    var key_temp = [];
    var list_changes = {};
    var new_state = {};
    
      for( var key in object ) {
          if (!object.hasOwnProperty(key)) {
            continue;
          }
         key_temp.push(key);
         var value_temp = object[key];
         var value_key = data[key] || "";
          
         if (!data.hasOwnProperty(key)) {
            data[key] = value_temp;
          }
          
          if (this.utils.is_object(value_temp)) {
              this.getValue(value_temp, key, value_key, status_change);
          }
          var value = object[key];
          var result_verify = this.verifyType(value_key, value_temp);
          var value_key_string = result_verify.value_key;
          var value_temp_string = result_verify.value_temp;
          if( value_key_string !== value_temp_string ) {
              //ata_temp = JSON.parse(data_temp[attr_cible]);
              if (this.utils.is_array(value)) {
                list_changes[key] = this.getChangeArray(value_key, value);
                value = this.cleanArrayObjects(value);
                //this.props[key] = value;
                new_state[key] = value;
              }
              else {
                //this.props[key] = value;
                new_state[key] = value;
              }
              change = true;
          }
      }
      if (change && change_store) {
          store.changePropsInStore(new_state, list_changes, undefined);
      }
  }    
    

  setstoreProps(store_props) {
    for (var p = 0; p < store_props.length; p++) {
      this.store_props.push(store_props[p]);
    }
  }
  
  getClone(alias) {
      return store.getComponentByAlias(alias);
  }
  
  setClone(alias, clone) {
      return store.setComponentByAlias(alias, clone);
  }
  
  getKeyClone(alias) {
      var key = store.getKeyByAlias(alias);
      var store_key = store.getStoreByKey(key);
      this.templating.data = store_key;
      return key;
  }
  
  afterRender() {
      
  }
  
  beforeRender() {
      
  }
  
  getValue(data, key, old_data, fn, status_change) {
      var last_level = {data : data, name : key, old_data : old_data};
      for (var attr in data) {
          if (!data.hasOwnProperty(attr)) {
            continue;
          }
          var value = data[attr];
          var old_value = old_data[attr];
          if (this.utils.is_object(value)) {
              this.getValue(value, attr, old_value, fn);
              break;
          }
          if (this.utils.is_array(value)) {
              last_level = { data : value, name : attr, old_data : old_value };
              if(typeof fn !== "undefined" && typeof fn === "function") {
                  //fn.call(this, last_level);
                  this.callBackGetValue(last_level, key, status_change);
              }
              return last_level;
          }
      }
      return last_level;
  }  
  
  setData(object, attr, status_change, callback_change, data_props) {
    if (typeof status_change === "undefined") {
        status_change = true;
    }
      var data = this;
      if (typeof data_props !== "undefined") {
        data = data_props;
    }
    else {
      data = store.getStore(this.name);
    }
    var change = false;
    var change_store = true;
    var key_temp = [];
    var list_changes = {};
    var new_state = {};
    
      for( var key in object ) {
          if (!object.hasOwnProperty(key)) {
            continue;
          }
         key_temp.push(key);
         var value_temp = object[key];
         var value_key = data[attr][key] || "";
         if (!data[attr].hasOwnProperty(key)) {
            data[attr][key] = value_temp;
          }
          
          if (this.utils.is_object(value_temp)) {
              this.getValue(value_temp, key, value_key, status_change);
          }
          var value = object[key];
          var result_verify = this.verifyType(value_key, value_temp);
          var value_key_string = result_verify.value_key;
          var value_temp_string = result_verify.value_temp;
          if( value_key_string !== value_temp_string ) {
              //ata_temp = JSON.parse(data_temp[attr_cible]);
              if (this.utils.is_array(value)) {
                list_changes[key] = this.getChangeArray(value_key, value);
                value = this.cleanArrayObjects(value);
                this[attr][key] = value;
                new_state[key] = value;
              }
              else {
                this[attr][key] = value;
                new_state[key] = value;
              }
              change = true;
          }
      }
      if (change && change_store && status_change) {
          if (typeof callback_change === "function" && callback_change !== null) {
              callback_change.call(this, new_state);
          }
          if (this.use_alias) {
              store.changeInStore(this.name, new_state, attr, list_changes, this.alias);
          }
          else {
              console.log(new_state);
              console.log(list_changes);
              console.log(attr);
              //store.changeInStore(this.name, new_state, attr, list_changes, undefined);
          }
          
        //this.templating.reRender(new_state, list_changes);
        //this.runEvents();
        //this.afterRender.call(this);
      }
  }
  
  callBackGetValue(level_array, attr, status_change) {
      var self = this;
      change_store = false;
      var value;
      var new_state = {};
      var value_temp = level_array.data;
      var value_key = level_array.old_data;
      var result_verify = this.verifyType(value_key, value_temp);
      var value_key_string = result_verify.value_key;
      value_temp = result_verify.value_temp;
      if( value_key_string !== value_temp ) {
           list_changes[level_array.name] = this.getChangeArray(level_array.old_data, level_array.data);
           value = this.cleanArrayObjects(level_array.data);
           var primer_key = key_temp[0];
           //this.state[primer_key] = object[primer_key];
           new_state[primer_key] = object[primer_key];
          if (status_change) {
              if (this.use_alias) {
                  store.changeInStore(this.name, new_state, attr, list_changes, this.alias);
              }
              else {
                  store.changeInStore(this.name, new_state, attr, list_changes);
              }
          }
           
      }
  }  

  cleanArrayObjects(array) {
    for (var i  = 0; i < array.length; i++) {
      var string_object = array[i];
      if (this.utils.is_object(string_object)) {
          string_object = this.utils.convertObjectToString(string_object);
      }
      if (this.utils.is_array(string_object)) {
          string_object = this.utils.convertArrayToString(string_object);
      }
      var regx_variable = /{([^}]+)?}/g;
  		var match = string_object.match(regx_variable);
      if (match !== null) {
        var object_ = JSON.parse(string_object);
        array[i] = object_;
      }
      else {
        i = array.length;
      }

    }
    return array;
  }
  
 orderingArray(array) {
      var l = array.length;
      for (var i = 0; i < l; i++) {
        var current = array[i];
        var next = array[i+1];
        var prev = array[i-1];
        for (var j = 0; j < l; j++) {
          var current2 = array[j];
          var next2 = array[j+1];
          var prev2 = array[j-1];
          if (typeof next2  !== "undefined" || typeof prev2 !== "undefined") {
            if (current2 > next2 && current !== current2) {
                array[j] = next2;
                array[j+1] = current2;    
            }
            else if(current2 < prev2 && current !== current2) {
                array[j] = prev2;
                array[j-1] = current2;    
            }
          }
      }
    }
   return array;
 }
 getChangeArray(old_array, new_array) {
   var result_add = [];
   var result_update = [];
   var result_remove = [];
   var status = "update";
   if (new_array.length > old_array.length) {
     status = "add";
     for (var a = new_array.length-1; a > old_array.length-1; a--) {
       result_add.push(a);
     }
      result_add = this.orderingArray(result_add);
   }
   if (new_array.length < old_array.length) {
     status = "remove";
     for (var r = old_array.length-1; r > new_array.length-1; r--) {
       result_remove.push(r);
     }
     result_remove = this.orderingArray(result_remove);
   }
   var update = "";
   var length = old_array.length;
   if (new_array.length < length) {
     length = new_array.length;
   }
   for (var i = 0; i < length; i++) {
     var old_value = old_array[i];
     var new_value = new_array[i];
     var verify_type = this.verifyType (new_value, old_value);
     old_value = verify_type.value_temp;
     new_value = verify_type.value_key;
     if (old_value !== new_value) {
       result_update.push(i);
       if (status !== "update") {
         update ="-update";
       }
     }
   }
   return { add : result_add, update : result_update, remove : result_remove,  status : status+update  };
 }

  verifyType (value_key, value_temp) {
      if( this.utils.is_array(value_key)) {
        var array_value_key = value_key;
          for (var i  = 0; i < value_key.length; i++) {
            var string_object = value_key[i];
            if (this.utils.is_object(string_object)) {
              var clone = Object.assign({}, string_object);
              array_value_key[i] = this.utils.convertObjectToString(clone);
            }
          }
          value_key = this.utils.convertArrayToString(array_value_key);

          var array_value_temp = value_temp;
            for (var j  = 0; j < value_temp.length; j++) {
              var string_object_temp = value_temp[j];
              if (this.utils.is_object(string_object_temp)) {
                var clone2 = Object.assign({}, string_object_temp);
                array_value_temp[j] = this.utils.convertObjectToString(clone2);
              }
            }
          value_temp = this.utils.convertArrayToString(array_value_temp);
      }
      if( this.utils.is_object(value_key)) {
          value_key = this.utils.convertObjectToString(value_key);
          value_temp = this.utils.convertObjectToString(value_temp);
      }

      return {  value_key : value_key, value_temp :  value_temp };
  }
  
  completeRender() {
      return this;
  }

  runComponent(parent) {
    this.initComponent();
    var html = this.html = this.render();
    if ( typeof this.parent === "undefined" || this.parent === "" || this.parent === null  ) {
        this.parent = parent;
    }
    if (this.rendering) {
        var objet_component_store = {};
        this.templating.name = this.name;
        this.props.key = this.key;
        this.props.alias = this.alias;
        this.beforeRender.call(this);
        objet_component_store = { name : this.name, props : this.props, state : this.state, key : this.key, alias : this.alias, clone : this.clone  };
        store.addToStore(objet_component_store);
        this.templating.alias = this.alias;
        this.templating.parent_component = this.parent;
        var name = this.name;
        var self = this;
        this.templating.render(html, this.parent, true);
        this.tree_component = this.templating.getTree();
        //this.afterRender.call(this);
         self.afterRender.call(self);
         self.completeRender.call(self);
        self.runEvents();
        
    }
    
  }
  renderComponent(parent) {
    this.runComponent(parent);
  }
  renderOtherComponent (name, props, parent, state, callback){
      props = props || {};
      var component = new window.invock[name](props);
      if (state !== null) {
          component.state = state;
      }
      component.parent = parent;
      store.addComponent(name, component);
      component.alias = props.alias || "";
      component.name = name;
      if (typeof callback === "function" && callback !== null) {
          callback.call(this, component);
      }
      component.runComponent(parent);
      return component;
      
  }
  stopComponent(parent) {
    if (typeof parent !== "undefined") {
        this.parent = parent;
    }
    var html = this.html = this.render();
      this.rendering = false;
    if (this.templating !== null) {
        this.templating.name = this.name;
        this.templating.tree_component = this.tree_component;
        //this.templating.render(html, this.parent, false);
    }
    this.removeEvents();
  }
  /**
   * une fonction qui éxecute les événements
   * @runEvents
   */
  runEvents () {
    if(this.events !== null) {
      for( var event in this.events ) {
        if (!this.events.hasOwnProperty(event)) {
            continue;
        }
        var event_name = event.split(" ")[0];
        var event_selecteur = event.substring(event_name.length, event.length);
        var call_back = this.events[event];
        this.bindEvent(event_selecteur, event_name, call_back);
      }
    }
  }
  /**
   * une fonction qui éxecute les événements
   * @runEvents
   */
  removeEvents () {
    if(this.events !== null) {
      for( var event in this.events ) {
        if (!this.events.hasOwnProperty(event)) {
            continue;
        }
        var event_name = event.split(" ")[0];
        var event_selecteur = event.substring(event_name.length, event.length);
        var call_back = this.events[event];
        dom.getAll(event_selecteur).off(event_name, call_back);
      }
    }
  }
  /**
   * Fonction de bind pour les event DOM sur les élements de la page : cette fonction est interne et non utilisable par l'utilisateur
   * @bindEvent
   * @param {String} event - le nom de l'event
   * @param {String} selector - le selector de l'element DOM sur quoi l'event va se lancer
   * @param {String} callback - callback qui s'exécute quand l'event est exécuté
   */
  bindEvent (selector, event, callback ) {
    var self = this;
    //dom.getAll(selector).off(event);
    var elements;
    if ( typeof this.parent === "undefined" || this.parent === null) {
        elements = dom.getdAll(selector);
    } 
    else {
        elements = this.parent.findAll(selector);
    }
    elements.on(event, function(evt) {
        // evt.preventDefault();
      if( callback !== null && typeof self[callback] !== "undefined" ) {
        var reg = /^#|^./g;
        var new_selector_key = selector.trim();
        if( reg.test(new_selector_key) ) {
          new_selector_key = new_selector_key.substring(1, new_selector_key.length);
        }
        //var data = self.options_events[new_selector_key];
        self[callback].call(this, evt, self);
        
      }
      else {

        self.log("La fonction "+callback+" n'est pas défini.", "error");
      }
    });
  }
  /**
   * Fonction pour ajouter un event dans le scope de l'objet Utils
   * @addEvent
   * @param {String} selector - le selector de l'element DOM sur quoi l'event va se lancer
   * @param {String} event_type - le nom de l'event
   * @param {String} callback - callback qui s'exécute quand l'event est exécuté
   */
  addEvent(selector, event_type, callback, options) {
    this.events[event_type+" "+selector] = callback;
    var reg = /^#|^./g;
    var new_selector = selector.trim();
    if( reg.test(new_selector) ) {
      new_selector = new_selector.substring(1, new_selector.length);
    }
    //this.options_events[new_selector] = options;
    this.runEvents();
  }
  /**
   * Fonction qui supprime un event de l'objet principale et aussi de la mémoire
   * @removeEvent
   * @param {String} selector - le selector de l'element DOM sur quoi l'event va se supprimer
   */
  removeEvent(selector) {
    for( var event in this.events ) {
     if (!this.events.hasOwnProperty(event)) {
            continue;
        }
      var event_name = event.split(" ")[0];
      var event_selecteur = event.split(" ")[1];
      if( event_selecteur === selector ) {
        dom.getAll(selector).off(event_name);
        delete this.events[event_name+" "+event_selecteur];
      }
    }
  }
  /**
   * Fonction stimule l'événement pour un sélecteur donné
   * @TriggerEvent
   * @param {String} selector - le selector de l'element DOM sur quoi l'event va se simuler
   * @param {String} event - le nom de l'événement
   */
  TriggerEvent(selector, event) {
    dom.getAll(selector).trigger(event);
  }
  /**
   * Fonction pour role de créer des evenments personnalisée
   * @addCustomEvent
   * @param {String} name - le nom de l'événement personnalisée
   * @param {Function} callback - la fonction callback returner une fonction pour l'exécuter sur le moment de l'événement personnalisée
   * @param {Object} options -  les options à passer sur le callback de l'événement personnalisée
   */
  addCustomEvent(name, callback, options) {
    this.customEvents[name] = callback;
    return callback.bind(this, name, options);
  }
}// fin de la classe component