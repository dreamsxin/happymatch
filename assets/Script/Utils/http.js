
const authorization = null;

var http = {    
    httpGet: function (url , success , error , object) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if(xhr.status >= 200 && xhr.status < 300){
                    var respone = xhr.responseText;
                    if(success){
                        success(respone , object);
                    }
                }else{
                    if(error){
                        error(object);
                    }
                }
            }
        };
        let token = "" ;
        if(authorization != null){
            token = authorization ;
        }
        if(url.indexOf("?") > 0){
            xhr.open("GET", url+"&authorization="+token , true);
        }else{
            xhr.open("GET", url+"?authorization="+token, true);
        }

        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
        }
        //超时回调
        xhr.ontimeout = function(event){
            error(object);
        };
        xhr.onerror = function(event){
            error(object);
        };

        // note: In Internet Explorer, the timeout property may be set only after calling the open()
        // method and before calling the send() method.
        xhr.timeout = 3000;// 5 seconds for timeout

        xhr.send();
    },
    encodeFormData : function(data)  
    {  
        var pairs = [];  
        var regexp = /%20/g;  
        
        for (var name in data){  
            var value = data[name].toString();  
            var pair = encodeURIComponent(name).replace(regexp, "+") + "=" +  
                encodeURIComponent(value).replace(regexp, "+");  
            pairs.push(pair);  
        } 
        let dada = pairs.join("&");
        return dada;
    },
    httpPost: function (url, params, success , error , object) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if(xhr.status >= 200 && xhr.status < 300){
                    var respone = JSON.parse(xhr.responseText);
                    if(success){
                        success(respone , object);
                    }
                }else{
                    if(error){
                        error(object);
                    }
                }
            }
        };
        xhr.open("POST", url, true);
        if(authorization != null){
            xhr.setRequestHeader("authorization", authorization) ;
        }
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
        }
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");

        //超时回调
        xhr.ontimeout = function(event){
            error(object);
        };
        xhr.onerror = function(event){
            error(object);
        };

        // note: In Internet Explorer, the timeout property may be set only after calling the open()
        // method and before calling the send() method.
        xhr.timeout = 5000;// 5 seconds for timeout
        
        xhr.send(this.encodeFormData(params));
    },
    download: function (url, params, cb) {
        var xhr = new XMLHttpRequest();
        xhr.timeout = 5000;
        var requestURL = url;
        if(params){
            requestURL = requestURL + "?" + params;
        }
 
        xhr.responseType = "arraybuffer";
        xhr.open("GET", requestURL, true);
        if(cc.sys.isNative){
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate", "text/html;charset=UTF-8");
        }
 
        xhr.onreadystatechange = function () {
            if(xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 300)){
                var buffer = xhr.response;
                var data = new Uint8Array(buffer);
                cb(null, data);
            }
        }
 
        xhr.send();
        return xhr;
    }
    // http.download("http://127.0.0.1:6080", "/download", "name=upload", function (err, data) {
    //     var path = jsb.fileUtils.getWritablePath() + "/download.png";
    //     jsb.fileUtils.writeDataToFile(data, path);
    // });


}
     
module.exports = http;