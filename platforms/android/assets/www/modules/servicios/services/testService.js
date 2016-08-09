angular.module('Util.servicios')

  .factory('test', [
    '$http',
    '$q',
    'utilService',
    'BASE_URL',
    'httpRequestHandlerService',
    function($http, $q, utilService, BASE_URL, httpRequestHandlerService) {
      'use strict';

      var _lista = function() {
        var defer = $q.defer();
        var _url = BASE_URL + '/posts';
        var _data = {
          header:{
            errorCode: 0,
            mensaje: 'OK'
          },
          body: {
            msg: 'foo'
          }
        }; //TODO datos

        var result = httpRequestHandlerService.httpRequestHandler(_url, _data);

        result.then(function (resolution) {
          var header = [];
          var item = {};
          var response = [];
          if (resolution.status === 200 || resolution.status === 201) {
            header = utilService.header(resolution.data.header.errorCode, resolution.data.header.mensaje);
            if (header.errorCode === 0) {
              item.msg = resolution.data.body.msg;
            }
          }
          else {
            header = utilService.header(9000, 'En estos momentos no podemos atender tu solicitud. Inténtalo más tarde.');
          }
          // Respuesta
          response = utilService.response(header, item);
          defer.resolve(response);
        }, function () {
          defer.reject();
        });

        return defer.promise;
      };

      return {
        lista: _lista
      };
    }]);
