angular.module('Util.storage')

  .factory('storage', function() {
    var _verificar_def_rutas = function() {
      var rutas_conf = JSON.parse(window.localStorage['rutas_conf'] || '{}');
      if((rutas_conf.path_literaturas === undefined || rutas_conf.path_literaturas === '')
            ||
              (rutas_conf.ruta_servicios === undefined || rutas_conf.ruta_servicios === '')
              ||
                (rutas_conf.unidad === undefined || rutas_conf.unidad === '')
                ||
                  (rutas_conf.email === undefined || rutas_conf.email === '')){
        var currentObject = {
                              'path_literaturas': "LITERATURAS_ESTRATEGICAS",
                              'ruta_servicios': "",
                              'unidad': "",
                              'supervisor': "",
                              'nidUnidad': "",
                              'usuario': "",
                              'password': "",
                              'email': ""
                            };
        window.localStorage['rutas_default'] = JSON.stringify(currentObject);
        console.warn("STORAGE / _verificar_def_rutas / no estan definidos los valores por el configurador");
        return false;
      }else{
        console.log("STORAGE / _verificar_def_rutas / Esta definido por configuración");
        return true;
      }

   };

    var _ruta = function() {
      var rutas_conf = JSON.parse(window.localStorage['rutas_conf'] || '{}');
      if(rutas_conf.path_literaturas === undefined || rutas_conf.path_literaturas === ''){
        var rutas_conf = JSON.parse(window.localStorage['rutas_default'] || '{}');
        console.warn("STORAGE / _ruta / no estan definidos la ruta por el configurador");
        console.warn(rutas_conf.path_literaturas);
        return rutas_conf.path_literaturas;
      }else{
        console.log("STORAGE / _ruta / la ruta de las literaturas esta definido: " + rutas_conf.path_literaturas);
        return rutas_conf.path_literaturas;
      }
    };

    var _url = function() {
      var rutas_conf = JSON.parse(window.localStorage['rutas_conf'] || '{}');
      if(rutas_conf.ruta_servicios === undefined || rutas_conf.ruta_servicios === ''){
        var rutas_conf = JSON.parse(window.localStorage['rutas_default'] || '{}');
        console.warn("STORAGE / _url / no esta definido la url del servicio por el configurador");
        console.warn(rutas_conf.ruta_servicios);
        return rutas_conf.ruta_servicios;
      }else{
        console.log("STORAGE / _url / la URL de servicios esta definido: " + rutas_conf.ruta_servicios);
        return rutas_conf.ruta_servicios;
      }
    };

    var _unidad = function() {
      var rutas_conf = JSON.parse(window.localStorage['rutas_conf'] || '{}');
      if(rutas_conf.unidad === undefined || rutas_conf.unidad === ''){
        var rutas_conf = JSON.parse(window.localStorage['rutas_default'] || '{}');
        console.warn("STORAGE / _unidad / no esta definido la unidad por configurador");
        console.warn(rutas_conf.unidad);
        return rutas_conf.unidad;
      }else{
        console.log("STORAGE / _unidad / la unidad esta definido: " + rutas_conf.unidad);
        return rutas_conf.unidad;
      }
    };

    var _email = function() {
      var rutas_conf = JSON.parse(window.localStorage['rutas_conf'] || '{}');
      if(rutas_conf.email === undefined || rutas_conf.email === ''){
        var rutas_conf = JSON.parse(window.localStorage['rutas_default'] || '{}');
        console.warn("STORAGE / _mail / no esta definido el mail por el configurador");
        console.warn(rutas_conf.email);
        return rutas_conf.email;
      }else{
        console.log("STORAGE / _mail / El mail esta definido: " + rutas_conf.email);
        return rutas_conf.email;
      }
    };

    var _pass = function() {
      var rutas_conf = JSON.parse(window.localStorage['rutas_conf'] || '{}');
      if(rutas_conf.password === undefined || rutas_conf.password === ''){
        var rutas_conf = JSON.parse(window.localStorage['rutas_default'] || '{}');
        console.warn("STORAGE / _pass / no esta definido el password por el configurador");
        console.warn(rutas_conf.password);
        return rutas_conf.password;
      }else{
        console.log("STORAGE / _pass / El password esta definido: " + rutas_conf.password);
        return rutas_conf.password;
      }
    };

    var _super = function() {
      var rutas_conf = JSON.parse(window.localStorage['rutas_conf'] || '{}');
      if(rutas_conf.supervisor === undefined || rutas_conf.supervisor === ''){
        var rutas_conf = JSON.parse(window.localStorage['rutas_default'] || '{}');
        console.warn("STORAGE / _super / no esta definido el supervisor por el configurador");
        console.warn(rutas_conf.supervisor);
        return rutas_conf.supervisor;
      }else{
        console.log("STORAGE / _super / El supervisor esta definido: " + rutas_conf.supervisor);
        return rutas_conf.supervisor;
      }
    };

    var _user = function() {
      var rutas_conf = JSON.parse(window.localStorage['rutas_conf'] || '{}');
      if(rutas_conf.usuario === undefined || rutas_conf.usuario === ''){
        var rutas_conf = JSON.parse(window.localStorage['rutas_default'] || '{}');
        console.warn("STORAGE / _user / no esta definido el usuario por el configurador");
        console.warn(rutas_conf.usuario);
        return rutas_conf.usuario;
      }else{
        console.log("STORAGE / _user / El usuario esta definido: " + rutas_conf.usuario);
        return rutas_conf.usuario;
      }
    };

    var _nidUnidad = function() {
      var rutas_conf = JSON.parse(window.localStorage['rutas_conf'] || '{}');
      if(rutas_conf.nidUnidad === undefined || rutas_conf.nidUnidad === ''){
        var rutas_conf = JSON.parse(window.localStorage['rutas_default'] || '{}');
        console.warn("STORAGE / _nidUnidad / no esta definido el nidUnidad por el configurador");
        console.warn(rutas_conf.nidUnidad);
        return rutas_conf.nidUnidad;
      }else{
        console.log("STORAGE / _nidUnidad / El nidUnidad esta definido: " + rutas_conf.nidUnidad);
        return rutas_conf.nidUnidad;
      }
    };



      var _saveRutasConf = function(rutas,url,unidad,email,user,pass,nid_unidad,supervisor) {
        var currentObject = {
          'path_literaturas': rutas,
          'ruta_servicios': url,
          'unidad': unidad,
          'supervisor': supervisor,
          'nidUnidad': nid_unidad,
          'usuario': user,
          'password': pass,
          'email': email
        };
        window.localStorage['rutas_conf'] = JSON.stringify(currentObject);
        console.log("STORAGE / _saveRutasConf / Se realizo la configuración [Guardada!]");
        console.log(currentObject);
      };

    var _setEncuestaRespondida = function() {
      var currentObject = {
        'estado': true,
      };
      window.localStorage['encuesta'] = JSON.stringify(currentObject);
      console.log("STORAGE / _encuestaRespondida / Se realiza cambio de estado a encuesta respondida");
      console.log(currentObject);
    };

    var _verificarEncuestaRespondida = function() {
      var encuesta = JSON.parse(window.localStorage['encuesta'] || '{}');
        console.log("storage / _verificarEncuestaRespondida / encuesta esta definida ");
        if(encuesta.estado == true) {
          console.log("storage / _verificarEncuestaRespondida / estado = true ");
          return true;
        }else{
          console.log("storage / _verificarEncuestaRespondida / estado = false ");
          return false;
        }
    };

    var _getUltimoRegistroIngresado = function(key) {
      var ultimoRegistro = JSON.parse(window.localStorage[key] || '{}');
      console.warn("parse de " + key);
      console.warn(ultimoRegistro);
      return ultimoRegistro;
    };

    var _deleteEncuestaRespondida = function() {
      window.localStorage.removeItem("encuesta");
      console.warn("estado de encuesta eliminada");
    };

    var _deleteLocalStorageForKey = function(key) {
      window.localStorage.removeItem(key);
      console.warn("storage eliminada: " + key);
    };

    return {
      verificar_def_rutas : _verificar_def_rutas,
      ruta : _ruta,
      saveRutasConf : _saveRutasConf,
      url : _url,
      unidad : _unidad,
      nidUnidad : _nidUnidad,
      user : _user,
      super : _super,
      pass : _pass,
      setEncuestaRespondida : _setEncuestaRespondida,
      verificarEncuestaRespondida : _verificarEncuestaRespondida,
      deleteEncuestaRespondida : _deleteEncuestaRespondida,
      getUltimoRegistroIngresado : _getUltimoRegistroIngresado,
      deleteLocalStorageForKey : _deleteLocalStorageForKey,
      email : _email
    };
  });
