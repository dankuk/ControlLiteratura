angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
})


//Controlador para configuraciones de entorno de la aplicacion
  .controller('configuracionCtrl', function($scope, $cordovaSQLite,$ionicPlatform,storage,createNode,$state) {

    $scope.CargaUnidades = function() {
      var form = this;
      var parametros = "?parameters[type]=unidades";
      if(form.url_base != "") {
        var url = form.url_base;
      }else if($scope.url_plataforma != ""){
        var url = $scope.url_plataforma;
      }else {
        var url = "nada";
      }
      if(url != "nada"){
        var unidad = createNode.getUnidades(url,parametros);
        unidad.then(function (response) {
          console.log("unidades: ");
          console.log(response.data);
          $scope.unidades = response.data;
        });
      }
    }

    $scope.CargaUnidades2 = function(url) {
      var parametros = "?parameters[type]=unidades";
      var unidad = createNode.getUnidades(url,parametros);
      unidad.then(function (response) {
        console.log("unidades: ");
        console.log(response.data);
        $scope.unidades = response.data;
      });
    }

    $scope.SeleccionUnidad = function() {
      var form = this;
      var nid_unidad_seleccionada = "nada";
      var unidad_seleccionada = "nada";
      if(form.uni_selected === undefined || form.uni_selected === ''){
        nid_unidad_seleccionada = $scope.nidUni;
        unidad_seleccionada = $scope.unidad;
      }else{
        var unidad_split = form.uni_selected.split("-");
        nid_unidad_seleccionada = unidad_split[0];
        unidad_seleccionada = unidad_split[1];
      }
      if(nid_unidad_seleccionada != "nada" && unidad_seleccionada != "nada"){
        var txt_aux = nid_unidad_seleccionada+"-"+unidad_seleccionada;
        console.log('Unidad Seleccionada: ' + txt_aux);
        var unidad = txt_aux.split("-");
        $scope.nidUni = unidad[0];
        $scope.unidad = unidad[1];
        console.warn("Unidad split");
        console.warn(unidad);
        if(unidad[0] != "") {
          console.log("Nid de unidad: " + unidad[0]);
          var supervisor = createNode.getSupervisores(form.url_base, unidad[0]);
          supervisor.then(function (response) {
            console.log("Supervisor: ");
            console.log(response.data.field_uni_supervisor);
            $scope.supervisor = response.data.field_uni_supervisor.und;
          });
        }
      }
    }


    $ionicPlatform.ready(function() {
      var estado_configuracion = storage.verificar_def_rutas();
      $scope.path_literaturas = storage.ruta();
      $scope.url_plataforma = storage.url();
      if($scope.url_plataforma!=""){
        $scope.CargaUnidades2($scope.url_plataforma);
      }
      $scope.url_base = storage.url();
      $scope.nidUni = storage.nidUnidad();
      $scope.unidad = storage.unidad();
      $scope.email = storage.email();
      $scope.super_uni = storage.super();
    })


    $scope.SupervisorSeleccionado = function() {
      var form = this;
      console.log("supervisor seleccionado en change: " + form.super_selected)
      $scope.super_uni = form.super_selected;
    }

    var goFilebrowser = function () {
      navigator.vibrate(500);
      $state.go("app.fileBrowser");
    }


    $scope.saveConfig = function() {
      var form = this;
      if(form.path_literaturas === undefined || form.path_literaturas === ''){
        form.path_literaturas = $scope.path_literaturas;
      }else{console.log('Ruta a guardar: ' + form.path_literaturas);}

      if(form.url_base === undefined || form.url_base === ''){
        form.url_base = $scope.url_base;
      }else{console.log('url a guardar: ' + form.url_base);}

      if($scope.nidUni === undefined || $scope.unidad === ''){
        var unidad = form.uni_selected.split("-");
        console.warn("Unidad split no definida: "+ unidad);
      }else{
        console.log('Unidad Seleccionada: ' + $scope.nidUni + "-" + $scope.unidad);
        var aux = $scope.nidUni + "-" + $scope.unidad;
        var unidad = aux.split("-");
        console.warn("Unidad split: " + unidad);
      }

      if(form.email === undefined || form.email === ''){
        form.email = $scope.email;
      }else{console.log('email a guardar: ' + form.email);}

      console.log('Supervisor a guardar (form): ' + form.super_selected);
      console.log('Supervisor a guardar (scope): ' + $scope.super_uni);
      if(form.super_selected === undefined || form.super_selected === '') {
        var supervisor = $scope.super_uni;
        console.log('if - Supervisor a guardar: ' + $scope.super_uni);
      }else{
        var supervisor = form.super_selected;
        console.log('else - Supervisor a guardar: ' + form.super_selected);
      }

      storage.saveRutasConf(form.path_literaturas,form.url_base,unidad[1],form.email,form.usuario,form.password,unidad[0],supervisor);
      navigator.notification.alert(
        'Configuración guardada!',  // message
        goFilebrowser,         // callback
        'Listo!!!',            // title
        'Aceptar'                  // buttonName
      );
    }

  })

//Ccntrolador para gestor de archivos
  .controller('fileBrowserCtrl', function($scope, $cordovaSQLite, Query, $fileFactory, $ionicPlatform,$cordovaFile,storage,createNode,$state) {
    console.log("Ingreso a fileBrowserCtrl");
    navigator.geolocation.getCurrentPosition(function(position){
      $scope.geo = position.coords.latitude + "," + position.coords.longitude;
    });

    // Obtenemos el día de hoy
    var GetToday = function() {
      var now = new Date();
      var year = now.getFullYear();
      var month = ( now.getMonth() + 1 ); if ( month.length === 1 ) { month = '0' + month; }
      var day = now.getDate(); if ( day.length === 1 ) { day = '0' + day; }
      return year + '-' + month + '-' + day;
    };

    // Obtenemos el día de hoy
    var GetHora = function() {
      var now = new Date();
      var hora = now.getHours();
      var minutos = now.getMinutes();
      var segundos = now.getSeconds();
      return hora + ':' + minutos + ":" + segundos;
    };

    var actualizarRegistroLiteratura = function () {
      //Comienzo de actualiza nodo
      var fechaUpd = GetToday();
      var horaUpd = GetHora();
      var UltimoRegistro = storage.getUltimoRegistroIngresado('UltimoRegistroInsertado');
      console.log("CONTROLLERS / saveOpenFile / actualizar / Registro a actualizar");
      console.log(UltimoRegistro);
      if ((UltimoRegistro.nid === undefined || UltimoRegistro.nid === '') || (UltimoRegistro.data === undefined || UltimoRegistro.ruta_servicios === '')) {
        console.warn(" CONTROLLERS / saveOpenFile / actualizar / No existe registro anterior insertado");
        var UltRegError = storage.getUltimoRegistroIngresado('UltRegError');
        if ((UltRegError.nid === undefined || UltRegError.nid === '') || (UltRegError.data === undefined || UltRegError.ruta_servicios === '')) {
          console.log(" CONTROLLERS / saveOpenFile / actualizar / No existe registro con error en actualizacion anterior");
        }else{
          console.error(" CONTROLLERS / saveOpenFile / actualizar / Existe registro con error en actualizacion anterior");
          UltimoRegistro = UltRegError;
        }
      }

      if ((UltimoRegistro.nid != undefined && UltimoRegistro.nid != '') && (UltimoRegistro.data != undefined && UltimoRegistro.ruta_servicios != '')) {
        console.warn("CONTROLLERS / saveOpenFile / actualizar / Existe registro anterior insertado, se procede a actualizar");
        var inicio = UltimoRegistro.data.field_fecha.und[0].value.date + " " + UltimoRegistro.data.field_fecha.und[0].value.time;
        var fin = fechaUpd + " " + horaUpd;
        console.log("CONTROLLERS / saveOpenFile / actualizar / inicio : " + inicio);
        console.log("CONTROLLERS / saveOpenFile / actualizar / fin : " + fin);
        var data = {
          "type": "registro_literaturas",
          "field_nombre_literatura": {
            "und": [{
              "value": UltimoRegistro.data.field_nombre_literatura.und.value
            }]
          },
          "field_geolocalizacion": {
            "und": [{
              "value": UltimoRegistro.data.field_geolocalizacion.und.value
            }]
          },
          "field_fecha": {
            "und": [
              {
                "value": {
                  "date": UltimoRegistro.data.field_fecha.und[0].value.date,
                  "time": UltimoRegistro.data.field_fecha.und[0].value.time
                },
                "value2": {
                  "date": UltimoRegistro.data.field_fecha.und[0].value.date,
                  "time": UltimoRegistro.data.field_fecha.und[0].value.time
                }
              }
            ]
          },
          "field_fecha_cierre": {
            "und": [
              {
                "value": {
                  "date": fechaUpd,
                  "time": horaUpd
                },
                "value2": {
                  "date": fechaUpd,
                  "time": horaUpd
                }
              }
            ]
          },
          "field_delta_tiempo": {
            "und": [{
              "value": ""
            }]
          },
          "field_reg_supervisor": {
            "und": [{
              "value": UltimoRegistro.data.field_reg_supervisor.und.value
            }]
          },
          "field_email": {
            "und": [{
              "value": UltimoRegistro.data.field_email.und.value
            }]
          },
          "field_reg_unidad": {
            "und": [{
              "value": UltimoRegistro.data.field_reg_unidad.und.value
            }]
          },
          "language": "und"
        }; //TODO datos
        var nid = UltimoRegistro.nid;
        console.log("CONTROLLERS / saveOpenFile / actualizar / data : ");
        console.log(data);
        if ((storage.email() != "") && (storage.unidad() != "")) {
          var actualizaRegistro = createNode.ActualizaNodo(nid, data);
          actualizaRegistro.then(function () {
            console.log("CONTROLLERS / saveOpenFile / actualizar / Se actualiza Nodo " + nid);
            delete fecha;
            delete hora;
            delete data;
            delete UltimoRegistro;
            storage.deleteLocalStorageForKey("UltimoRegistroInsertado");
            storage.deleteLocalStorageForKey("UltRegError");
          }, function (err) {
            window.localStorage['UltRegError'] = JSON.parse(window.localStorage['UltimoRegistroInsertado'] || '{}');
            storage.deleteLocalStorageForKey("UltimoRegistroInsertado");
            console.error("Error en la actualizacion");
            console.error(err);
          });
        } else {
          console.error("CONTROLLERS / saveOpenFile / actualizar / no estan definido todos los parametros")
        }
      }
      //Fin de actualizar
    }

    //guardo registro de la apertura de archivo
    $scope.saveOpenFile = function(name_file, file_url) {
      navigator.geolocation.getCurrentPosition(function(position){
        $scope.geo = position.coords.latitude + "," + position.coords.longitude;
      });
      var email = storage.email();
      var unidad = storage.unidad();
      var supervisor = storage.super();

      if((email != "")&&(unidad != "")){
        actualizarRegistroLiteratura();
        var fechaIns = GetToday();
        var horaIns = GetHora();
        console.log("CONTROLLERS / saveOpenFile / insertar / Se inicia proceso de insert de dato nuevo");
        var crearRegistro = createNode.CreateNodo(name_file, $scope.geo, fechaIns, horaIns,email,unidad,supervisor);
        crearRegistro.then(function () {
          console.log("CONTROLLERS / saveOpenFile / insertar / Se inserta a Nodo");
        },function(err){
          var query = "INSERT INTO registro (posicion,archivo,fecha,hora,email,unidad) VALUES (?,?,?,?,?,?,?);";
          $cordovaSQLite.execute(db, query, [$scope.geo,name_file,fecha,hora,email,unidad]).then(function(res) {
            console.log("INSERT ID -> " + res.insertId);
            console.log("posicion:  -> " + $scope.geo);
            console.log("name_file:  -> " + name_file);
            console.log("fecha:  -> " + fecha + " " + hora);
            console.log("email:  -> " + email);
            console.log("unidad:  -> " + unidad);
            console.error("CONTROLLERS / saveOpenFile / insertar / no se pudo conectar al servicio, se genera registro local");
            console.error(err);
          }, function (err) {
            console.error(err);
          });
        });
      }else{
        console.error("CONTROLLERS / saveOpenFile / insertar / no estan definido todos los parametros")
      }
      console.log("CONTROLLERS / saveOpenFile / apertura de archivo : "+file_url);
      var ref = cordova.InAppBrowser.open(file_url, "_system", "location=yes");
    };

    var fs = new $fileFactory();

    $ionicPlatform.ready(function() {
      setInterval(function(){ storage.deleteLocalStorageForKey("encuesta") }, 1800000);
      setInterval(function(){ activarEncuesta() }, 1860000);
      navigator.geolocation.getCurrentPosition(function(position){
        $scope.geo = position.coords.latitude + "," + position.coords.longitude;
      });

      $cordovaFile.getFreeDiskSpace()
        .then(function (success) {
          console.log(success);
        }, function (error) {
          console.log(error);
        });
      $cordovaFile.checkDir(cordova.file.documentsDirectory, "")
        .then(function (success) {
          console.log(success);
        }, function (error) {
          console.log(error);
        });
      $scope.versionDevice = device.version;
      console.log("version de Android: " + $scope.versionDevice);
      if($scope.versionDevice == "5.1.1"){
        fs.getEntries("file:///storage/sdcard1/"+ruta_de_literaturas).then(function(result) {
          $scope.files = result;
        }, function(error) {
          console.log("controller.js / ready / getEntries / ruta: "+ ruta_de_literaturas);
          console.error(error);
        });
      }else if($scope.versionDevice == "4.0.4"){
        fs.getEntries("file:///sdcard/"+ruta_de_literaturas).then(function(result) {
          $scope.files = result;
        }, function(error) {
          console.log("controller.js / ready / getEntries / ruta: "+ ruta_de_literaturas);
          console.error(error);
        });
      }else{
        fs.getEntries("file:///").then(function(result) {
          $scope.files = result;
        }, function(error) {
          console.log("controller.js / ready / getEntries / ruta: "+ ruta_de_literaturas);
          console.error(error);
        });
      }




      $scope.getContents = function(path) {
        console.log("ruta de elemento:" + path);
        //obtener geolocalizacion para apertura de archivo
        var fecha =  new Date();
        var path_conf = "file:///storage/sdcard1/"+ruta_de_literaturas+"/";
        console.log("path : "+path);
        console.log("actual : "+path_conf);
        fs.getEntries(path).then(function(result) {
          $scope.files = result; //este muestra la lista
          if(path != path_conf){
            $scope.files.unshift({name: "..."});
          }
          fs.getParentDirectory(path).then(function(result) {
            console.log("seleccion:" + path);
            if(path != path_conf){
              result.name = "...";
              $scope.files[0] = result;
            }
          });
        });
      }
    });


    var activarEncuesta = function (){
      console.log("CONTROLLER / fileBrowserCtrl / se verifica si existe encuesta a responder");
      var _unidad = storage.unidad();
      var _url = storage.url();
      var verificarEncuestaRespondida = storage.verificarEncuestaRespondida();
      console.log("CONTROLLER / fileBrowserCtrl / ON / verificarEncuestaRespondida: " + verificarEncuestaRespondida );
      if(verificarEncuestaRespondida == false) { // no hay respondia encuesta anterior
        console.log("CONTROLLER / fileBrowserCtrl / ON / No existe encuesta");
        if (_url != "nada") {
          var encuesta = createNode.getEncuesta(_url, _unidad);
          encuesta.then(function (response) {
            console.log("CONTROLLER / fileBrowserCtrl / Encuesta: ");
            console.log(response.data);
            if(response.data.length > 0) {
              var nidEncuesta = response.data[0].nid;
              console.log("CONTROLLER / fileBrowserCtrl / NID: " + nidEncuesta);
              if (nidEncuesta > 0) {
                var encuestaPublicada = createNode.getPreguntas(_url, nidEncuesta);
                encuestaPublicada.then(function (response) {
                  console.log("CONTROLLER / fileBrowserCtrl / Preguntas: ");
                  console.log(response.data);
                  $scope.preguntas = response.data;
                  var frecuencia = $scope.preguntas.field_frecuencia.und[0].value;
                  if (frecuencia == 1) {
                    console.log("CONTROLLER / fileBrowserCtrl / SIEMPRE / se redirecciona a la encuesta ");
                    $state.go("app.creacionEncuesta");
                  } else if (frecuencia == 2) {
                    console.log("CONTROLLER / fileBrowserCtrl / Aleatorio  ");
                    var x = Math.floor((Math.random() * 5) + 1);
                    if (x == frecuencia) {
                      console.log("CONTROLLER / fileBrowserCtrl / Aleatorio / se cumple -> redirecciona  ");
                      $state.go("app.creacionEncuesta");
                    }
                  }
                });
              }
            }else{
              console.warn("no hay encuesta disponible");
            }
          });
        }
      }else{
        console.log("CONTROLLER / fileBrowserCtrl / ON / existe encuesta");
      }
    }

    var goConfiguracionApp = function () {
      navigator.vibrate(500);
      $state.go("app.configuracion");
    }

    var revisarConfiguracion = function () {
      console.warn("Se revisa si existe configuración");
      var url = storage.url();
      var unidad = storage.unidad();
      var supervisor = storage.super();
      var email = storage.email();
      if(url == ""){
        url = 1;
      }
      if(unidad == ""){
        unidad = 1;
      }
      if(supervisor == ""){
        supervisor = 1;
      }
      if(email == ""){
        email = 1;
      }

      if((unidad == 1) || (supervisor == 1) || (url == 1) || (email == 1)){
        alert("No esta configurada la aplicación");
        goConfiguracionApp();
      }else{
        return 0;
      }
    }

    $scope.$on( "$ionicView.enter", function( ) {
      var estado = revisarConfiguracion();
      if(estado == 0){
        console.log("Existe configuración por lo que se procede");
        actualizarRegistroLiteratura();
        activarEncuesta();
      }
    });
  })

.controller('registrosCtrl', function($scope, $cordovaSQLite, createNode) {
  console.log("entro a registrosCtrl");
  var query = "SELECT * FROM registro";
  console.log(query);
  $cordovaSQLite.execute(db, query).then(function(res) {
    console.log("Cantidad de elementos: " + res.rows.length)
    if(res.rows.length > 0) {
      $scope.resultado = [];
      for($i=0;$i<res.rows.length;$i++){
         arreglo = [{ 'id' : res.rows.item($i).id,
                              'id' : res.rows.item($i).id,
                              'posicion' : res.rows.item($i).posicion,
                              'archivo' : res.rows.item($i).archivo,
                              'tipo_accion' : res.rows.item($i).tipo_accion,
                              'fecha' : res.rows.item($i).fecha,
                              'hora' : res.rows.item($i).hora,
                              'email' : res.rows.item($i).email,
                              'unidad' : res.rows.item($i).unidad}];

        //creacion de
        var create_node = createNode.CreateNodo(res.rows.item($i).archivo, res.rows.item($i).tipo_accion, res.rows.item($i).posicion, res.rows.item($i).fecha, res.rows.item($i).hora,res.rows.item($i).email,res.rows.item($i).unidad);
        create_node.then(function (response) {
          console.log("Se inserta a Nodo");
          var query2 = "DELETE FROM registro WHERE id="+res.rows.item($i).id;
          $cordovaSQLite.execute(db, query2).then(function(res2) {
            console.log("Se elimina de bdd local");
            console.log(res2);
          }, function (err2) {
            console.error(err2);
          });

        });
        $scope.resultado = $scope.resultado.concat(arreglo);
        }
      console.log(res);
      console.log($scope.resultado);
    } else {
      //return ruta_default;
      $scope.mensaje = "Sin registros";
      console.log("No se encontraron resultados");
    }
  }, function (err) {
    console.error(err);
  });
})



.controller('creacionEncuestaCtrl', function($scope, createNode,storage,$ionicPlatform,$rootScope,$state) {

  $ionicPlatform.ready(function() {
    var _unidad = storage.unidad();
    var _url = storage.url();
    if(_url != "nada"){
      var encuesta = createNode.getEncuesta(_url,_unidad);
      encuesta.then(function (response) {
        console.log("CONTROLLER / encuestaCtrl / Encuesta: ");
        console.log(response.data);
        if(response.data.length > 0) {
          var nidEncuesta = response.data[0].nid;
          console.log("CONTROLLER / encuestaCtrl / NID: " + nidEncuesta);
          if (nidEncuesta > 0) {
            var encuestaPublicada = createNode.getPreguntas(_url, nidEncuesta);
            encuestaPublicada.then(function (response) {
              console.log("CONTROLLER / encuestaCtrl / Preguntas: ");
              console.log(response.data);
              $rootScope.preguntas = response.data;
              $rootScope.nidEncuesta = nidEncuesta;
              if ($scope.preguntas.field_pregunta1.und) {
                $rootScope.pregunta1 = $rootScope.preguntas.field_pregunta1.und[0].value;
                if ($rootScope.preguntas.field_tipo_1.und[0].value == "p") {
                  $rootScope.tipoPreg1 = true;
                } else if ($rootScope.preguntas.field_tipo_1.und[0].value == "a") {
                  if ($rootScope.preguntas.field_respuesta1.und) {
                    $rootScope.tipoAlt1 = true;
                    $rootScope.alternativas1 = $rootScope.preguntas.field_respuesta1.und[0].value.split("|");
                  }
                }
              }

              if ($scope.preguntas.field_pregunta2.und) {
                $rootScope.pregunta2 = $rootScope.preguntas.field_pregunta2.und[0].value;
                if ($rootScope.preguntas.field_tipo_2.und[0].value == "p") {
                  $rootScope.tipoPreg2 = true;
                } else if ($rootScope.preguntas.field_tipo_2.und[0].value == "a") {
                  if ($rootScope.preguntas.field_respuesta2.und) {
                    $rootScope.tipoAlt2 = true;
                    $rootScope.alternativas2 = $rootScope.preguntas.field_respuesta2.und[0].value.split("|");
                  }
                }
              }

              if ($scope.preguntas.field_pregunta3.und) {
                $rootScope.pregunta3 = $rootScope.preguntas.field_pregunta3.und[0].value;
                if ($rootScope.preguntas.field_tipo_3.und[0].value == "p") {
                  $rootScope.tipoPreg3 = true;
                } else if ($rootScope.preguntas.field_tipo_3.und[0].value == "a") {
                  if ($rootScope.preguntas.field_respuesta3.und) {
                    $rootScope.tipoAlt3 = true;
                    $rootScope.alternativas3 = $rootScope.preguntas.field_respuesta3.und[0].value.split("|");
                  }
                }
              }

              if ($scope.preguntas.field_pregunta4.und) {
                $rootScope.pregunta4 = $rootScope.preguntas.field_pregunta4.und[0].value;
                if ($rootScope.preguntas.field_tipo_4.und[0].value == "p") {
                  $rootScope.tipoPreg4 = true;
                } else if ($rootScope.preguntas.field_tipo_4.und[0].value == "a") {
                  if ($rootScope.preguntas.field_respuesta4.und) {
                    $rootScope.tipoAlt4 = true;
                    $rootScope.alternativas4 = $rootScope.preguntas.field_respuesta4.und[0].value.split("|");
                  }
                }
              }

              if ($scope.preguntas.field_pregunta5.und) {
                $rootScope.pregunta5 = $rootScope.preguntas.field_pregunta5.und[0].value;
                if ($rootScope.preguntas.field_tipo_5.und[0].value == "p") {
                  $rootScope.tipoPreg5 = true;
                } else if ($rootScope.preguntas.field_tipo_5.und[0].value == "a") {
                  if ($rootScope.preguntas.field_respuesta5.und) {
                    $rootScope.tipoAlt5 = true;
                    $rootScope.alternativas5 = $rootScope.preguntas.field_respuesta5.und[0].value.split("|");
                  }
                }
              }

              if ($scope.preguntas.field_pregunta6.und) {
                $rootScope.pregunta6 = $rootScope.preguntas.field_pregunta6.und[0].value;
                if ($rootScope.preguntas.field_tipo_6.und[0].value == "p") {
                  $rootScope.tipoPreg6 = true;
                } else if ($rootScope.preguntas.field_tipo_6.und[0].value == "a") {
                  if ($rootScope.preguntas.field_respuesta6.und) {
                    $rootScope.tipoAlt6 = true;
                    $rootScope.alternativas6 = $rootScope.preguntas.field_respuesta6.und[0].value.split("|");
                  }
                }
              }

              if ($scope.preguntas.field_pregunta7.und) {
                $rootScope.pregunta7 = $rootScope.preguntas.field_pregunta7.und[0].value;
                if ($rootScope.preguntas.field_tipo_7.und[0].value == "p") {
                  $rootScope.tipoPreg7 = true;
                } else if ($rootScope.preguntas.field_tipo_7.und[0].value == "a") {
                  if ($rootScope.preguntas.field_respuesta7.und) {
                    $rootScope.tipoAlt7 = true;
                    $rootScope.alternativas7 = $rootScope.preguntas.field_respuesta7.und[0].value.split("|");
                  }
                }
              }

              if ($scope.preguntas.field_pregunta8.und) {
                $rootScope.pregunta8 = $rootScope.preguntas.field_pregunta8.und[0].value;
                if ($rootScope.preguntas.field_tipo_8.und[0].value == "p") {
                  $rootScope.tipoPreg8 = true;
                } else if ($rootScope.preguntas.field_tipo_8.und[0].value == "a") {
                  if ($rootScope.preguntas.field_respuesta8.und) {
                    $rootScope.tipoAlt8 = true;
                    $rootScope.alternativas8 = $rootScope.preguntas.field_respuesta8.und[0].value.split("|");
                  }
                }
              }

              if ($scope.preguntas.field_pregunta9.und) {
                $rootScope.pregunta9 = $rootScope.preguntas.field_pregunta9.und[0].value;
                if ($rootScope.preguntas.field_tipo_9.und[0].value == "p") {
                  $rootScope.tipoPreg9 = true;
                } else if ($rootScope.preguntas.field_tipo_9.und[0].value == "a") {
                  if ($rootScope.preguntas.field_respuesta9.und) {
                    $rootScope.tipoAlt9 = true;
                    $rootScope.alternativas9 = $rootScope.preguntas.field_respuesta9.und[0].value.split("|");
                  }
                }
              }

              if ($scope.preguntas.field_pregunta10.und) {
                $rootScope.pregunta10 = $rootScope.preguntas.field_pregunta10.und[0].value;
                if ($rootScope.preguntas.field_tipo_10.und[0].value == "p") {
                  $rootScope.tipoPreg10 = true;
                } else if ($rootScope.preguntas.field_tipo_10.und[0].value == "a") {
                  if ($rootScope.preguntas.field_respuesta10.und) {
                    $rootScope.tipoAlt10 = true;
                    $rootScope.alternativas10 = $rootScope.preguntas.field_respuesta10.und[0].value.split("|");
                  }
                }
              }
              $state.go("app.encuesta");
            });
          }
        }else{
          $rootScope.sinEncuesta = 1;
          console.warn("No hay encuesta disponible");
        }
      });
    }

  });



})

  .controller('encuestaCtrl', function($scope, createNode,storage,$ionicPlatform,$rootScope,$state,utilService) {

    $scope.pushRespuesta1 = function (){
      var form = this;
      $scope.respuesta1 = form.respuesta1;
      console.log("respuesta1");
      console.log($scope.respuesta1);
    }

    $scope.pushRespuesta2 = function (){
      var form = this;
      $scope.respuesta2 = form.respuesta2;
      console.log("respuesta2");
      console.log($scope.respuesta2);
    }

    $scope.pushRespuesta3 = function (){
      var form = this;
      $scope.respuesta3 = form.respuesta3;
      console.log("respuesta3");
      console.log($scope.respuesta3);
    }
    $scope.pushRespuesta4 = function (){
      var form = this;
      $scope.respuesta4 = form.respuesta4;
      console.log("respuesta4");
      console.log($scope.respuesta4);
    }
    $scope.pushRespuesta5 = function (){
      var form = this;
      $scope.respuesta5 = form.respuesta5;
      console.log("respuesta5");
      console.log($scope.respuesta5);
    }
    $scope.pushRespuesta6 = function (){
      var form = this;
      $scope.respuesta6 = form.respuesta6;
      console.log("respuesta6");
      console.log($scope.respuesta6);
    }
    $scope.pushRespuesta7 = function (){
      var form = this;
      $scope.respuesta7 = form.respuesta7;
      console.log("respuesta7");
      console.log($scope.respuesta7);
    }
    $scope.pushRespuesta8 = function (){
      var form = this;
      $scope.respuesta8 = form.respuesta8;
      console.log("respuesta8");
      console.log($scope.respuesta8);
    }
    $scope.pushRespuesta9 = function (){
      var form = this;
      $scope.respuesta9 = form.respuesta9;
      console.log("respuesta9");
      console.log($scope.respuesta9);
    }
    $scope.pushRespuesta10 = function (){
      var form = this;
      $scope.respuesta10 = form.respuesta10;
      console.log("respuesta10");
      console.log($scope.respuesta10);
    }



    $scope.createEncuesta = function() {

      console.log("formulario:");
      console.log("pregunta 1:");
      console.log($rootScope.pregunta1);
      console.log("Respuesta 1:");
      console.log($scope.respuesta1);
      console.log("pregunta 2:");
      console.log($rootScope.pregunta2);
      console.log("Respuesta 2:");
      console.log($scope.respuesta2);
      console.log("pregunta 3:");
      console.log($rootScope.pregunta3);
      console.log("Respuesta 3:");
      console.log($scope.respuesta3);
      console.log("pregunta 4:");
      console.log($rootScope.pregunta41);
      console.log("Respuesta 4:");
      console.log($scope.respuesta4);
      console.log("pregunta 5:");
      console.log($rootScope.pregunta5);
      console.log("Respuesta 5:");
      console.log($scope.respuesta5);
      console.log("pregunta 6:");
      console.log($rootScope.pregunta6);
      console.log("Respuesta 6:");
      console.log($scope.respuesta6);
      console.log("pregunta 7:");
      console.log($rootScope.pregunta7);
      console.log("Respuesta 7:");
      console.log($scope.respuesta7);
      console.log("pregunta 8:");
      console.log($rootScope.pregunta8);
      console.log("Respuesta 8:");
      console.log($scope.respuesta8);
      console.log("pregunta 9:");
      console.log($rootScope.pregunta9);
      console.log("Respuesta 9:");
      console.log($scope.respuesta9);
      console.log("pregunta 10:");
      console.log($rootScope.pregunta10);
      console.log("Respuesta 10:");
      console.log($scope.respuesta10);

      var data = {
        "type": "resultado_de_encuestas",
        "field_res_encuesta_linea": {
          "und": [{
            "value": storage.unidad()
          }]
        },
        "field_id_encuesta": {
          "und": [{
            "value": $rootScope.nidEncuesta
          }]
        },
        "field_enc_supervisor": {
          "und": [{
            "value": storage.super()
          }]
        },
        "field_enc_unidad": {
          "und": [{
            "value": storage.unidad()
          }]
        },
        "field_enc_email": {
          "und": [{
            "value": storage.email()
          }]
        },
        "field_pregunta1": {
          "und": [
            {
              "value": $rootScope.pregunta1,
            }
          ]
        },
        "field_respuesta1": {
          "und": [
            {
              "value": $scope.respuesta1,
            }
          ]
        },
        "field_pregunta2": {
          "und": [
            {
              "value": $rootScope.pregunta2,
            }
          ]
        },
        "field_respuesta2": {
          "und": [
            {
              "value": $scope.respuesta2,
            }
          ]
        },
        "field_pregunta3": {
          "und": [
            {
              "value": $rootScope.pregunta3,
            }
          ]
        },
        "field_respuesta3": {
          "und": [
            {
              "value": $scope.respuesta3,
            }
          ]
        },
        "field_pregunta4": {
          "und": [
            {
              "value": $rootScope.pregunta4,
            }
          ]
        },
        "field_respuesta4": {
          "und": [
            {
              "value": $scope.respuesta4,
            }
          ]
        },
        "field_pregunta5": {
          "und": [
            {
              "value": $rootScope.pregunta5,
            }
          ]
        },
        "field_respuesta5": {
          "und": [
            {
              "value": $scope.respuesta5,
            }
          ]
        },
        "field_pregunta6": {
          "und": [
            {
              "value": $rootScope.pregunta6,
            }
          ]
        },
        "field_respuesta6": {
          "und": [
            {
              "value": $scope.respuesta6,
            }
          ]
        },
        "field_pregunta7": {
          "und": [
            {
              "value": $rootScope.pregunta7,
            }
          ]
        },
        "field_respuesta7": {
          "und": [
            {
              "value": $scope.respuesta7,
            }
          ]
        },
        "field_pregunta8": {
          "und": [
            {
              "value": $rootScope.pregunta8,
            }
          ]
        },
        "field_respuesta8": {
          "und": [
            {
              "value": $scope.respuesta8,
            }
          ]
        },
        "field_pregunta9": {
          "und": [
            {
              "value": $rootScope.pregunta9,
            }
          ]
        },
        "field_respuesta9": {
          "und": [
            {
              "value": $scope.respuesta9,
            }
          ]
        },
        "field_pregunta10": {
          "und": [
            {
              "value": $rootScope.pregunta10,
            }
          ]
        },
        "field_respuesta10": {
          "und": [
            {
              "value": $scope.respuesta10,
            }
          ]
        },

        "language": "und"
      }; //TODO datos
      console.log("Encuesta data:");
      console.log(data);
      createNode.saveEncuesta(data);
      delete data;
      //alert("Se ha enviado la encuesta.","Estado","Ok")
      navigator.vibrate(1000);
      navigator.notification.alert(
        'Se ha enviado la encuesta.',  // message
        storage.setEncuestaRespondida(),         // callback
        'Estado',            // title
        'Ok'                  // buttonName
      );
      //storage.setEncuestaRespondida();
      console.log("Seteado local storage encuesta a TRUE");
      console.log(storage.verificarEncuestaRespondida());
      $state.go("app.fileBrowser")
    };

    $ionicPlatform.ready(function(){
      $scope.respuesta1 = "";
      $scope.respuesta2 = "";
      $scope.respuesta3 = "";
      $scope.respuesta4 = "";
      $scope.respuesta5 = "";
      $scope.respuesta6 = "";
      $scope.respuesta7 = "";
      $scope.respuesta8 = "";
      $scope.respuesta9 = "";
      $scope.respuesta10 = "";
    })

    var back = function(){
      $state.go("app.fileBrowser");
    }

    $scope.$on( "$ionicView.enter", function( ) {
      if($rootScope.sinEncuesta == 1){
        navigator.notification.alert(
          'No existen encuestas disponibles',  // message
          back(),         // callback
          'Aviso',            // title
          'Ok'                  // buttonName
        );
      }
    });


  })


