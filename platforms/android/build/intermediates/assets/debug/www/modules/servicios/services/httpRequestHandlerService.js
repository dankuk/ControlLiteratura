angular.module('Util.servicios')

  .factory('httpRequestHandlerService', [
    '$http',
    '$q',

    function( $http, $q ) {
      'use strict';

      //TimeOut en segundos
      var tOut = 15;//TODO desa
      var tOutStrong = 30;

      //Para llamar un httpRequestHandlerLogin
      var _httpRequestHandlerLogin = function( _url, _data ) {
        var timeout = $q.defer();
        var result = $q.defer();
        var timedOut = false;
        var httpRequest;

        //Timeout en milisegundos
        setTimeout(function () {
          timedOut = true;
          timeout.resolve();
        }, ( 1000 * tOut ) );

        //Request
        httpRequest = $http( {
          method : 'post',
          url: _url,
          data: _data,
          //cache: false,
          timeout: timeout.promise
        });

        //Exito
        httpRequest.success( function( data, status) {
          var resolution =  {
            status: status,
            sessid: data['sessid'],
            session_name: data['session_name'],
            token: data['token'],
          };
          console.log("httpRequestLogin exitoso:");
          console.log(status);
          console.log(resolution);
          result.resolve( resolution );
        });

        //Error
        httpRequest.error( function( data, status) {
          if ( timedOut ) {
            result.reject({
              errorCode: 'timeout',
              message: 'En este momento no podemos atender tu solicitud. Revisa tu conexión a internet.'
            });
            console.log("Tiempo expirado");
          }
          else {
            var resolution = { status: status, data: data };
            console.log("httpRequestLogin fallido: " + data + "Estado: " + status);
            result.reject( resolution );
          }
        });

        return result.promise;
      };

      //Para llamar un httpRequestHandler
      var _httpRequestHandler = function( _url, _data ) {
        var timeout = $q.defer();
        var result = $q.defer();
        var timedOut = false;
        var httpRequest;

        //Timeout en milisegundos
        setTimeout(function () {
          timedOut = true;
          timeout.resolve();
        }, ( 1000 * tOut ) );

        //Request
        httpRequest = $http( {
          method : 'post',
          url: _url,
          data: _data,
          cache: false,
          timeout: timeout.promise
        });

        //Exito
        httpRequest.success( function( data, status) {
          var resolution =  {
            status: status,
            sessid: data['sessid'],
            session_name: data['session_name'],
            token: data['token'],
          };
          console.log("httpRequest exitoso:");
          console.log(status);
          console.log(resolution);
          result.resolve( resolution );
        });

        //Error
        httpRequest.error( function( data, status) {
          console.log("Request fallido: " + data + "Estado: " + status);
          if ( timedOut ) {
            result.reject({
              errorCode: 'timeout',
              message: 'En este momento no podemos atender tu solicitud. Revisa tu conexión a internet.'
            });
            console.log("Tiempo expirado");
          }
          else {
            var resolution = { status: status, data: data };
            console.log("Request fallido: " + data + "Estado: " + status);
            result.reject( resolution );
          }
        });

        return result.promise;
      };

      //Para llamar un httpRequestHandler con login
      var _httpRequestHandlerSaveRegistro = function(_action, _url, _data, _cookie,_token ) {
        var timeout = $q.defer();
        var result = $q.defer();
        var timedOut = false;
        var httpRequest;

        //Timeout en milisegundos
        setTimeout(function () {
          timedOut = true;
          timeout.resolve();
        }, ( 1000 * tOut ) );

        //Request

        httpRequest = $http( {
          method : _action,
          url: _url,
          data: _data,
          cache: false,
          timeout: timeout.promise,
          //headers: {'Cookie' : _cookie,
          //   'X-CSRF-Token' : _token}
        });



        //Exito
        httpRequest.success( function( data, status) {
          var resolution =  {
            status: status,
            data: data,
          };
          console.log("httpRequestHandlerServices / _httpRequestHandlerSaveRegistro / httpRequest exitoso:");
          console.log(status);
          console.log(resolution);
          var nid = resolution.data.nid;
          var UltimoRegistro = {
            nid: nid,
            data: _data
          };
          window.localStorage['UltimoRegistroInsertado'] = JSON.stringify(UltimoRegistro);
          result.resolve( resolution );
        });

        //Error
        httpRequest.error( function( data, status) {
          var resolution =  {
            status: status,
            data: data,
          };
          var nid = resolution.data.nid;
          var UltimoRegistro = {
            nid: nid,
            data: _data
          };
          window.localStorage['UltRegError'] = JSON.stringify(UltimoRegistro);
          result.resolve( resolution );
          console.log("httpRequestHandlerServices / _httpRequestHandlerSaveRegistro / Request fallido: " + data + "Estado: " + status);
          if ( timedOut ) {
            result.reject({
              errorCode: 'timeout',
              message: 'httpRequestHandlerServices / _httpRequestHandlerSaveRegistro / En este momento no podemos atender tu solicitud. Revisa tu conexión a internet.'
            });
            console.log("Tiempo expirado");
          }
          else {
            var resolution = { status: status, data: data };
            console.log("httpRequestHandlerServices / _httpRequestHandlerSaveRegistro / Request fallido: " + data + "Estado: " + status);
            result.reject( resolution );
          }
        });

        return result.promise;
      };

      //Para llamar un httpRequestHandler con login
      var _httpRequestHandlerSaveEncuesta = function(_action, _url, _data, _cookie,_token ) {
        var timeout = $q.defer();
        var result = $q.defer();
        var timedOut = false;
        var httpRequest;

        //Timeout en milisegundos
        setTimeout(function () {
          timedOut = true;
          timeout.resolve();
        }, ( 1000 * tOut ) );

        //Request

        httpRequest = $http( {
          method : _action,
          url: _url,
          data: _data,
          cache: false,
          timeout: timeout.promise,
          //headers: {'Cookie' : _cookie,
          //   'X-CSRF-Token' : _token}
        });



        //Exito
        httpRequest.success( function( data, status) {
          var resolution =  {
            status: status,
            data: data,
          };
          console.log("httpRequestHandlerServices / _httpRequestHandlerSaveRegistro / httpRequest exitoso:");
          console.log(status);
          console.log(resolution);
          var nid = resolution.data.nid;
          result.resolve( resolution );
        });

        //Error
        httpRequest.error( function( data, status) {
          var resolution =  {
            status: status,
            data: data,
          };
          var nid = resolution.data.nid;
          var UltimoRegistro = {
            nid: nid,
            data: _data
          };
          result.resolve( resolution );
          console.log("httpRequestHandlerServices / _httpRequestHandlerSaveRegistro / Request fallido: " + data + "Estado: " + status);
          if ( timedOut ) {
            result.reject({
              errorCode: 'timeout',
              message: 'httpRequestHandlerServices / _httpRequestHandlerSaveRegistro / En este momento no podemos atender tu solicitud. Revisa tu conexión a internet.'
            });
            console.log("Tiempo expirado");
          }
          else {
            var resolution = { status: status, data: data };
            console.log("httpRequestHandlerServices / _httpRequestHandlerSaveRegistro / Request fallido: " + data + "Estado: " + status);
            result.reject( resolution );
          }
        });

        return result.promise;
      };

      //Para llamar un httpRequestHandler con login
      var _httpRequestHandlerUpdateRegistro = function(_action, _url, _data, _cookie,_token ) {
        var timeout = $q.defer();
        var result = $q.defer();
        var timedOut = false;
        var httpRequest;

        //Timeout en milisegundos
        setTimeout(function () {
          timedOut = true;
          timeout.resolve();
        }, ( 1000 * tOut ) );
        //Request
        httpRequest = $http( {
          method : _action,
          url: _url,
          data: _data,
          cache: false,
          timeout: timeout.promise,
        });
        //Exito
        httpRequest.success( function( data, status) {
          var resolution =  {
            status: status,
            data: data,
          };
          console.log("httpRequestHandlerServices / _httpRequestHandlerUpdateRegistro / httpRequest exitoso:");
          console.log(status);
          console.log(resolution);
          //window.localStorage.removeItem('UltimoRegistroInsertado');
          //window.localStorage.removeItem('UltRegError');
          console.log("httpRequestHandlerServices / _httpRequestHandlerUpdateRegistro / Se elimina elemento local por actualizacion");
          result.resolve( resolution );
        });

        //Error
        httpRequest.error( function( data, status) {
          /*var resolution =  {
            status: status,
            data: data,
          };
          var nid = resolution.data.nid;
          var UltimoRegistro = {
            nid: nid,
            data: _data
          };
          window.localStorage['UltRegError'] = JSON.stringify(UltimoRegistro);*/
          console.log("httpRequestHandlerServices / _httpRequestHandlerSaveRegistro / Request fallido: " + data + "Estado: " + status);
          if ( timedOut ) {
            result.reject({
              errorCode: 'timeout',
              message: 'httpRequestHandlerServices / _httpRequestHandlerSaveRegistro / En este momento no podemos atender tu solicitud. Revisa tu conexión a internet.'
            });
            console.log("Tiempo expirado");
          }
          else {
            var resolution = { status: status, data: data };
            console.log("httpRequestHandlerServices / _httpRequestHandlerSaveRegistro / Request fallido: " + data + "Estado: " + status);
            result.reject( resolution );
          }
        });

        return result.promise;
      };


      // solicitud al _httpRequestHandler con parametro
      var _httpRequestHandlerParameter = function( _url ) {
        var timeout = $q.defer();
        var result = $q.defer();
        var timedOut = false;
        var _data = {};
        var httpRequest;


        //Timeout en milisegundos
        setTimeout(function () {
          timedOut = true;
          timeout.resolve();
        }, ( 1000 * tOut ) );

        //Request
        httpRequest = $http( {
          method : 'get',
          url: _url,
          data: _data,
          cache: false,
          timeout: timeout.promise
        });

        //Exito
        httpRequest.success( function( data, status) {
          var resolution =  {
                              data: data,
                              status: status
          };
          console.log("httpRequestHandlerParameter exitoso:");
          console.log(data);
          console.log(resolution);
          result.resolve( resolution );
        });

        //Error
        httpRequest.error( function( data, status) {
          console.log("Request httpRequestHandlerParameter fallido: " + data + "Estado: " + status);
          if ( timedOut ) {
            result.reject({
              errorCode: 'timeout',
              message: 'En este momento no podemos atender tu solicitud. Revisa tu conexión a internet.'
            });
            console.log("Tiempo expirado");
          }
          else {
            var resolution = { status: status, data: data };
            console.log("Request fallido: " + data + "Estado: " + status);
            result.reject( resolution );
          }
        });

        return result.promise;
      };


      var _httpRequestHandlerStrong = function( _url, _data ) {
        var timeout = $q.defer();
        var result = $q.defer();
        var timedOut = false;
        var httpRequest;

        //Timeout en milisegundos
        setTimeout(function () {
          timedOut = true;
          timeout.resolve();
        }, ( 1000 * tOutStrong ) );

        //Request
        httpRequest = $http( {
          method : 'post',
          url: _url,
          data: _data,
          cache: false,
          timeout: timeout.promise
        });

        //Exito
        httpRequest.success( function( data, status) {
          var resolution = { status: status, data: data };
          result.resolve( resolution );
        });

        //Error
        httpRequest.error( function( data, status) {
          if ( timedOut ) {
            result.reject({
              errorCode: 'timeout',
              message: 'En este momento no podemos atender tu solicitud. Inténtalo más tarde.'
            });
          }
          else {
            var resolution = { status: status, data: data };
            result.reject( resolution );
          }
        });

        return result.promise;
      };


      return {
        httpRequestHandler: _httpRequestHandler,
        httpRequestHandlerLogin: _httpRequestHandlerLogin,
        httpRequestHandlerStrong: _httpRequestHandlerStrong,
        httpRequestHandlerSaveRegistro: _httpRequestHandlerSaveRegistro,
        httpRequestHandlerUpdateRegistro: _httpRequestHandlerUpdateRegistro,
        httpRequestHandlerSaveEncuesta: _httpRequestHandlerSaveEncuesta,
        httpRequestHandlerParameter: _httpRequestHandlerParameter
      };
    }]);
