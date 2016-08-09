// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'Util.servicios', 'Util.file', 'ngCordova', 'Util.Query', 'Util.storage'])

.run(function($ionicPlatform, $cordovaSQLite,storage,createNode) {
  $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    if (window.cordova) {
      db = $cordovaSQLite.openDB({ name: "control.db" , location: 2}); //device
      $cordovaSQLite.execute(db,"CREATE TABLE IF NOT EXISTS configuracion (id integer primary key AUTOINCREMENT, clave text, valor text)");
      $cordovaSQLite.execute(db,"CREATE TABLE IF NOT EXISTS registro (id integer primary key AUTOINCREMENT, posicion text, archivo TEXT, fecha TEXT, hora TEXT, email TEXT, unidad TEXT )");
      //$cordovaSQLite.execute(db,"DELETE FROM registro;VACUUM;");

    }else{
      db = window.openDatabase("control.db", '1', 'my', 1024 * 1024 * 100); // browser
    }
    storage.verificar_def_rutas();
    ruta_de_literaturas = storage.ruta();
    ruta_de_servicios = storage.url();

    //Verificacion de encuesta disponible

  });
})


.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.creacionEncuesta', {
    url: '/creacion-encuestas',
    views: {
      'menuContent': {
        controller: 'creacionEncuestaCtrl'
      }
    }
  })

  .state('app.encuesta', {
    url: '/encuestas',
    views: {
      'menuContent': {
        templateUrl: 'templates/encuesta.html',
        controller: 'encuestaCtrl'
      }
    }
  })



  .state('app.fileBrowser', {
    url: '/fileBrowser',
    views: {
      'menuContent': {
        templateUrl: 'templates/fileBrowser.html',
        controller: 'fileBrowserCtrl'
      }
    }
  })

  .state('app.configuracion', {
    url: '/configuracion',
    views: {
      'menuContent': {
        templateUrl: 'templates/configuracion.html',
        controller: 'configuracionCtrl'
      }
    }
  })

  .state('app.registros', {
    url: '/registros',
    views: {
      'menuContent': {
        templateUrl: 'templates/Registros.html',
        controller: 'registrosCtrl'
      }
    }
  })

  .state('app.file', {
    url: '/file/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/file.html',
        controller: 'fileCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/fileBrowser');
})



