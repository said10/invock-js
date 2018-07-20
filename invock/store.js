class Store {
  constructor() {
    this.store = { default : {} };
    this.store_key = {};
    this.store_alias = {};
    this.storeComponent = { };
    this.storeComponentAlias = { };
    this.list_observer = [];
    this.utils = utils;
    this.comp_temp = null;
    this.listeners = [];
      this.props_store = {};
  }
    
  addProps(object) {
      for (var key in object) {
          this.props_store[key] = object[key];
      }
  }
    
  getProp(name) {
      return this.props_store[name];
  }
  getKey(name) {
      return this.store_key[name];
  }
  addComponent(name,item) {
    this.store_key[name] = item.key;
    this.store_alias[item.alias] = item.key;
    this.storeComponent[item.key] = item;
    this.storeComponentAlias[item.alias] = item;
  }
  getComponent(name) {
    var key = this.store_key[name];
    return this.storeComponent[key];
  }
  
  getComponentByKey(key) {
      
    return this.storeComponent[key];
  }
    
  getComponentByAlias(alias) {
    var key = this.store_alias[alias];
    return this.storeComponent[key];
  }
    
    setComponentByAlias(alias, clone) {
    var key = this.store_alias[alias];
    var clone_clone = Object.assign({}, clone);
    this.storeComponent[key] = clone_clone;
    return this.storeComponent[key];
  }
  getStore(name) {
      var key = this.store_key[name];
      return this.store[key];
  }
  setStore(name, data) {
      var key = this.store_key[name];
      this.store[key] = data;
      return this.getStore(name);
  }
  getStoreByAlias(alias) {
      var key = this.store_alias[alias];
      return this.store[key];
  }
  
  setStoreByAlias(alias, data) {
      var key = this.store_alias[alias];
      this.store[key].state = data;
  }
    
  getKeyByAlias(alias) {
      return this.store_alias[alias];
  }
    
  getStoreByKey(key) {
      return this.store[key];
  }
  existComponent(name) {
    var comp = this.getComponent(name);
    var result;
    if (typeof comp === "undefined") {
      result = false;
    }
    else {
      result = true;
    }
    return result;
  }
  exportMethode(name_comp, name, fn) {
      if (this.existComponent(name_comp)) {
          var comp = this.getComponent(name_comp);
          comp[name] = fn;
      }
  }
  importMethode(name_comp_fn, key_comp) {
      var result = null;
      var name_comp = name_comp_fn.split(".")[0];
      if (this.existComponent(name_comp)) {
          var comp = this.getComponent(name_comp);
          var name = name_comp_fn.split(".")[1];
          if (typeof key_comp !== "undefined") {
              comp = this.getComponentByKey(key_comp);
              comp.user_alias = true;
          } 
          else {
              comp.unique = false;
          }
          result = comp[name].bind(comp); 
      }
      return result;
  }
  addToStore(obj) {
    var name = obj.name;
    var key = obj.key;
    var alias = obj.alias;
    var min_store;
    if (typeof key === "undefined") {
      name = "default";
      min_store = this.store.default;
    }
    else {
      this.store_key[name] = key;
      this.store_alias[alias] = key;
      min_store = obj;
    }
    this.store[key] = min_store;
    return this.getStore(name);
  }

  createObserver(obj_attr) {
    // { attr : "state.nom", parent : "titre" types : "[element/attribute/operation]", element : [elementDOM/TreeOperation], attributes : [{class, id, data-data}, {class}]  }
    obj_attr = this.cleanAttrEnsebles("component", obj_attr);
    obj_attr = this.cleanAttrEnsebles("element", obj_attr);
    obj_attr = this.cleanAttrEnsebles("type", obj_attr);
    this.list_observer.push(obj_attr);
  }

  cleanAttrEnsebles(attr, obj_attr) {
    var attrs = attr+"s";
    obj_attr[attrs] = [];
    obj_attr[attrs].push(obj_attr[attr]);
    delete obj_attr[attr];
    return obj_attr;
  }

  addInObserver(name, observer) {
    //var min_store = this.store[name];
    var attr = observer.element;
    var observer_result = this.find(attr);
    if (observer_result === null || observer.alias !== observer_result.alias) {
      this.createObserver(observer);
    }
    else {
      if (observer_result.text !== observer.text && observer_result.tag !== observer.tag && observer.type === "operation") {
        this.createObserver(observer);
      }
      else {
          var new_observer = {};
          new_observer.elements = observer.element;
          new_observer.types = observer.type;
          for (var a in new_observer) {
              if (!new_observer.hasOwnProperty(a)) {
                continue;
              }
              else {
                  var key_observer = observer_result[a] || [];
                  var value_key = new_observer[a];
                  key_observer.push(value_key);
              }
          }  
      }
      
        
    }
    //console.log(this.list_observer);
  }

  applyChange(name, attr, data, list_changes, alias) {
    var elements_change = [];
    var list_changes_temp = list_changes;
    for (var s in data) {
        if (!data.hasOwnProperty(s)) {
            continue;
          }
      if (this.utils.is_object(data[s])) {
          for (var k in data[s]) {
              if (!data[s].hasOwnProperty(k)) {
                continue;
              }
              if (k === this.getPrimerKey(list_changes)) {
                  list_changes_temp = list_changes;
              }
          }
          this.applyChange(name, attr+"."+s, data[s], list_changes);
      }
      else if (this.utils.is_array(data[s])) {
           for (var t in data[s]) {
              if (!data[s].hasOwnProperty(t)) {
                continue;
              }
              if (t === this.getPrimerKey(list_changes)) {
                  list_changes_temp = list_changes;
              }
          }
      }
      var name_variable = name+"."+attr+"."+s;
      var elements = this.find(name_variable, alias);
      if (typeof elements !== "undefined" && elements !== null && elements.length > 0) {
        elements_change = elements_change.concat(elements);
      }
    }
    //console.log(this.list_observer);
    this.renderChange(elements_change, list_changes_temp, data, alias); 
  }
    
  getPrimerKey(objet) {
      var list = [];
      for (var k in objet) {
          if (!objet.hasOwnProperty(k)) {
            continue;
          }
          list.push(k);
      }
      return list[0];
  }

  renderChange(elements, list_changes, data) {
    for (var e = 0; e < elements.length; e++) {
        var item = elements[e];
        var item_temp = null;
        var for_value = item.for_operation;
        var object_value = data;
        if (typeof data === "undefined") {
            object_value = this.getStore(item.attr.split(".")[0]);
        }
        
        
        //console.log(object_value);
        var re_render = false;
        var name_attr = item.attr.split(".")[1];
        if (name_attr === "props" && typeof data !== "undefined") {
            name_attr = item.attr.split(".")[2]
        }
        
        if (item.attr.split(".").length < 2) {
          name_attr = item.attr.split(".")[0];
        }
        if (for_value.indexOf(name_attr) > -1) {
          re_render = true;
        }
        for (var el = 0; el < item.elements.length; el++) {
          var element = item.elements[el];
          var type = item.types[el];
          switch (type) {
            case "element":
              if (!re_render) {
                 var key_comp = this.getKey(element.name);
                var comp = this.getComponentByKey(key_comp);
                comp.props[name_attr] = object_value[name_attr];
                element.templating.updateElement(element);
                comp.afterRender.call(comp);
                comp.runEvents.call(comp);
              }
            break;
            case "boucle" :
                  var tag_boucle = item.for_operation;
                  var split_in = tag_boucle.split(" in ");
                  var regx_cleaner_for = /{% for|{%for|%}/g;
                  var variable = split_in[0].replace(regx_cleaner_for, "").replace(" ", '');
                  //object_value = this.getStore(item.attr.split(".")[0]);//nom_comp
                  if (typeof element.alias !== "undefined" ) {
                      var comp = this.getComponentByAlias(element.alias);
                      if (comp.user_alias && typeof data === "undefined") {
                          object_value = this.getStoreByAlias(element.alias);
                      }
                  }
                  var parent = item.parent;
                  /*if (element.parent_name.tag === "<div root='root'>") {
                      parent = element.parent_name.parent_name;
                  }*/
                  if ( typeof parent === "undefined") {
                      parent = element.parent_name;
                  }
                  /*if ( typeof element.parent_name.element === "undefined") {
                      parent = element.templating.parent_component;
                  }*/
                  var change_add = [];
                  for (var prop in list_changes) {
                      if (!list_changes.hasOwnProperty(prop)) {
                        continue;
                      }
                    var changes = list_changes[prop];
                    var value_prop = object_value[name_attr];
                      if (typeof data !== "undefined") {
                          value_prop ={};
                          value_prop[name_attr] = object_value[name_attr];
                      }
                      
                    var split_status = changes.status.split("-");
            			for(var s  = 0; s < split_status.length; s++) {
            				var status = split_status[s];
            				var array_index = changes[status];
                            var element_change_status = this.findInArray(array_index, element.index);
                            if (status !== "add") {
                                element.parent_name = parent;
                                
                                var key_comp = this.getKey(element.name_comp);
                                var comp = this.getComponentByKey(key_comp);
                                comp.props[name_attr] = object_value[name_attr];
                                element.templating.switchStatus(status, array_index, value_prop, prop, element, parent, variable);
                                comp.afterRender.call(comp);
                                comp.runEvents.call(comp);
                            }
            			}
                    change_add = changes.add;
                    if (change_add.length > 0) {
                        element.parent_name = parent;
                        var key_comp = this.getKey(element.name_comp);
                        var comp = this.getComponentByKey(key_comp);
                        comp.props[name_attr] = object_value[name_attr];
                        element.templating.switchStatus("add", change_add, value_prop, prop, element, parent, variable);
                        comp.afterRender.call(comp);
                        comp.runEvents.call(comp);
                    }
                }
            break;
            case "operation" :
                  var parent = element.parent_name.element;
                  if (element.parent_name.tag === "<div root='root'>") {
                      parent = element.parent_name.parent_name;
                  }
                  if ( typeof parent === "undefined") {
                      parent = element.parent_name.element;
                  }
                  if ( typeof element.parent_name.element === "undefined") {
                      parent = element.templating.parent_component;
                  }
                  element.parent_name.element = parent;
                  var tree_condition = [element];
                  var key_comp = this.getKey(element.name_comp);
                  var comp = this.getComponentByKey(key_comp);
                  comp.props[name_attr] = object_value[name_attr];
                  element.templating.renderElement(tree_condition, parent, true);
                  comp.afterRender.call(comp);
                  comp.runEvents.call(comp);
            break;
            case "attr" : 
                var key_comp = this.getKey(element.name_comp);
                  var comp = this.getComponentByKey(key_comp);
                  comp.props[name_attr] = object_value[name_attr];
                  element.templating.updateElementAttributes(item, element);
                  comp.afterRender.call(comp);
                  comp.runEvents.call(comp);
                  
            break;

          }
        }
    }
  }

  findInArray(array, value) {
    var result = false;
    for (var i = 0; i < array.length; i++) {
      if (value === array[i]) {
        result = true;
        i = array.length;
      }
    }
    return result;
  }
    
  findInArrayElements(array, attr, value) {
    var result = [];
    for (var i = 0; i < array.length; i++) {
      if (value === array[i][attr]) {
        result.push(array[i]);
      }
    }
    return result;
  }

   find(name, alias) {
     var element = null;
     var elements = [];
     for (var o = 0; o < this.list_observer.length; o++) {
       var obsever_name = this.list_observer[o].attr;
       var obsever_tag = this.list_observer[o].tag;
       var obsever_for_operation = this.list_observer[o].for_operation;
       var split_in = obsever_for_operation.split(" in ");
   	   var regx_cleaner_for = /{% for|{%for|%}/g;
   	   var variable = split_in[0].replace(regx_cleaner_for, "").replace(" ", '');
       var observer_temp = this.list_observer[o];       
       if (obsever_name === name) {
           if (typeof alias !== "undefined" && alias !== "" && alias !== null ) {
               //var elements_by_alias = this.findInArrayElements(this.list_observer[o].elements, "alias", alias);
               if (observer_temp.alias === alias) {
                   element = observer_temp;
               }
           }
           else {
                element = observer_temp;
           }
           if (element !== null) {
               elements.push(element);
               
               //o = this.list_observer.length;
           }
          
       }
      /* else {
         if (typeof variable !== "undefined" && variable !== "" && obsever_name.indexOf(variable) > -1 &&  variable !== " ") {
            //element = this.list_observer[o];
            //o = this.list_observer.length;
         }
       }*/

     }
    if (elements.length === 0) {
        return null;
    }
     return elements;
   }
  
    

  changeInStore(name, obj, attr, list_index, alias) {
    var min_store = this.getStore(name)[attr];
    for (var at in obj) {
        if (!obj.hasOwnProperty(at)) {
            continue;
        }
      var value_attr = obj[at];
      min_store[at] = value_attr;
    }
    
    if (typeof alias !== "undefined" && alias!== null  && alias !== "") {
        this.setStoreByAlias(alias, min_store);
    }
    else {
        this.getStore(name)[attr] = min_store;
    }
    this.applyChange(name, attr, obj, list_index, alias);
    return min_store;
  }

    
 changePropsInStore(obj, list_index) {
    var min_store = this.props_store;
    for (var at in obj) {
        if (!obj.hasOwnProperty(at)) {
            continue;
        }
      var value_attr = obj[at];
      min_store[at] = value_attr;
    }
    this.applyChangeProps(obj, list_index);
    return obj;
  }
    
   applyChangeProps(data, list_changes) {
    var elements_change = [];
    var list_changes_temp = list_changes;
    for (var s in data) {
        if (!data.hasOwnProperty(s)) {
            continue;
          }
      if (this.utils.is_object(data[s])) {
          for (var k in data[s]) {
              if (!data[s].hasOwnProperty(k)) {
                continue;
              }
              if (k === this.getPrimerKey(list_changes)) {
                  list_changes_temp = list_changes;
              }
          }
          this.applyChangeProps(data[s], list_changes);
      }
     if (this.utils.is_array(data[s])) {
           for (var t in data[s]) {
              if (!data[s].hasOwnProperty(t)) {
                continue;
              }
              if (t === this.getPrimerKey(list_changes)) {
                  list_changes_temp = list_changes;
              }
          }
      }
        
      var name_variable = s;
      var elements = this.findProps("props."+name_variable);
      if (typeof elements !== "undefined" && elements !== null && elements.length > 0) {
        elements_change = elements_change.concat(elements);
      }
    }
    //console.log(this.list_observer);
    //console.log(elements_change);
    this.renderChange(elements_change, list_changes_temp, data); 
  }
    
  findProps(name) {
     var element = null;
     var elements = [];
     for (var o = 0; o < this.list_observer.length; o++) {
       var obsever_name = this.list_observer[o].attr;
       var obsever_tag = this.list_observer[o].tag;
       var obsever_for_operation = this.list_observer[o].for_operation;
       var split_in = obsever_for_operation.split(" in ");
   	   var regx_cleaner_for = /{% for|{%for|%}/g;
   	   var variable = split_in[0].replace(regx_cleaner_for, "").replace(" ", '');
       var observer_temp = this.list_observer[o];   
       if (obsever_name.indexOf(name) > -1) {
            element = observer_temp;
           if (element !== null) {
               elements.push(element);
           }
          
       }

     }
    if (elements.length === 0) {
        return null;
    }
     return elements;
   }
    
}
var store = new Store();
export default store;