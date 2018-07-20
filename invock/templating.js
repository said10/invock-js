import parserHTML from 'parser-html';


class Templating {
	constructor(params) {
		if (typeof params === "undefined") {
			params = {nom : "", template : "", data : null};
		}
        this.accept_store = false;
		this.nom = params.nom || "";
		this.template = params.template || "";
		this.attrRE = /([\w-]+)|['"]{1}([^'"]*)['"]{1}/g;
		this.tagRE = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>|{%(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+?%}/g; ///<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>|{%(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+%}/g
		this.lookup = {area : true,base : true, br : true, col : true, embed : true, hr : true, img : true, input : true, keygen : true, link : true, menuitem : true,
		               meta : true, param : true, source : true, track : true, wbr : true};
	    this.counter_tags_type = { tags : 0, closed : 0 };
		this.data = params.data || {};
		this.tree = [];
		this.last_for = "";
		this.for_counter = 0;
		this.new_children_for = [];
		this.index = 0;
		this.store_counter = [];
		this.current_for = "";
		this.filtre = new Filtre();
		this.filtre.init();
		this.parent_component = null;
		this.html_render = "";
		this.parent_render = null;
        this.parent_component = null;
		this.elements = [];
		this.container_elements = [];
		this.component = {};
		this.name = "";
        this.alias = "";
		this.list_parents = [];
		this.tree_component = [];
        this.component_support = params.component_support;
        if (typeof this.component_support === "undefined") {
            this.component_support = true;
        }
        this.list_layouts = {};
        this.utils = utils;
        this.index_tree = 0;
        this.total_tags = 0;
        this.tags_closed = 0;
	}

	getTemplate(url, fn) {
		var self = this;
		dom.ajax({
            url : url,
            type : "GET",
            dataType : 'text',
            success : function(data) {
                fn.call(self, data);
            },
            error : function(error, xhr) {
                fn.call(self, error, xhr);
            }
			
		});
	}
    
	readTree(data, index, callback, complete) {
        this.index_tree += 1;
		var element = data[index];
		var children = element.children;
		if (typeof callback !== "undefined") {
			element = data[index] = callback.call(this, element, index);
			children = element.children;
		}
		for ( var c = 0; c < children.length; c++ ) {
			var child = children[c];
			//var tag_child = child.name;
			if (typeof callback !== "undefined") {
				child = callback.call(this, child, c);
				element.children[c] = children[c] = child;
			}
      //console.log(child.element);
			var children_child = child.children;
			if (children_child.length > 0) {
                this.index_tree += 1;
				this.readTree(children_child, 0, callback);
			}
		}
		if (index < data.length-1) {
            this.index_tree += 1;
			this.readTree(data, index+1, callback);
		}
        if (this.index_tree >= (this.total_tags / 2) || this.index_tree >= this.total_tags || (this.index_tree+2) >= (this.total_tags / 2) || (this.index_tree+2) >= this.total_tags) {
            
            if (typeof complete === "function" && complete !== null) {
                complete.call(this, "complete");
            }
        }
	}
	render(html, parent_id, status_render, callback, object_props) {
		if (typeof html !== "undefined") {
			this.html_render = html;
		}
		if (typeof parent_id !== "undefined") {
			this.parent_render = parent_id;
		}
		html = this.html_render;
		parent_id = this.parent_render;
		if (status_render) {
			parserHTML.parse(html, function(tree) {
				  this.tree_component = tree;
                if (tree[0].type === "component") {
                    this.renderElement(tree, parent_id, undefined, callback, object_props);
                }
                else {
                    this.renderElement(tree, parent_id, undefined, callback);
                }
				
			});
		}
		else {
			//console.log(this.tree_component);
            
			this.renderElement(this.tree_component, parent_id, undefined, callback);

		}

	}

	getTree() {
		return this.tree_component;
	}
    
    getTypeTerminal() {
        //var nVer = navigator.appVersion;
       //var nAgt = navigator.userAgent;
        //var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)|iOS|iOs|android/.test(nVer);
        var isMobile = false;
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
            || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
            isMobile = true;
        }
        return isMobile;
    }
    getTerminalTree(tree) {
        var mobile = this.getTypeTerminal();
        var tree_result = tree;
        for (var i = 0; i < tree.length; i++) {
            var mini_tree = tree[i];
            if (mobile) {
                if (mini_tree.name === "mobile") {
                    tree_result = mini_tree;
                }
            }
            else {
                if (mini_tree.name === "desktop") {
                    tree_result = mini_tree;
                }
            }
        }
        if (this.utils.is_object(tree_result)) {
            tree_result = [tree_result];
        }
        return tree_result;
        
    }

    
  renderElement(tree, parent_id, add_in_element, callback, object_props) {
        tree = this.getTerminalTree(tree);
        //console.log(this.getTerminalTree(tree));
		var self = this;
        var index_counter = -1;
		var list_parents = [];
		var state_conditions = null;
		var parent_object = null;
		var parent = dom.get(parent_id);
		var current_statement = "";
        //console.log(tree);
		self.readTree(tree,0, function(item, index) {
            if (typeof item.type !== "undefined" && item.tag !== "undefined" && item !== null) {
                self.index = index;
                item.index = index;
                item.name_comp = this.name;
                var element = null;
                var parent_name = null;
                //console.log(tree);
                if (item.name === "if") {
                    parent_name = self.getParent(item, list_parents);
                    var tag = "";
                    var tag_if = item.tag.split("{% if ")[1].split(" %}");
                    tag_if = this.addNameComp(tag_if[0], undefined, true);

                    var tag_if_and = tag_if.split(" AND ");
                    tag = "{% if "+tag_if_and[0];
                    if (tag_if_and.length > 1) {
                        tag_if_and = this.addNameComp(tag_if_and[1], undefined, true);
                        tag += " AND "+tag_if_and;
                    }
                    var tag_if_or = tag_if.split(" OR ");
                    tag = "{% if "+tag_if_or[0];
                    if (tag_if_or.length > 1) {
                        tag_if_or = this.addNameComp(tag_if_or[1], undefined, true);
                        tag += " OR "+tag_if_or;
                    }
                    tag +=" %}";
                    item.tag = tag;
                    state_conditions = self.ifStatement(item, add_in_element);
                    item.status_if = state_conditions;
                    item = self.changeAttrChildren(item, ["render", "runing"], state_conditions);
                    item = self.changeAttrChildren(item, ["index_for"], index);
                    item = self.assignParentChildren(item);
                }
                if (item.name === "else") {
                    state_conditions = !self.ifStatement(item.parent_name, add_in_element);
                    item.status_if = state_conditions;
                    item = self.changeAttrChildren(item, ["render", "runing"], state_conditions);
                    item = self.changeAttrChildren(item, ["index_for"], index);
                    item = self.assignParentChildren(item);
                }
                if (item.name === "for") {
                    this.current_for = item.tag;
                    var index_statement = index;
                    if (typeof item.index_for !== "undefined") {
                        if (item.index_for !== item.index && (typeof add_in_element === "undefined" || !add_in_element)) {
                            index_statement = item.index_child;
                            this.for_counter = item.index_child;
                            this.data.counter_loop = item.index_child;
                        } 
                    }
                    parent_name = self.getParent(item, list_parents);
                    item = self.forStatement(item, index_statement);
                }
                
                
                var split_in = item.parent_name.tag.split(" in ");
                if (split_in.length === 2) {
                    var regx_cleaner_for = /{% for|{%for|%}/g;
                    var variable = split_in[0].replace(regx_cleaner_for, "").replace(" ", '');
                    var table_original = split_in[1].replace(regx_cleaner_for, "").replace(" ", '');

                    if (item.parent_name.tag.split(".")[1] !== "state" && item.parent_name.tag.split(".")[1] !== "props") {
                        var table = this.addNameComp(table_original, undefined, true);
                        var new_tag = item.parent_name.tag.replace(table_original, table);
                        item.parent_name.tag = new_tag;
                    }
                }
                
                if (item.parent_name.tag === this.current_for) {
                    if (index !== item.index_child) {
                        index = item.index_child;
                    }
                    this.for_counter = index;
                    this.data.counter_loop = index;
                }
                
                if (item.type === "component") {
                    this.componentStatement(item, self.list_parents, parent, object_props);
                }
                if (item.render === false && item.runing === false && item.element !== null) {
                    item.element.remove();
                    item.element = null;
                }
                
                if (item.render && item.name !== "desktop" && item.name !== "mobile" && item.type === "tag") {
                    item.element_old = [];
                    element = self.createElement(item.name, item.data, item.attrs);
                    element.component = this;
                    parent_name = item.parent_name;
                    if ( typeof parent_name.attrs.root !== "undefined" && parent_name.attrs.root === "root") {
                        parent_name = parent;
                    }
                    else {
                        if (self.list_parents.length === 0) {
                            parent_name = parent;
                        }
                        else {
                            parent_name = self.getParent(item, self.list_parents);
                            if (item.parent_name.type === "operation" && typeof parent_name === "undefined") {
                                parent_name = item.parent_name.parent_name;
                                if (typeof parent_name === "undefined" || typeof parent_name.element === "undefined") {
                                    parent_name = self.getParent(item.parent_name, self.list_parents);
                                }
                            }
                            parent_name = parent_name.element;
                            
                        }
                        
                    }
                    var layout_block = element.attr("layout-block");
                    if (layout_block !== "") {
                        var parent_layout_block = parent_name.find("#"+layout_block);
                        if (parent_layout_block !== null) {
                            parent_name = parent_layout_block
                        }
                    }
                    element = parent_name.appendTo(element);
                    item.element = element;
                   
                    if (item.children.length > 0) {
                        self.list_parents.push({ name : item.name, tag : item.tag, parent : parent, element : element });
                    }
                    
                    
                    
                    
                }
                
                if (item.name === "layout") {
                    this.layoutStatement(item, self.list_parents, parent);
                 }
                
                //console.log(item);

                return item;
            }
            else {
                item.element = null;
                item.children = [];
                return item;
            }
			
		}, function() {
            if (typeof callback === "function" && callback !== null) {
                callback.call(this);
            }
        });
	}
    
    layoutStatement(item, list_parents, parent) {
        if (item.runing === true && item.render === true) {
            var name = item.attrs.name;
            //var parent = this.getparentForce(item, list_parents);
            var layout = new window.invock[name]({ parent : parent });
            layout.name = name;
            var parent_layout = layout.runLayout();
            layout.createLayout();
            var name_lower = name.toLowerCase();
            this.list_layouts[name_lower] = layout;
        }
        else {
            item = this.changeAttrChildren(item, ["render", "runing"], false);
            item = this.assignParentChildren(item);
        }
    }
    
    getparentForce(item, list_parents) {
        var parent = this.getParent(item, list_parents);
        if (typeof parent === "undefined") {
            var parent_ = this.getParentProche(item);
            if (parent_.name === "if" || parent_.name === "for"  || parent_.name === "else" || parent_.name === "desktop" || parent_.name === "mobile") {
                if (typeof parent === "undefined" || parent === null || parent === {} ) {
                    parent = list_parents[list_parents.length-1].parent;
                }
            }
            else {
                parent = this.getParent(parent_, list_parents);
            }
        }
        return parent;
    }
    
    
	findInContainer(item) {
		var name = item.name;
		var tag = item.tag;
		var parent_tag = item.parent_name.tag;
		for (var c = 0; c < this.container_elements.length; c++) {
			var new_item = this.container_elements[c];
			if (name === new_item.name && tag === new_item.tag && parent_tag === new_item.parent) {
				new_item.index = c;
				c = this.container_elements.length;
				return new_item;
			}
		}
	}


    switchStatus(status, array, value_prop, prop_state, element, parent, variable) {
        var self = this;
		for (var i = 0; i < array.length; i++) {
			var index = array[i];
			var value_array = value_prop[prop_state];
			switch(status) {
				case "add":
                    
				  if (element.index_counter !== index && element.tag.indexOf(prop_state) > -1) {
                      var value_0 = value_array[index];
                      var tree_element = [];
                      var div_root = "<div root='root'>";
                      self.for_counter = index;
                      var object_root = {type: "tag", name: "div", tag: "<div root='root'>", parent: false, open: true, parent_name: "", closed: false, data: "", attrs: {root : 'root'}, render: true, runing : true, children : []};
                         if (typeof element.parent_name !== "undefined" && element.parent_name !== false && parent !== false ) {
                             object_root = element.parent_name;
                         }
                         element.parent_name = object_root;
                         object_root.parent_name = { element : parent };
                         object_root.children.push(element);
                         var first_children = element.children[0];
                         if (typeof first_children === "undefined") {
                             var name_comp = element.name_comp;
                             var comp = store.getComponent(name_comp);
                             this.name = name_comp;
                             var html_comp =  comp.html;
                             var tree = parserHTML.parse(html_comp);
                             this.readTree(tree, 0, function(item) {
                                if (item.tag.indexOf("{% for") > -1) {
                                    var parent_name_item = item.parent_name;
                                    var parent_name_tag = parent_name_item.tag;
                                    var state_elements_cible = false;
                                    if (parent_name_item.name === "if") {
                                        var attr_target = element.name_comp+"."+parent_name_tag.split(" ")[2];
                                        if (typeof store.find(attr_target) !== "undefined") {
                                            state_elements_cible = store.find(attr_target)[0].elements[0].status_if;
                                        }
                                        
                                    }
                                    if (parent_name_item.name === "else") {
                                        var attr_target = element.name_comp+"."+parent_name_tag.split(" ")[2];
                                        state_elements_cible = !store.find(attr_target).elements[0].status_if;
                                    }
                                    if (parent_name_item.name === "for") {
                                        var attr_target = element.name_comp+"."+parent_name_tag.split(" ")[2];
                                        state_elements_cible = store.find(attr_target).elements[0].runing;
                                        
                                    }
                                    if (parent_name_item.name === "if" || parent_name_item.name === "for" || parent_name_item.name === "else") {
                                        element.runing = state_elements_cible;
                                        this.changeAttrChildren(element, ["render", 'runing'], state_elements_cible);
                                    }
                                    
                                    var split_in = item.tag.split(" in ");
                                    var regx_cleaner_for = /{% for|{%for|%}/g;
                                    var table_original = split_in[1].replace(regx_cleaner_for, "").replace(" ", '');
                                    var table = table_original;
                                    if (table_original.split(".")[1] !== "state" && table_original.split(".")[1] !== "props") {
                                        table = this.addNameComp(table_original, undefined, true);
                                        var new_tag = item.tag.replace(table_original, table);
                                        item.tag = new_tag;
                                        this.current_for = new_tag;
                                    }
                                    
                                    if (item.tag === element.tag || item.tag.indexOf(prop_state) > -1) {
                                        first_children = item.children[0];
                                        element.duplicate = false;
                                        element.children = [];
                                        first_children.name_comp = first_children.name;
                                        first_children.index = index;
                                        first_children.index_child = index;
                                        element.children.push(first_children);
                                        self.renderElement([element], parent, true);
                                    }
                                }
                                
                                 
                                 return item;
                             });
                         }
                         else {
                             element.duplicate = false;
                             element.children = [];
                             first_children.index = index;
                             first_children.index_child = index;
                             element.children.push(first_children);
                             self.renderElement([element], parent, true);
                         }
                         
                         
				  }

				break;
				case "update":
                    var element_target = element.children[index];
                    element_target.element.remove();
                    self.for_counter = index;
                    self.data.counter_loop = index;
                    this.data[variable].data = value_prop[prop_state];
                    this.setData(self.data.name, self.data);
                    element_target.index = index;
                    this.current_for = element_target.parent_name.tag;
                    self.renderElement(element_target, parent, true);
				break;
				case "remove":
                    var element_target = element.children[index].element;
                    element_target.remove();
				break;
			}
		}
	}

	updateElement(objElement) {
		//console.log(objElement);
		var text = objElement.text_original;
		//var text_orginal = objElement.text_original;
		var attrs = objElement.attrs;
		var element = objElement;
		var regx_variable = /{([^}]+)?}?}/g;
		var match = text.match(regx_variable);
		if (match !== null) {
			for (var i =0; i < match.length; i++) {
				var name_attr = match[i].substring(2, match[i].length-2);
				/*if (typeof status === "undefined") {
					status = false;
				}*/
				text = text.replace(match[i], this.getDataAttribute(name_attr));
			}
		}
		//console.log(objElement);
  	     var text_node = document.createTextNode(text);
		for (var attr in attrs) {
            if (!attrs.hasOwnProperty(attr)) {
                continue;
            }
			var valeur = attrs[attr];
			element.setAttribute(attr, valeur);
		}
		element.html("");
		element.appendChild(text_node);
		return element;
	}
    
    updateElementAttributes(item, element) {
        var attr_original = element.attrs;
        var regx_variable = /{([^}]+)?}?}?}?}/g;
        for (var attr in attr_original) {
            if (!attr_original.hasOwnProperty(attr)) {
                continue;
            }
            var valeur_attr = attr_original[attr];
            var match_attr = valeur_attr.match(regx_variable);
            if (match_attr !== null) {
                /*for (var ma = 0; ma < match_attr.length; ma++) {
                    var valeur_name_comp = this.addNameComp(match_attr[ma], true);
                }*/
                var value_match_attr = this.getValueMatch(match_attr, valeur_attr);
                //var variables_attr = value_match_attr.variables;
                valeur_attr = value_match_attr.text;
            }
            element.setAttribute(attr, valeur_attr);    
        } 
		return element;
	}

	findInElements(prop) {
		var result = [];
		for (var e = 0; e < this.elements.length; e++) {
			var element = this.elements[e];
			var value_for_operation = element.for_operation;
			var value_if_operation = element.tag;
			if (value_for_operation !== "") {
				value_for_operation = value_for_operation.split(" in ")[1].replace("%}", "").replace(" ", "");
			}
			if (value_if_operation !== "") {
				value_if_operation = value_if_operation.split(" ")[2];
			}
			if (element.variables.length > 0) {
				for (var v = 0; v < element.variables.length; v++) {
					var prop_variable = element.variables[v].split("|")[0];
					if ( prop_variable === prop || value_for_operation === prop) {
						result.push(element);
					}
				}
			}
			else {
				if ( value_for_operation === prop || value_if_operation === prop ) {
					result.push(element);
				}
			}

		}
		return result;
	}

	deleteInElements(prop, index) {
		var index_depart = 0;
		for (var e = 0; e < this.elements.length; e++) {
			var element = this.elements[e];
			var value_for_operation = element.for_operation;
			if (value_for_operation !== "") {
				value_for_operation = value_for_operation.split(" in ")[1].replace("%}", "").replace(" ", "");
			}
				if ( value_for_operation === prop) {
					index_depart = e;
					e = this.elements.length;
				}
		}
		var index_element = index+index_depart;
		var element_removed = this.elements[index_element];
		this.elements.splice(index_element, 1);
		return element_removed;
	}

	componentStatement(item, list_parents, parent_root, object_props) {
        var name_original = this.name;
        item.name_comp = item.name;
		var props = {};
		if (item.type === "component") {
			var props_values = this.getProps(item.tag, item.name, this.id_component);
			props = props_values.values;
            var name = item.name;
			var exist_comp = store.existComponent(name);
            var parent = this.getParent(item, list_parents);
            if ( typeof item.parent_name.attrs.root !== "undefined" && item.parent_name.attrs.root === "root") {
                parent = parent_root;
            }
            var component;
            var parent_;
			if (!exist_comp && item.runing) {
				var component_exist = store.getComponent(name);
				if (typeof component_exist === "undefined") {
                    if (typeof object_props !== "undefined") {
                        for (var attrname in object_props) { 
                            props[attrname] = object_props[attrname]; 
                        }
                    }
				    component = new window.invock[name](props);
					store.addComponent(name, component);
					if (typeof parent === "undefined") {
						parent_ = this.getParentProche(item);
                        if (parent_.name === "if" || parent_.name === "for"  || parent_.name === "else" || parent_.name === "desktop" || parent_.name === "mobile") {
                            if (typeof parent === "undefined" || parent === null || parent === {} ) {
                                parent = list_parents[list_parents.length-1].parent;
                            }
                        }
                        else {
                            parent = this.getParent(parent_, list_parents);
                        }
					}
                    if (typeof object_props !== "undefined") {
                        for (var attrname in object_props) { 
                            component.acces_props.push(attrname);
                        }
                    }
                    if (typeof props.alias === "undefined") {
                        props.alias = item.name;
                    }
                    component.alias = props.alias;
					component.name = this.name = item.name;
					component.container_elements = this.container_elements;
			        component.list_parents = list_parents;
				}
				else {
					component = component_exist;
				}
                if (typeof props.parent_name !== "undefined" && props.parent_name !== "") {
                    parent = dom.get(props.parent_name);
                }
				component.runComponent(parent);
                if (component.clone) {
                    this.data = store.getStoreByAlias(props.alias);
                }
                else {
                    this.getData(name);
                }
			}
			if (!exist_comp && !item.runing) {
                if (typeof object_props !== "undefined") {
                    for (var attrname in object_props) { 
                        props[attrname] = object_props[attrname]; 
                    }
                }
				component = new window.invock[name](props);
				store.addComponent(name, component);
				parent = this.getParent(item, list_parents);
				if (typeof parent === "undefined") {
                    parent_ = this.getParentProche(item);
                    if (parent_.name === "if" || parent_.name === "for"  || parent_.name === "else" || parent_.name === "desktop" || parent_.name === "mobile") {
                        if (typeof parent === "undefined" || parent === null || parent === {} ) {
                            if (list_parents.length > 0) {
                                parent = list_parents[list_parents.length-1].parent;
                            }
                        }
                    }
                    else {
                        parent = this.getParent(parent_, list_parents);
                    }
                }
                var parent_name = props.parent_name
                if (typeof props.parent_name !== "undefined" && props.parent_name !== "") {
                    parent = dom.get(parent_name);
                }
                if (typeof object_props !== "undefined") {
                    for (var attrname in object_props) { 
                        component.acces_props.push(attrname);
                    }
                }
                item.parent_name.element = parent;
				component.parent = parent;
				component.name = item.name;
				component.container_elements = this.container_elements;
		        component.list_parents = list_parents;
                if (typeof props.alias !== "undefined") {
                    this.data = store.getStoreByAlias(props.alias);
                }
                else {
                    this.data = store.getStore(item.name) || { props : {}, state : {} };
                }
                
			}
			if (exist_comp && item.runing) {
				component = store.getComponent(name);
                if (component.clone) {
                    if (typeof object_props !== "undefined") {
                        for (var attrname in object_props) { 
                            props[attrname] = object_props[attrname]; 
                        }
                    }
                    component = new window.invock[name](props);
					store.addComponent(name, component);
					parent = this.getParent(item, list_parents);
                    if (typeof parent === "undefined") {
						parent_ = this.getParentProche(item);
                        if (parent_.name === "if" || parent_.name === "for"  || parent_.name === "else" || parent_.name === "desktop" || parent_.name === "mobile") {
                            if (typeof parent === "undefined" || parent === null || parent === {} ) {
                                if (list_parents.length > 0) {
                                    parent = list_parents[list_parents.length-1].parent;
                                }
                            }
                        }
                        else {
                            parent = this.getParent(parent_, list_parents);
                        }
					}
                    if (typeof props.parent_name !== "undefined" && props.parent_name !== "") {
                        parent = dom.get(props.parent_name);
                    }
                    if (typeof object_props !== "undefined") {
                        for (var attrname in object_props) { 
                            component.acces_props.push(attrname);
                        }
                    }
                    if (typeof props.alias === "undefined") {
                        props.alias = item.name;
                    }
					component.name = item.name;
                    component.alias = props.alias;
					component.container_elements = this.container_elements;
			        component.list_parents = list_parents;
                    component.runComponent(parent);
                    this.data = store.getStoreByAlias(props.alias);
                    
                    
                }
                else {
                    if (typeof object_props !== "undefined") {
                        for (var attrname in object_props) { 
                            props[attrname] = object_props[attrname]; 
                        }
                    }
                    component.props = props;
                    this.container_elements = component.container_elements;
                    this.list_parents = component.list_parents;
                    parent = this.getParent(item, list_parents);
                    if (typeof parent === "undefined") {
						parent_ = this.getParentProche(item);
                        if (parent_.name === "if" || parent_.name === "for"  || parent_.name === "else" || parent_.name === "desktop" || parent_.name === "mobile") {
                            if (typeof parent === "undefined" || parent === null || parent === {} ) {
                                if (list_parents.length > 0) {
                                    parent = list_parents[list_parents.length-1].parent;
                                }
                            }
                        }
                        else {
                            parent = this.getParent(parent_, list_parents);
                        }
					}
                    if (typeof props.parent_name !== "undefined" && props.parent_name !== "") {
                        parent = dom.get(props.parent_name);
                    }
                    if (typeof object_props !== "undefined") {
                        for (var attrname in object_props) { 
                            component.acces_props.push(attrname);
                        }
                    }
                    component.parent = parent;
                    component.rendering = true;
                    component.runComponent(parent);
                    this.getData(name);
                }
			}
			if (exist_comp && !item.runing) {
				component = store.getComponent(name);
				component.props = props;
				this.container_elements = component.container_elements;
		        this.list_parents = component.list_parents;
				parent = this.getParent(item, component.list_parents);
				if (typeof parent === "undefined") {
						parent_ = this.getParentProche(item);
                        if (parent_.name === "if" || parent_.name === "for"  || parent_.name === "else" || parent_.name === "desktop" || parent_.name === "mobile") {
                            if ((typeof parent === "undefined" || parent === null || parent === {}) &&  list_parents.length > 1) {
                                
                                parent = list_parents[list_parents.length-1].parent;
                            }
                        }
                        else {
                            parent = this.getParent(parent_, list_parents);
                        }
					}
                if (typeof props.parent_name !== "undefined" && props.parent_name !== "") {
                    parent = dom.get(props.parent_name);
                }
				component.stopComponent(parent);
			}
		}
		if (item.parent_name.tag === this.current_for) {
			var split_for = this.current_for.split(" in ");
			var name_for = split_for[1].split(".")[0];
			this.name = name_for;
			this.getData(name_for);
		}
        this.name = name_original;

	}

	getParentProche(item) {
		var parent_temp = item.parent_name;
		if (parent_temp.name === "if" || parent_temp.name === "for" || parent_temp.name === "else") {
			this.getParentProche(parent_temp);
		}
		return parent_temp;
	}

	getData(name) {
        if (this.component_support) {
            this.data = store.getStore(name);
        }
	}
	setData(name, data) {
        if (this.component_support) {
            if (typeof this.alias !== "undefined" && this.alias !== "") {
                store.setStoreByAlias(this.alias, data);
                this.data = store.getStoreByAlias(this.alias);
            }
            else {
                 this.data = store.setStore(name, data);
            }
            
        }
	}
	getProps(tag, name) {
        
		var store_props = [];
		var regx_cleaner_for = /{% | %}/g;
		tag = tag.replace(regx_cleaner_for, "");
		var split_props = tag.split(" ");
        var objet_props = {};
        var new_tag = tag.replace(split_props[0]+" ", "");
        new_tag = new_tag.replace(/[!^\W][^!\S]/g, '",');
        split_props = new_tag.split(",");
		for (var i = 0; i < split_props.length; i++) {
			var propriete = split_props[i];
			if (propriete !== name && propriete !== "") {
				var name_propriete = propriete.split("=")[0];
				var value_propriete = propriete.split("=")[1];
				value_propriete = value_propriete.replace(/['"]/g, '');
				var regx_variable = /{([^}]+)?}?}/g;
				var match = value_propriete.match(regx_variable);
				if (match !== null) {
					var name_attr = value_propriete.substring(2, value_propriete.length-2);
					var value = this.getAttributeValue(name_attr);
					objet_props[name_propriete] = value;
				}
				else {
					objet_props[name_propriete] = value_propriete;
				}

			}
		}
		return { values :  objet_props, store_props : store_props};
	}

	changeAttrChildren(item, attrs, value) {
        var children = item.children;
        var new_children = [];
		for (var c = 0; c < children.length; c++) {
            var child = Object.assign({}, children[c]);
			for (var a = 0; a < attrs.length; a++) {
				var attr = attrs[a];
				child[attr] = value;
			}
            new_children.push(child);
		}
        item.children = new_children;
		return item;
	}
    
    assignParentChildren(item) {
		for (var c = 0; c < item.children.length; c++) {
            item.children[c].parent_name = item;
		}
		return item;
	}
	forStatement(item) {
        //console.log(item.tag + " - "+item.runing);
		this.changeAttrChildren(item, ["render", "runing"], item.runing);
		var split_in = item.tag.split(" in ");
		var regx_cleaner_for = /{% for|{%for|%}/g;
		var variable = split_in[0].replace(regx_cleaner_for, "").replace(" ", '');
		var table_original = split_in[1].replace(regx_cleaner_for, "").replace(" ", '');
		var table = table_original;
		if (table_original.split(".")[1] !== "state" && table_original.split(".")[1] !== "props") {
			table = this.addNameComp(table_original, undefined, true);
			var new_tag = item.tag.replace(table_original, table);
			item.tag = new_tag;
			this.current_for = new_tag;
		}
        if (typeof item.duplicate === "undefined") {
            item.templating = this;
            item.alias = this.alias;
            var observer = { element : item, text : item.tag, for_operation : item.tag, type : "boucle", attr : table, attributes : [], tag : item.tag, parent : item.parent_name, alias : this.alias };
            store.addInObserver(this.name, observer);
        }
        
		var data_table = this.getDataAttribute(table,true);
        
		if (typeof data_table.data !== "undefined") {
			data_table = data_table.data[this.for_counter];
		}
		this.data[variable] = { created : true, data : [], parent : table, name : this.addNameComp(variable, undefined, true) };
		var children = item.children;
		if (typeof data_table.created === "undefined") {
			for (var d = 0; d < data_table.length; d++) {
				this.data[variable].data.push(data_table[d]);
			}
            if (typeof item.duplicate === "undefined" || item.duplicate ===  true ) {
                item.children = this.duplicateChildren(children, data_table.length);
            }
			
		}
		else {
			for (var dd = 0; dd < data_table.data.length; dd++) {
					for (var i = 0; i < data_table.data[dd].length; i++) {
						this.data[variable].data.push(data_table.data[dd][i]);
					}
                if (typeof item.duplicate === "undefined"  || item.duplicate ===  true) {
                    this.new_children_for.push(this.duplicateChildren(children, data_table.data[dd].length));
                }
				
			}
			if (this.last_for !== item.tag) {
				this.last_for = item.tag;
			}
			if (this.last_for === item.tag) {
				var list_children = this.new_children_for[this.for_counter];
				item.children = list_children;
			}
		}
		this.setData(this.data.name, this.data);
        
		
        
		return item;
	}

	duplicateChildren(children, nbr_duplicate) {
		var new_children = [];
        if (children.length === 1) {
            for (var d = 0; d < nbr_duplicate; d++ ) {
                var child = Object.assign({}, children[0]);
                child.index_child = d;
                new_children.push(child);
            }
        }
        else {
            
            var item_children = {
                attrs : {  },
                closed : false,
                data : '',
                name : "item",
                open : true,
                parent : true,
                parent_name : children[0].parent_name,
                render : true,
                runing : true,
                tag : "<item>",
                type : 'tag',
                children : children[0]
            }
            children[0].parent_name = item_children;
            for (var d = 0; d < nbr_duplicate; d++ ) {
                var id = this.utils.generateID();
                var child = Object.assign({}, item_children);
                child.tag = "<item data-key='"+id+"'>";
                child.attrs = { "data-id" : id };
                child.index_child = d;
                var new_childs = [];
                for (var i = 0; i < children.length; i++) {
                    var child_children = Object.assign({}, children[i]);
                    child_children.parent_name = child;
                    new_childs.push(child_children);
                }
                child.children = new_childs;
                new_children.push(child);
            }
        }
		return new_children;
	}

	ifStatement(item,add_in_element) {
		var tag = item.tag;
		var split_tag_and = tag.split("AND");
		var split_tag_or = tag.split("OR");
		var stores_status = [];
		var regx_cleaner = /{% if|{%if|%}/g;
		var result = false;
		if (split_tag_and.length > 1 || split_tag_or.length > 1 ) {
			if (split_tag_and.length > 1) {
				for (var a = 0; a < split_tag_and.length; a++ ) {
					var cas = split_tag_and[a];
					cas = cas.replace(regx_cleaner, "");
					this.nbr_operations = split_tag_and.length;
					stores_status.push(this.statement(cas, item, add_in_element));
				}
			}
			if (split_tag_or.length > 1) {
				for (var aa = 0; aa < split_tag_or.length; aa++) {
					var cas_or = split_tag_or[aa];
					cas_or = cas_or.replace(regx_cleaner, "");
					this.nbr_operations = split_tag_or.length;
					stores_status.push(this.statement(cas_or, item, add_in_element));
				}
			}
			for (var s = 0; s < stores_status.length; s++) {
				if (split_tag_and.length > 1) {
					result = true;
					if (stores_status[s] === false) {
						result = false;
						s = stores_status.length;
						break;
					}
				}
				if (split_tag_or.length > 1) {
					result = false;
					if (stores_status[s] === true) {
						result = true;
						s = stores_status.length;
						break;
					}
				}
			}

			return result;
		}
		if (split_tag_and.length === 1 && split_tag_or.length === 1){
			//var regx_cleaner = /{% if|%}/g;
			tag = tag.replace(regx_cleaner, "");
			return this.statement(tag, item, add_in_element);
		}

	}

	statement(tag, item, add_in_element) {
        
		var split_tag = tag.split(" ");
		var operator = null;
		var counter_operator = 0;
		var variable_comparaison = "";
		var attribute = "";
		for (var t = 0; t < split_tag.length; t++) {
			var case_tag = split_tag[t];
			var reg_comparaison = /(eq|gt|lt|gte|lte|neq)/g;
			var match_comparaison = null;
			if (case_tag.length < 4) {
				match_comparaison = case_tag.match(reg_comparaison);
			}
			if (match_comparaison !== null) {
				operator = case_tag;
				counter_operator +=1;
			}//&& case_tag.split(".").length > 1
			else if (match_comparaison === null && counter_operator === 0 && case_tag !== " " && case_tag !== ""){
				attribute = case_tag;
			}
			if (operator !== null && operator !== case_tag) {
				variable_comparaison +=case_tag+" ";
			}
			if (counter_operator > 1) {
				operator = null;
				counter_operator -=1;
				this.runOperationIf(attribute, variable_comparaison, operator, item, add_in_element);
			}

		}
		var status = this.runOperationIf(attribute, variable_comparaison, operator, item, add_in_element);
		//console.log(status);
		if (status === true) {
			this.store_counter.push(this.index);
		}
		return status;
	}

	runOperationIf(attr, comp, operator, item, add_in_element) {
		//attr = this.addNameComp(attr, undefined, true);
		if (typeof add_in_element === "undefined") {
			var name = attr.split(".")[0];
			item.templating = this;
            item.alias = this.alias;
			var observer = { element : item, text : item.tag, for_operation : this.current_for, type : "operation", attr : attr.split("|")[0], attributes : [], tag : item.tag, parent : name, alias : this.alias };
			store.addInObserver(name, observer);
		}
		var data_attribute = this.getAttributeValue(attr);
		comp = comp.replace(/['"]/g, '');
		comp = comp.substring(0, comp.length-2);

		 if (comp === "true") {
			 comp = true;
		 }
		 if (comp === "false") {
			 comp = false;
		 }
	    if ( !isNaN(parseFloat(comp)) ) {
			comp = parseFloat(comp);
		}
		//console.log(comp + " - "+ data_attribute + " - "+ attr );
		if ( !isNaN(parseFloat(data_attribute)) ) {
			data_attribute = parseFloat(data_attribute);
		}
        
 		switch (operator) {
			case "eq" :
				return data_attribute === comp;
			case "gt" :
				return parseFloat(data_attribute)  > parseFloat(comp);
			case "lt":
				return parseFloat(data_attribute)  < parseFloat(comp);
			case "gte":
				return parseFloat(data_attribute) >= parseFloat(comp);
			case "lte" :
				return parseFloat(data_attribute)  <= parseFloat(comp);
			case "neq":
				return data_attribute  !== comp;
			case null:
				return typeof data_attribute !== "undefined" && data_attribute !== null && data_attribute !== false;
		}

	}

	getDataAttributeList(name_attr) {
		/*var attr = name_attr.split("|")[0];
		attr = attr.split(".")[0];*/
		var data_temp = this.getAttributeValue(name_attr);
        
		/*if (typeof data_temp.created !== "undefined") {
			var value = data_temp.data[this.index];
			if (name_attr.split("|").length > 1) {
				value = this.filtre.parseFiltre(value, name_attr);
			}
			return value;
		}
		else {
			data_temp = this.getDataAttribute(name_attr);
			if (name_attr.split("|").length > 1) {
				data_temp = this.filtre.parseFiltre(data_temp, name_attr);
			}
		}*/
        
		return data_temp;
	}
	getAttributeValue(name_attr, data) {
        
		var parent_name_attr = name_attr.split(".")[0];
		if (parent_name_attr !== "state" && parent_name_attr !== "props" && name_attr.split(".").length > 1) {
		  this.getData(parent_name_attr);
		}
        var attr = name_attr.split("|")[0];
        var split_name_attr = attr.split('.');
        var attr_base = split_name_attr[1];
        
        var attr_base2 = split_name_attr[0];
		var data_verify = store.getStore(attr_base2);
        
		if (attr_base !== "state" && attr_base !== "props" && typeof data_verify === "undefined") {
			name_attr = this.addNameComp(name_attr, undefined, true);
		}
        attr = name_attr.split("|")[0];
        split_name_attr = attr.split('.');
		if (typeof data === "undefined") {
          attr_base2 = name_attr.split(".")[0];
		  data = this.data = store.getStore(attr_base2);
		}
        else {
            data = this.data;
        }
        var data_temp = data;
		var attr_base_2 = name_attr.split(".")[1].split('|')[0];
        
        if (this.component_support) {
            data_temp = data[attr_base_2];
        }
        else {
            data_temp = data;
            if (typeof data[attr_base2].created !== "undefined") {
                data_temp = data[attr_base2];
            }
            else {
                this.current_for = "";
            }
        }
        var k = 0;
        
		if (typeof data_temp.created !== "undefined") {
            if (this.for_counter > data_temp.data.length-1) {
                //this.for_counter = data_temp.data.length -1;
            }
			data_temp = data_temp.data[this.for_counter];
            k = 1;
		}
        else {
           // this.current_for = "";
        }
		//if (split_name_attr.length > 0) {
            if (this.component_support) {
                k = 2;
            }
		  for (var j = k; j < split_name_attr.length; j++) {
		    var attr_cible = split_name_attr[j];
              
            if (typeof data_temp !== "undefined") {
                data_temp = data_temp[attr_cible];
            }
		  }
        
         var split_filter = name_attr.split("|");
         
		  if (name_attr.split("|").length > 1) {
            var param_filtre = name_attr.split("|")[1];
            var regx_variable = /{([^}]+)?}?}/g;
		    var match = param_filtre.match(regx_variable);
            data_temp = this.filtre.parseFiltre(data_temp, name_attr);
          
              
		  }
        else {
              data_temp = this.filtre.parseFiltre(data_temp, name_attr);
          }
		//}
		return data_temp;
	}

	getDataAttribute(name_attr, get ) {
		var data_temp = this.getAttributeValue(name_attr);
        if (typeof data_temp !== "undefined") {
            var result_temp = null;
            if(typeof data_temp.created !== "undefined" && typeof get === "undefined") {
                //var total = data_temp.data.length;
                result_temp = this.getAttributeValue(name_attr);
                return result_temp;
            }
            else {
               // this.current_for = "";
                return data_temp;
            }
        }
        else {
            return {};
        }
	}

  getValueMatch(match, text) {
		var variables = [];
		for (var i =0; i < match.length; i++) {
			var attr = match[i];
			var data_verify = this.verifyData(attr);
			var match_attr = match[i];
			var name_attr = match_attr.substring(2, match_attr.length-2);
			if (typeof data_verify === "undefined") {
				name_attr = this.addNameComp(match_attr);
			}

			//var value_text = this.getAttributeValue(name_attr);
			variables.push(name_attr);
			/*if (name_attr.indexOf("state") > -1 || typeof value_text.created !== "undefined" ) {

			}*/
			text = text.replace(match[i], this.getDataAttribute(name_attr));
		}
		return {text : text, variables : variables };
	}

	verifyData(text) {
		var regx_variable = /{([^}]+)?}?}/g;
		var match = text.match(regx_variable);
		var attr = text.split("|")[0].split(".")[0];
		if (match !== null) {
			attr = text.substring(2, text.length-2).split("|")[0].split(".")[0];
		}
        
		var data_verify = store.getStore(attr);
		var result = false;
		if (typeof data_verify !== "undefined") {
            this.name = attr;
			result = true;
		}
		return result;
	}

	addNameComp(text, variable, pure, name) {
        if (this.component_support) {
            if (typeof name === "undefined") {
                name  = this.name;
            }
            var verify_data = this.verifyData(text);
            var name_attr;
            if (typeof pure === "undefined") {
                name_attr = text.substring(2, text.length-2);
            }
            else {
                name_attr = text;
            }
            var name_comp = name_attr.split(".")[0];
            if ( name_comp !== name && !verify_data) {
                name_attr = name+"."+name_attr;
            }
            if (typeof variable !== "undefined") {
                name_attr = "{{"+name_attr+"}}";
            }
            return name_attr;
        }
        else {
            return text;
        }
		
	}

	createElement(tag, text, attrs, update) {
		var element = document.createElement(tag);
		var text_original = text;
		element.text_original = text;
		element.templating = this;
		element.attrs = attrs;
		element.name = this.name;
		element.index_counter = this.for_counter;
        var attrs_original = attrs;
		var regx_variable = /{([^}]+)?}?}?}?}/g;
		var match = text.match(regx_variable);
		var variables = [];
        element.observers =  [];
		if (match !== null) {
			//var new_text_original = text;
			for (var m = 0; m < match.length; m++) {
				var val = this.addNameComp(match[m], true);
				text_original = text_original.replace(match[m], val);
			}
			element.text_original = text_original;
			var value_match = this.getValueMatch(match, text);
			text = value_match.text;
			//var match_props = text.match(regx_variable);
			variables = value_match.variables;
		}
  	    var text_node = document.createTextNode(text);
		for (var attr in attrs) {
            if (!attrs.hasOwnProperty(attr)) {
                continue;
            }
            var valeur = attrs[attr];
            if (attr === "parent") {
                var split_valeur_tiret = valeur.split("-");
                var name_layout = split_valeur_tiret[0];
                var layout = this.list_layouts[name_layout];
                var name_block = split_valeur_tiret[1];
                var parent_element = layout.getParent(name_block);
                element.parent_layout = parent_element;
            }
            else {
                var match_attr = valeur.match(regx_variable);
                if (match_attr !== null) {
                    var value_match_attr = this.getValueMatch(match_attr, valeur);
                    
                    var variables_attr = value_match_attr.variables;
                    if (match_attr !== null && variables_attr.length > 0 && typeof update === "undefined") {
                        for (var vra = 0; vra < variables_attr.length; vra++) {
                            var attr_variable = this.addNameComp(variables_attr[vra].split("|")[0], undefined, true);
                            
                            var observer_attr = { element : element, text : text_original, for_operation : this.current_for, type : "attr", name_attr: attr, attrs_original : attrs_original, 
                                                 attr :  attr_variable, 
                                                 attributes : attrs, tag : tag, parent : this.name, alias : this.alias };
                            //element.observers.push(observer_attr);
                            var split_attr_variable = attr_variable.split(".")
                            var data_attr = store.getStore(split_attr_variable[0]);
                            var data_attr2 = data_attr[split_attr_variable[1]];
                            var value_attr_data = data_attr2[split_attr_variable[2]];
                            if (typeof this.current_for === "undefined" || this.current_for === "" || this.current_for === null ) {
                                if (this.accept_store === true) {
                                    store.addInObserver(this.name, observer_attr);
                                }
                            }
                            else if (typeof value_attr_data === "string" || typeof value_attr_data === "number" || typeof value_attr_data === "boolean") {
                                if (this.accept_store === true) {
                                    store.addInObserver(this.name, observer_attr);
                                }
                            }
                           
                            
                        }
                    }
                    valeur = value_match_attr.text;
                }
                element.setAttribute(attr, valeur);   
            }
		}
		element.appendChild(text_node);
        
		if (match !== null && variables.length > 0 && typeof update === "undefined") {
			for (var vr = 0; vr < variables.length; vr++) {
				//, component : this.id_component
                
                var attr_element = variables[vr].split("|")[0];
                attr_element = this.addNameComp(attr_element, undefined, true);
				var observer = { element : element, text : text_original, for_operation : this.current_for, type : "element", attr : attr_element, attributes : attrs, tag : tag, parent : this.name, alias : this.alias };
                if (typeof this.current_for === "undefined" || this.current_for === "" || this.current_for === null) {
                    if (this.accept_store === true) {
                        store.addInObserver(this.name, observer);
                    }
                    
                }
                
				//element.observers.push(observer);
			}
		}
        element.alias = this.alias;
		return element;
	}

	getParent(item, list) {
		//var parent = null;
        //-1
        var max = list.length-1;
        if (list.length === 1) {
            var parent_temp = list[0];
            if (item.parent_name.tag === parent_temp.tag) {
                return parent_temp;
            }
        }
        else {
            for(var i = max; i >= 0 ; i--) {
                var parent_temp = list[i];
                if (item.parent_name.tag === parent_temp.tag) {
                    return parent_temp;
                }
            }
        }
		
	}
} // fin de la classe templating