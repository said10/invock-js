export default class Filtre {
	constructor() {
		this.filtres = [];
	}

	parseFiltre(data, name_attr, parametre) {
        
		var listes_filtres = name_attr.split("|");
		var result = data;
		for (var s = 1; s < listes_filtres.length; s++) {
			var split_filtre = listes_filtres[s].split(":");
			var function_filtre = split_filtre[0];
			var param = "";
			if (split_filtre.length > 1) {
				param =  split_filtre[1].replace(/["]/g, "");
			}
			result = this.applyFiltre(function_filtre,data, param );
            data = result;
		}
		return result;
	}
    applyFiltreManuel(data, filtre, parametre) {
        return this.applyFiltre(filtre,data, parametre );
    }
	addFiltre(name, filtre) {
		this.filtres.push({ "name" : name, "filtre":filtre });
	}
	getFiltre(name) {
		for (var f = 0; f < this.filtres.length; f++) {
			if (name === this.filtres[f].name) {
				return this.filtres[f];
			}
		}
	}
	applyFiltre(name, value, param) {
		var filtre = this.getFiltre(name);
		var result;
		if (typeof filtre.filtre === "undefined") {
			result = this[name].call(this,value, param);
		}
		else {
			result = filtre.filtre.call(this,value, param);
		}
		return result;
	}
	init() {
		this.addFiltre("add");
		this.addFiltre("init_default");
		this.addFiltre("defaultParam");
		this.addFiltre("multiply");
		this.addFiltre("length");
		this.addFiltre("addSlashes");
		this.addFiltre("capFirst");
		this.addFiltre("cut");
		this.addFiltre("default");
		this.addFiltre("diviseBy");
		this.addFiltre("first");
		this.addFiltre("last");
		this.addFiltre("lower");
		this.addFiltre("upper");
		this.addFiltre("slice");
		this.addFiltre("slugify");
		this.addFiltre("stringify");
		this.addFiltre("title");
		this.addFiltre("truncateWords");
		this.addFiltre("truncateChars");
		this.addFiltre("wordCount");
		this.addFiltre("urlEncode");
		this.addFiltre("color");
		this.addFiltre("date");//
		//this.addFiltre("lorem");
		//this.addFiltre("now");
	}
    
    color(value, param) {
        return "<span style='"+param+"'>"+value+"</span>";
    }
    stringify(value) {
        return JSON.stringify(value);
    }
    multiply (value, param) {
		if ( !isNaN(parseFloat(value)) &&  !isNaN(parseFloat(param))) {
			value = parseFloat(value);
			param = parseFloat(param);
		}
		return value*param;
	}
	add (value, param) {
		if ( !isNaN(parseFloat(value)) &&  !isNaN(parseFloat(param))) {
			value = parseFloat(value);
			param = parseFloat(param);
		}
		return value+param;
	}
    
    init_default (value, param) {
		if (typeof value === "undefined" || value === null) {
			value = param || "";
		}
		return value;
	}
    
	length(value) {
		return value.length;
	}
	addSlashes(value) {
		return value+"/";
	}
	capFirst(value) {
		var first_char = value[0];
		value = value.substring(1, value.length);
		first_char = first_char.toUpperCase();
		value = first_char+value;
		return value;
	}
	cut(value, param) {
		var regx = /[param]/g;
		switch (param) {
			case " ":
				regx = /[ ]/g;
			break;
			case "-":
				regx = /[-]/g;
			break;
			case "_":
				regx = /[_]/g;
			break;
			case "/":
				regx = /[\/]/g;
			break;
			case "+":
				regx = /[+]/g;
			break;
			case "*":
				regx = /[\*]/g;
			break;
			case "$":
				regx = /[\$]/g;
			break;
			case "(" :
				regx = /[\(]/g;
			break;
			case ")":
				regx = /[\)]/g;
			break;
			case "{":
				regx = /[{]/g;
			break;
			case "}":
				regx = /[}]/g;
			break;
			case "[":
				regx = /[\[]/g;
			break;

			case "]":
				regx = /[\]]/g;
			break;
			case "|" :
				regx = /[\|]/g;
			break;
			case "&" :
				regx = /[&]/g;
			break;
			case "#":
				regx = /[#]/g;
			break;
			case "%" :
				regx = /[%]/g;
			break;
		}
		value = value.replace(regx, "");
		return value;
	}
	default (value, param) {
		if (value === "" || value === null || typeof value ==="undefined" || value === " ") {
			return param;
		}
		else {
			return value;
		}
	}
	diviseBy (value, param) {
		var result;
		value = parseInt(value);
		param = parseInt(param);
		if (value%param === 0) {
			result = true;
		}
		else {
			result = false;
		}
		return result;
	}
	first(value) {
		return value[0];
	}
	last(value) {
		return value[value.length-1];
	}
	middle(value) {
		var middle_value = Math.floor(value.length/2);
		return value[middle_value];
	}
	lower(value) {
		return value.toLowerCase();
	}
	upper(value) {
		return value.toUpperCase();
	}
	slice(value, param) {
		var debut_slice = param.split(":")[0];
		if (debut_slice === "" || debut_slice === " ")  {
			debut_slice = 0;
		}
		var fin_slice = param.split(":")[1];
		var result = value.slice(debut_slice, fin_slice);
		return result;
	}
	slugify(value) {
		value = this.lower(value);
		value = value.replace(/[#\?]/g,"");
		value = value.replace(/[ '’]/g,"-");
        value = value.replace(/[&]/g,"-");
		value = value.replace(/[ éèê]/g, "e");
		value = value.replace(/[ ç]/g, "c");
		value = value.replace(/[ àâ]/g, "a");
		if (this.last(value) === "-") {
			value = value.substring(0, value.length-1);
		}
		return value;
	}
	title(value) {
		value = this.lower(value);
		var split_space = value.split(" ");
		var result = "";
		for (var i = 0; i < split_space.length; i++) {
			var word = split_space[i];
			result += this.capFirst(word) + " ";
		}
		result = result.substring(0, result.length-1);
		return result;
	}
	truncateWords(value, param) {
		var split_space = value.split(" ");
		var result = "";
		for (var i = 0; i < param; i++) {
			var word = split_space[i];
			result += word+ " ";
		}
		result = result.substring(0, result.length-1);
		return result;
	}
	truncateChars(value, param) {
		var result = "";
		for (var i = 0; i < param; i++) {
			var char = value[i];
			result += char;
		}
		return result;
	}
	wordCount(value) {
		return value.split(" ").length;
	}
	urlEncode(value) {
		return encodeURIComponent(value);
	}
	date(value, param) {
		var split_date = value.split('/');
		var format = "en";
		if (this.length(this.last(split_date)) === 4) {
			format = "fr";
		}
		var new_date;
		if (format === "en") {
			new_date = new Date(this.first(split_date), this.middle(split_date)-1, this.last(split_date) );
		}
		else {
			new_date = new Date(this.last(split_date), this.middle(split_date)-1, this.first(split_date));
		}
		return this.parseDate(new_date, value, param);
	}

	parseDate(date, value, param) {
		var split_espace = param.split(" ");
		var split_tiret = param.split("-");
		var split_slash = param.split("/");
		var split_result = [];
		var separator = "";
		if (split_espace.length > 1) {
			split_result = split_espace;
			separator = " ";
		}
		if (split_tiret.length > 1) {
			split_result = split_tiret;
			separator = "-";
		}
		if (split_slash.length > 1) {
			split_result = split_slash;
			separator = "/";
		}
		var result_date = "";
		for (var s = 0; s < split_result.length; s++) {
			var indicator = split_result[s];
			result_date += this.getValueDate(date, indicator)+separator;
		}
		result_date = result_date.substring(0, result_date.length-1);
		return result_date;
	}

	getValueDate(date, indicator) {
		var year = date.getFullYear();
		var month = date.getMonth();
		var day_number = date.getDay();
		var day = date.getDate();
		var result;
		switch(indicator) {
			case "d" :
				result = day;
			break;
			case "D" :
				result = this.parseDay(day_number).substring(0, 3);
			break;
			case "l" :
				result = this.parseDay(day_number);
			break;

			case "F" :
				result = this.parseMonth(month);
			break;
			case "M" :
				result = this.parseMonth(month).substring(0, 4);
			break;
			case "m" :
				month = parseInt(month)+1;
				if (month < 10) {
					result = "0"+month;
				}
			break;
			case "n" :
				result = parseInt(month+1);
			break;
			case "Y" :
				result = year;
			break;
			case "y" :
			    year = year+"";
				result = year.substring(year.length-2,year.length);
			break;
		}
		return result;
	}

	parseMonth(number) {
		var month = "";
		switch(number) {
			case 0 :
				month = "Janvier";
			break;
			case 1:
				month = "Février";
			break;
			case 2 :
				month = "Mars";
			break;
			case 3 :
				month = "Avril";
			break;
			case 4 :
				month = "Mai";
			break;
			case 5 :
				month = "Juin";
			break;
			case 6 :
				month = "Juillet";
			break;
			case 7 :
				month = "Août";
			break;
			case 8 :
				month = "Septembre";
			break;
			case 9 :
				month = "Octobre";
			break;
			case 10 :
				month = "Novembre";
			break;
			case 11 :
				month = "Décembre";
			break;
		}
		return month;
	}
	parseDay(number) {
		var day = "";
		switch(number) {
			case 0 :
				day = "Dimanche";
			break;
			case 1:
				day = "Lundi";
			break;
			case 2 :
				day = "Mardi";
			break;
			case 3 :
				day = "Mercredi";
			break;
			case 4 :
				day = "Jeudi";
			break;
			case 5 :
				day = "Vendredi";
			break;
			case 6 :
				day = "Samedi";
			break;
		}

		return day;
	}
}