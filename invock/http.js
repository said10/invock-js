/*
    HTTP module for communicate with server by XMLHttpRequest
 */
import dom from './dom';
export default class Http {
    constructor(params) {
        params = params || {};
        this.name = params.name || "";
        this.type = "get";
        this.url = params.url || "";
        this.url_send = params.url || "";
        this.response = null;
        this.callback = null;
        this.data = "";
        this.JSON = null;
    }
    // get data from server
    fetch (callback) {
        this.type = "get";
        this.url_send = this.url;
        this.data = "";
        this.verifyCallback(callback);
        this.ajax();
    }
    // save data in server
    post(data, callback) {
        this.type = "post";
        this.url_send = this.url;
        this.verifyCallback(callback);
        this.data = data;
        this.ajax();
    }
    // update data in server
    update(data, callback) {
        this.type = "put";
        this.url_send = this.url+"/"+data.id;
        this.verifyCallback(callback);
        this.data = data;
        this.ajax();
    }
    verifyCallback (callback) {
        if(typeof callback !== "undefined") {
            this.callback = callback;
        }
        else {
            this.callback = null;
        }
    }
    // send request in server
    ajax() {
        var self = this;
        var data_send = JSON.stringify(self.data);
        dom.ajax({
            url : self.url_send,
            type : self.type,
            data : data_send,
            cache: false,
            contentType: false, // obligatoire pour de l'upload
            processData: false,
            dataType: 'json',
            success : function(data) {
                self.JSON = data;
                self.runCallBack(data);
            },
            error : function(error, xhr) {
                throw Error(xhr);
            }
        });
    }
    getJSON() {
        return this.JSON;
    }
    // run callback
    runCallBack(data) {
        if(typeof this.callback !== "undefined" && this.callback !== null) {
            this.callback.call(this, data);
        }
    }
}
