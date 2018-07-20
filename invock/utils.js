let instance = null;
class Utils {
	/**
	 * Constructor de la classe singleton Utils
	 * @constructor
	 * @param {Object} params - la liste des paramétres pour le constructor de la classe.
	 * @param {String} static_root - le chemin vers le dossier sttic du projet
	 */
	constructor(params) {
        params = params || {};
		this.langue = params.langue || 'fr';
		this.staticRoot = params.static_root || '/static/';
		this.acceptMultilangue = params.acceptMultilangue || false;
		this.staticFormatDate = { fr : "DD/MM/YYYY", en :"YYYY/MM/DD" };
		this.verifyBoolean(params.debug, function(value) {
			this.debug = value;
		});
		// code pour que la classe Utils sera instancié une seule fois
		if(!instance){
              instance = this;
        }
		return instance;
	}
	/**
	 * une fonction qui vérifie le type Boolean et sa valeur d'une maniére fiable
	 * @verifyBoolean
	 * @param {Boolean} value - la valeur a tester
	 * @param (Function) callback - la fonction de callback qui récupere la résultat de test.
	 */
	verifyBoolean(value, callback ) {
		var value_result = null;
		if( value === false ) {
			value_result = false;
		}
		else {
			value_result = true;
		}
		callback.call(this, value_result);
	}
    is_boolean(value) {
        if (value === true) {
            return true;
        }
        else {
            return false;
        }
    }
	/**
	 * une fonction afficher les différents logs si le debug est true
	 * @log
	 * @param {String} msg - le message a afficher
	 * @param (String) type - le type de messsage a afficher ( info, error, warning, dir, table, log );
	 */
	log(msg, type) {
		if( this.debug ) {
			switch (type) {
				case "dir" :
					console.dir(msg);
				break;
				case "error" :
					throw new Error(msg);
				case "info" :
					console.info(msg);
				break;
				case "table" :
					console.table(msg);
				break;
				case "warning" :
					console.warn(msg);
				break;
				default :
					console.log(msg);
				break;
			}
		}
	}
	/**
	 * une fonction qui vérifie si la valeur et de type String ou pas
	 * @is_string
	 * @param {String} value - la valeur a tester
	 */
	is_string(value) {
		if( typeof value === 'string' || value instanceof String  && typeof value !== "boolean" ) {
			return true;
		}
		else {
			return false;
		}
	}
    is_string_code(value) {
		if( typeof value === 'string' || value instanceof String  && typeof value !== "boolean" ) {
			if (value.length === 40) {
                return true;
            }
            else {
                return false;
            }
		}
		else {
			return false;
		}
	}
	/**
	 * une fonction qui vérifie si la valeur et de type Number ou pas
	 * @is_number
	 * @param {Number} value - la valeur a tester
	 */
	is_number(value) {
		if( !isNaN(value/1) && typeof value !== "boolean" ) {
			return true;
		}
		else {
			return false;
		}
	}
	/**
	 * cette fonction vérifier la valeur s'elle est de type adresse email ou pas
	 * @is_email
	 * @param {String} email - la valeur à vérifier.
	 */
	is_email(email) {
		let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		var test = re.test(email);
		if( test ) {
			return true;
		}
		else {
			return false;
		}

	}
	/**
	 * cette fonction vérifier la valeur s'elle est de type téléphone ou pas
	 * @is_telephone
	 * @param {String} telephone - la valeur à vérifier.
	 */
	is_phone(telephone) {
		let re = /^((0|((\+|00)\d{2,3}))\d{9,20})$/;
		var test = re.test(telephone);
		if( test ) {
			return true;
		}
		else {
			return false;
		}
	}
	/**
	 * cette fonction vérifier la valeur s'elle est de type téléphone ou pas
	 * @is_telephone
	 * @param {String} telephone - la valeur à vérifier.
	 */
	is_date(date) {
		var new_date = new Date(date).getDate();
        if (isNaN(new_date)) {
            return false;
        }
        else {
            return true;
        }
	}
    
	/**
	 * une fonction va faire une boucle et passer les valeur de tableau sur une fonction callback
	 * @forEach
	 * @param {Array} array - le tableau a boucler
	 * @param (Function) callback - la fonction callback qui va s'éxecuter au sein de boucle
	 */
	forEach(array, callback) {
		if (this.is_array(array)) {
			for (var index = 0; index < array.length; index++) {
				var item = array[index];
				callback.call(this, item, index);
			}
		}
	}
	/**
	 * une fonction qui génére un ID unique
	 * @generateID
	 * @param {Number} length - le niveau sur laquel la fonction peut étendue le nombre des caractére à fournir
	 */
	generateID(l) {
		if(typeof l === "undefined") {
			l = 36;
		}
		return Math.random().toString(l).substr(2, 10);
	}
    
	/**
	 * Fonction interne qui joue le rôle de convertir une Array de la serialization to un object JS native
	 * @convertArrayToObject
	 * @param {Array} data - le tableau à convertir
	 */
	convertArrayToObject (data) {
		if( Array.isArray(data) ) {
			var object = {};
			for( var a = 0; a < data.length; a++ ) {
				object[data[a].name] =  data[a].value;
			}
			return object;
		}
		else {
			return null;
		}
	}
    convertObjectToString(object) {
        return JSON.stringify(object);
    }
    convertArrayToString(array) {
        return array.toString();
    }
    is_array(array) {
      return Array.isArray(array);
   }
  is_object(object) {
      if( !this.is_array(object) && object instanceof Object ) {
          return true;
      }
      else {
          return false;
      }
  }

    slugify(value) {
        if (this.is_string(value)) {
            value = this.lower(value);
            value = value.replace(/[#\?]/g,"");
            value = value.replace(/[&]/g,"-");
            value = value.replace(/[\+]/g,"");
            value = value.replace(/[\*]/g,"");
            value = value.replace(/[\-{2,}]/g,"-");
            value = value.replace(/[ '’]/g,"-");
            value = value.replace(/[ éèê]/g, "e");
            value = value.replace(/[ ç]/g, "c");
            value = value.replace(/[ àâ]/g, "a");
            if (this.last(value) === "-") {
                value = value.substring(0, value.length-1);
            }
            return value;
        }
        else {
            return null;
        }
	}
    lower(value) {
		return value.toLowerCase();
	}
    last(value) {
		return value[value.length-1];
	}
    
    objectSize(object) {
        var size = 0, key;
        for (key in object) {
            if (object.hasOwnProperty(key)) {
                size++;
            } 
        }
        return size;
    }
    
    findInArray (array, value) {
   		var str = array.toString();
		var index = str.search(value);
		var result = false;
		if( index > -1) {
			result = true;
		}
		return result;
   }
    
   cloneArray(array) {
        var result = new Array();
        var l = array.length;
        for (var  i = 0; i < l; i++) {
            result.push(array[i]);
        }
        return result;
    }
    removeIndexArray(index, array) {
        array.splice(index,1);
        return array;
    }
    convertObjectToString(object) {
        return JSON.stringify(object);
    }
    convertStringToObject(string) {
        return JSON.parse(string);
    }
    
} // class Utils
var utils =  new Utils();
export default utils;