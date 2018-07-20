var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, '/public');
var APP_DIR = path.resolve(__dirname, 'invock');


function ajustEntryOutputWebpack ( object ) {
    var type = object.type;
    var APP_DIR = path.resolve(__dirname, object.srcFolder);
    if (type === "SPA") {
        return {
            entry : APP_DIR+"/"+object.entry+".js",
            output : {
                path : __dirname,
                filename : "dist/invock.js"
            },
            add_dir : APP_DIR
        }
    }
    if (type === "classic" || type === "standard") {
        if (Array.isArray(object.entry)) {
            var l = object.entry.length;
            var object_entry_result = {};
            for (var e = 0; e  < l; e++) {
                var entry = object.entry[e];
                object_entry_result[entry] = APP_DIR+"/"+entry+".js";
            }
            return {
                entry : object_entry_result,
                output : {
                    path : __dirname,
                    filename : object.srcFolder+'/dist/[name].js'
                },
                add_dir : APP_DIR
            }
        }
        else {
            throw Error ("Entry Is not an Array Object" );
        }
        
        
    }
}


var ajustSources = ajustEntryOutputWebpack({
    srcFolder : "invock",
    entry : "invock" ,
    type : "SPA"
    
});

var config = {
  entry:  ajustSources.entry,
  output: ajustSources.output,
  mode :"development",
  module : {
    rules : [
      {
        test : /\.jsx?/,
        include : ajustSources.add_dir,
        loader : 'babel-loader'
      }
    ]
  }
};

module.exports = config;