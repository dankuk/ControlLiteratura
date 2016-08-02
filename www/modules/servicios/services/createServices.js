angular.module('Util.servicios')

  .factory('createNode', [
    '$http',
    '$q',
    'utilService',
    'BASE_URL',
    'httpRequestHandlerService',function($http, $q, utilService, BASE_URL, httpRequestHandlerService ) {
      'use strict';

      var getBaseUrl = function () {
        var rutas_conf = JSON.parse(window.localStorage['rutas_conf'] || '{}');
        if(rutas_conf.ruta_servicios === undefined || rutas_conf.ruta_servicios === ''){
          var rutas_conf = JSON.parse(window.localStorage['rutas_default'] || '{}');
          console.warn("no esta definido la url del servicio por el configurador");
          console.warn(rutas_conf.ruta_servicios);
          return rutas_conf.ruta_servicios;
        }else{
          console.log("la URL de servicios esta definido: " + rutas_conf.ruta_servicios);
          return rutas_conf.ruta_servicios;
        }
      }


      var _login = function() {
        var defer = $q.defer();
        var BASE_URL1 = getBaseUrl();
        var _url = BASE_URL1 + '/api/v1/user/login';
        var usuario = _usuario();
        var pass = _pass();
        var _data = {
          'username': usuario,
          'password': pass
        }; //TODO datos
        console.log("se hace llamado a httpRequestHandler");
        var result = httpRequestHandlerService.httpRequestHandlerLogin(_url, _data);
        console.log("Resultado: ");
        console.log(result);
        result.then(function (resolution) {
          var header = [];
          var item = {};
          var response = [];
          if (resolution.status === 200 || resolution.status === 201) {
            console.log("resolution status: " + resolution.status);
            console.log(resolution);
            console.log(resolution.sessid);
            console.log(resolution.session_name);
            console.log(resolution.token);
            item.sessid = resolution.sessid;
            item.session_name = resolution.session_name;
            item.token = resolution.token;
          }
          else {
            console.log("resolution.status no es 200 ni 201");
            header = utilService.header(9000, 'En estos momentos no podemos atender tu solicitud. Inténtalo más tarde.');
          }
          // Respuesta
          console.log("Respuesta");
          response = utilService.responseLogin(header, item.sessid, item.session_name, item.token);
          defer.resolve(response);
        }, function () {
          defer.reject();
        });

        return defer.promise;
      };

      var _ActualizaNodo = function(nid,data) {
        var defer = $q.defer();
        var BASE_URL1 = getBaseUrl();
        var _url = BASE_URL1 + '/api/v1/node/'+nid;
        /*var _header = _login();
        var cookie = _header.session_name+"="+_header.sessid;
        var token = _header.token;*/
        var cookie = "";
        var token = "";
        console.log("se hace llamado a httpRequestHandlerSaveRegistro ACtualizacion");
        var result = httpRequestHandlerService.httpRequestHandlerUpdateRegistro("put", _url, data,cookie,token);
        console.log("Resultado: ");
        console.log(result);
        result.then(function (resolution) {
          var header = [];
          var response = [];
          if (resolution.status === 200 || resolution.status === 201) {
            console.log("resolution status: " + resolution.status);
          }else {
            console.log("resolution.status no es 200 ni 201");
            header = utilService.header(9000, 'En estos momentos no podemos atender tu solicitud. Inténtalo más tarde.');
          }
          // Respuesta
          defer.resolve(response);
        }, function () {
          defer.reject();
        });
        return defer.promise;
      };


      var _CreateNodo = function(archivo, geo, fecha, hora,email,unidad,supervisor) {
        var defer = $q.defer();
        var BASE_URL1 = getBaseUrl();
        var _url = BASE_URL1 + '/api/v1/node';
        /*var _header =_login();
        var cookie = _header.session_name+"="+_header.sessid;
        var token = _header.token;*/
        var cookie = "";
        var token = "";
        var _data = {
          "type": "registro_literaturas",
          "field_nombre_literatura": {
            "und": [{
              "value": archivo
            }]
          },
          "field_geolocalizacion": {
            "und": [{
              "value": geo
            }]
          },
          "field_fecha": {
            "und":[
              {
                "value":{
                  "date":fecha,
                  "time":hora
                },
                "value2":{
                  "date":fecha,
                  "time":hora
                }
              }
            ]
          },
          "field_fecha_cierre": {
            "und":[
              {
                "value":{
                  "date":"",
                  "time":""
                },
                "value2":{
                  "date":"",
                  "time":""
                }
              }
            ]
          },
          "field_delta_tiempo": {
            "und": [{
              "value": ""
            }]
          },
          "field_email": {
            "und": [{
              "value": email
            }]
          },
          "field_reg_supervisor": {
            "und": [{
              "value": supervisor
            }]
          },
          "field_reg_unidad": {
            "und": [{
              "value": unidad
            }]
          },
          "language" : "und"
        }; //TODO datos
        console.log("createServices / _CreateNodo / se hace llamado a httpRequestHandlerSaveRegistro");
        var result = httpRequestHandlerService.httpRequestHandlerSaveRegistro("post",_url, _data,cookie,token);
        console.log("createServices / _CreateNodo / Resultado: ");
        console.log(result);
        result.then(function (resolution) {
          var header = [];
          var response = [];
          if (resolution.status === 200 || resolution.status === 201) {
            console.log("createServices / _CreateNodo / resolution status: " + resolution.status);
          }else {
            console.log("createServices / _CreateNodo / resolution status no es 200 ni 201");
            header = utilService.header(9000, 'En estos momentos no podemos atender tu solicitud. Inténtalo más tarde.');
          }

          // Respuesta
          defer.resolve(response);
        }, function () {
          defer.reject();
        });
        return defer.promise;
      };





      var _getUnidades = function(Url_base, parametros) {
        var defer = $q.defer();
        if(Url_base == ""){
          var BASE_URL1 = getBaseUrl();
          var _url = BASE_URL1 + '/api/v1/node'+parametros;
        }else{
          var _url = Url_base + '/api/v1/node'+parametros;
        }
        console.log("entra a CargaUnidades: " + Url_base);
        console.log("parametros: " + parametros);
        var _data = {};
        console.log("se hace llamado a httpRequestHandlerParameter");
        console.log("_url:");
        console.log(_url);
        var result = httpRequestHandlerService.httpRequestHandlerParameter(_url);
        console.log("Resultado: ");
        console.log(result);
        result.then(function (resolution) {
          var header = [];
          var item = {};
          var response = [];
          if (resolution.status === 200 || resolution.status === 201) {
            item.data = resolution.data;
            console.log("resolution status: " + resolution.status);
          }
          else {
            console.log("resolution.status no es 1");
            console.log(resolution.status);
            header = utilService.header(9000, 'En estos momentos no podemos atender tu solicitud. Inténtalo más tarde.');
          }
          // Respuesta
          console.log("Respuesta: defer.resolve(response)");
          item.sessid = resolution.sessid;
          response = utilService.responseServicesUnidades(item.data);
          defer.resolve(response);
        }, function () {
          defer.reject();
        });

        return defer.promise;
      };

      var _getSupervisores = function(ruta, nid) {
        var defer = $q.defer();
        if(ruta == ""){
          var BASE_URL1 = getBaseUrl();
          var _url = BASE_URL1 + '/api/v1/node/'+nid;
        }else{

          var _url = ruta + '/api/v1/node/'+nid;
        }
        console.log("entra a _getSupervisores: " + ruta);
        console.log("nid: " + nid);
        var _data = {};
        console.log("se hace llamado a httpRequestHandlerParameter");
        console.log("_url:");
        console.log(_url);
        var result = httpRequestHandlerService.httpRequestHandlerParameter(_url);
        console.log("Resultado: ");
        console.log(result);
        result.then(function (resolution) {
          var header = [];
          var item = {};
          var response = [];
          if (resolution.status === 200 || resolution.status === 201) {
            item.data = resolution.data;
            console.log("resolution status: " + resolution.status);
          }
          else {
            console.log("resolution.status no es 1");
            console.log(resolution.status);
            header = utilService.header(9000, 'En estos momentos no podemos atender tu solicitud. Inténtalo más tarde.');
          }
          // Respuesta
          console.log("Respuesta: defer.resolve(response)");
          item.sessid = resolution.sessid;
          response = utilService.responseServicesUnidades(item.data);
          defer.resolve(response);
        }, function () {
          defer.reject();
        });

        return defer.promise;
      };

      var _usuario = function() {
        var rutas_conf = JSON.parse(window.localStorage['rutas_conf'] || '{}');
        if(rutas_conf.usuario === undefined || rutas_conf.usuario === ''){
          var rutas_conf = JSON.parse(window.localStorage['rutas_default'] || '{}');
          console.warn("no esta definido el usuario por el configurador");
          console.warn(rutas_conf.usuario);
          return rutas_conf.usuario;
        }else{
          console.log("El usuario esta definido: " + rutas_conf.usuario);
          return rutas_conf.usuario;
        }
      };

      var _pass = function() {
        var rutas_conf = JSON.parse(window.localStorage['rutas_conf'] || '{}');
        if(rutas_conf.password === undefined || rutas_conf.password === ''){
          var rutas_conf = JSON.parse(window.localStorage['rutas_default'] || '{}');
          console.warn("no esta definido el password por el configurador");
          console.warn(rutas_conf.password);
          return rutas_conf.password;
        }else{
          console.log("El password esta definido: " + rutas_conf.password);
          return rutas_conf.password;
        }
      };

      var _checkLogin = function() {
        var login = JSON.parse(window.localStorage['Checklogin'] || '{}');
        if((login.sessid === undefined || login.sessid === '') &&
            (login.sessid === undefined || login.sessid === '') &&
              (login.sessid === undefined || login.sessid === '')) {
                return 0;
        }else{
          console.log("No se ha logeado en el sistema");
          return login;
        }
      };

      var _saveLogin = function(sessid,session_name,token) {
          var currentObject = {
            'sessid': sessid,
            'session_name': session_name,
            'token': token
          };
          window.localStorage['Checklogin'] = JSON.stringify(currentObject);
          console.log("Se realizo el inicio de session [Guardada!]");
      };

      var _getEncuesta = function(ruta,unidad) {
        var defer = $q.defer();
        if(ruta == ""){
          var BASE_URL1 = getBaseUrl();
          var _url = BASE_URL1 + '/api/v1/node?parameters[type]=encuestas&parameters[title]='+unidad;
        }else{
          var _url = ruta + '/api/v1/node?parameters[type]=encuestas&parameters[title]='+unidad;
        }
        console.log("createServices / _getEncuesta / se hace llamado a httpRequestHandlerParameter");
        console.log("_url:");
        console.log(_url);
        var result = httpRequestHandlerService.httpRequestHandlerParameter(_url);
        console.log("Resultado: ");
        console.log(result);
        result.then(function (resolution) {
          var header = [];
          var item = {};
          var response = [];
          if (resolution.status === 200 || resolution.status === 201) {
            item.data = resolution.data;
            console.log("resolution status: " + resolution.status);
          }
          else {
            console.log("resolution.status no es 1");
            console.log(resolution.status);
            header = utilService.header(9000, 'En estos momentos no podemos atender tu solicitud. Inténtalo más tarde.');
          }
          // Respuesta
          console.log("Respuesta: defer.resolve(response)");
          item.sessid = resolution.sessid;
          response = utilService.responseServicesUnidades(item.data);
          defer.resolve(response);
        }, function () {
          defer.reject();
        });
        return defer.promise;
      };

      var _getPreguntas = function(ruta,nid) {
        var defer = $q.defer();
        if(ruta == ""){
          var BASE_URL1 = getBaseUrl();
          var _url = BASE_URL1 + '/api/v1/node/'+nid;
        }else{
          var _url = ruta + '/api/v1/node/'+nid;
        }
        console.log("createServices / _getPreguntas / se hace llamado a httpRequestHandlerParameter");
        console.log("_url:");
        console.log(_url);
        var result = httpRequestHandlerService.httpRequestHandlerParameter(_url);
        console.log("Resultado: ");
        console.log(result);
        result.then(function (resolution) {
          var header = [];
          var item = {};
          var response = [];
          if (resolution.status === 200 || resolution.status === 201) {
            item.data = resolution.data;
            console.log("resolution status: " + resolution.status);
          }
          else {
            console.log("resolution.status no es 1");
            console.log(resolution.status);
            header = utilService.header(9000, 'En estos momentos no podemos atender tu solicitud. Inténtalo más tarde.');
          }
          // Respuesta
          console.log("Respuesta: defer.resolve(response)");
          item.sessid = resolution.sessid;
          response = utilService.responseServicesUnidades(item.data);
          defer.resolve(response);
        }, function () {
          defer.reject();
        });
        return defer.promise;
      };

      var _saveEncuesta = function(_data) {
        var defer = $q.defer();
        var BASE_URL1 = getBaseUrl();
        var _url = BASE_URL1 + '/api/v1/node';
        /*var _header =_login();
         var cookie = _header.session_name+"="+_header.sessid;
         var token = _header.token;*/
        var cookie = "";
        var token = "";
        console.log("createServices / _CreateNodo / se hace llamado a httpRequestHandlerSaveEncuesta");
        var result = httpRequestHandlerService.httpRequestHandlerSaveEncuesta("post",_url, _data,cookie,token);
        console.log("createServices / _CreateNodo / Resultado: ");
        console.log(result);
        result.then(function (resolution) {
          var header = [];
          var response = [];
          if (resolution.status === 200 || resolution.status === 201) {
            console.log("createServices / _CreateNodo / resolution status: " + resolution.status);
          }else {
            console.log("createServices / _CreateNodo / resolution status no es 200 ni 201");
            header = utilService.header(9000, 'En estos momentos no podemos atender tu solicitud. Inténtalo más tarde.');
          }

          // Respuesta
          defer.resolve(response);
        }, function () {
          defer.reject();
        });
        return defer.promise;
      };


      var _verificarEncuestaActiva = function() {
        var defer = $q.defer();
        var BASE_URL1 = getBaseUrl();
        var _url = BASE_URL1 + '/api/v1/node';
        /*var _header =_login();
         var cookie = _header.session_name+"="+_header.sessid;
         var token = _header.token;*/
        var cookie = "";
        var token = "";
        console.log("createServices / _CreateNodo / se hace llamado a httpRequestHandlerSaveRegistro");
        var result = httpRequestHandlerService.httpRequestHandlerSaveRegistro("post",_url, _data,cookie,token);
        console.log("createServices / _CreateNodo / Resultado: ");
        console.log(result);
        result.then(function (resolution) {
          var header = [];
          var response = [];
          if (resolution.status === 200 || resolution.status === 201) {
            console.log("createServices / _CreateNodo / resolution status: " + resolution.status);
          }else {
            console.log("createServices / _CreateNodo / resolution status no es 200 ni 201");
            header = utilService.header(9000, 'En estos momentos no podemos atender tu solicitud. Inténtalo más tarde.');
          }

          // Respuesta
          defer.resolve(response);
        }, function () {
          defer.reject();
        });
        return defer.promise;
      }

      return {
        login: _login,
        checkLogin: _checkLogin,
        saveLogin: _saveLogin,
        CreateNodo: _CreateNodo,
        ActualizaNodo: _ActualizaNodo,
        getSupervisores: _getSupervisores,
        getUnidades: _getUnidades,
        getEncuesta: _getEncuesta,
        saveEncuesta: _saveEncuesta,
        verificarEncuestaActiva: _verificarEncuestaActiva,
        getPreguntas: _getPreguntas
      };
    }]);
