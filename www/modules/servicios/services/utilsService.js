angular.module('Util.servicios')

  .factory('utilService', [
    '$rootScope',
    '$ionicPopup',
    function($rootScope, $ionicPopup) {
      'use strict';

      function _deepExtend(dst) {
        angular.forEach(arguments, function(obj) {
          if (obj !== dst) {
            angular.forEach(obj, function(value, key) {
              if (dst[key] && dst[key].constructor && dst[key].constructor === Object) {
                _deepExtend(dst[key], value);
              }
              else {
                dst[key] = value;
              }
            });
          }
        });
        return dst;
      }

      var popupShown = false;
      function _communicationErrorPopup() {
        if( !popupShown ) {
          popupShown = !!$ionicPopup.alert({
              template: 'En este momento no podemos atender su solicitud. Por favor intente más tarde.',
              okText: 'Volver',
              okType: 'button-clear button-dark'
            })
            .finally( function() {
              popupShown = false;
            });
        }
      }

      //PopUp Alerta
      function _alertPopup(_template, _okText, _okType) {
        if (!popupShown) {
          popupShown = !!$ionicPopup.alert({
              template: _template,
              okText: _okText,
              okType: _okType
            })
            .finally( function() {
              popupShown = false;
            });
        }
      }

      //PopUp Confirmacion
      function _confirmPopup(_title, _template, _scope, _okText, _okType, _cancelText, _cancelType) {
        var popup =	$ionicPopup.confirm({
          title: _title,
          template: _template,
          scope: _scope,
          cancelText: _cancelText,
          cancelType: _cancelType,
          okText: _okText,
          okType: _okType
        });
        return popup;
      }

      //Header respuesta del servicio
      function _header (_errorCode, _mensaje) {
        var header = {
          errorCode: _errorCode,
          message: _mensaje
        };
        return header;
      }

      //Respuesta del servicio
      function _responseLogin (_header, _sessid,_session_name, _token) {
        var response = {
          header: _header,
          sessid: _sessid,
          session_name: _session_name,
          token: _token
        };
        return response;
      }

      //Respuesta del servicio
      function _responseServicesUnidades (_data) {
        var response = {
          data: _data
        };
        return response;
      }

      //Limpiamos los acentos
      function _limpiarAcentos(str) {
        str = str.replace('á', 'a');
        str = str.replace('é', 'e');
        str = str.replace('í', 'i');
        str = str.replace('ó', 'o');
        str = str.replace('ú', 'u');
        str = str.replace('Á', 'A');
        str = str.replace('É', 'E');
        str = str.replace('Í', 'I');
        str = str.replace('Ó', 'O');
        str = str.replace('Ú', 'U');
        str = str.replace('ñ', 'n');
        str = str.replace('Ñ', 'N');
        return str;
      }

      // Obtenemos el día de hoy
      function _getToday () {
        var now = new Date();
        var year = '' + now.getFullYear();
        var month = '' + ( now.getMonth() + 1 ); if ( month.length === 1 ) { month = '0' + month; }
        var day = '' + now.getDate(); if ( day.length === 1 ) { day = '0' + day; }
        return day + '-' + month + '-' + year;
      }

      // Formateamos el numero
      function _addCommas (n) {
        var rx = /(\d+)(\d{3})/;
        return String(n).replace(/^\d+/, function(w) {
          while (rx.test(w)) {
            w = w.replace(rx, '$1.$2');
          }
          return w;
        });
      }

      // Formateamos el numero
      function _removeCommas (val) {
        if(typeof val !== 'undefined') {
          return val.toString().replace(/\./g, '');
        }
      }

      // Transformar Milisegundos a fecha
      function _millisecondsTo_dd_mm_yyyy (milliseconds) {
        var now = new Date(milliseconds);
        var year = '' + now.getFullYear();
        var month = '' + (now.getMonth() + 1); if (month.length === 1) { month = '0' + month; }
        var day = '' + now.getDate(); if (day.length === 1) { day = '0' + day; }
        return day + '/' + month + '/' + year;
      }

      // Formatear Fecha
      function _formatearFecha_dd_mm_yyyy (inputFormat) {
        var d = inputFormat.substring(0, 2);
        var m = inputFormat.substring(3, 5);
        var y = inputFormat.substring(6, 10);
        var month;
        switch(m) {
          case '01': month = 'enero';
            break;
          case '02': month = 'febrero';
            break;
          case '03': month = 'marzo';
            break;
          case '04': month = 'abril';
            break;
          case '05': month = 'mayo';
            break;
          case '06': month = 'junio';
            break;
          case '07': month = 'julio';
            break;
          case '08': month = 'agosto';
            break;
          case '09': month = 'septiembre';
            break;
          case '10': month = 'octubre';
            break;
          case '11': month = 'noviembre';
            break;
          case '12': month = 'diciembre';
            break;
        }
        return d + ' de ' + month + ' de ' + y;
      }

      //Transformar de yyyy-mm-dd a dd-mm-yyyy
      function _formatear_yyyy_mm_dd_a_dd_mm_yyyy (inputFormat) {
        var y = inputFormat.substring(0, 4);
        var m = inputFormat.substring(5, 7);
        var d = inputFormat.substring(8, 10);
        return d + '-' + m + '-' + y;
      }

      //Diferecia en Dias
      function _dateDiffInDays (d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();
        //Se utiliza Math para aproximar debido a que
        //si la diferencia es de menos de 24 hrs
        //no considera que quede un día de diferencia
        return Math.ceil((t2 - t1) / (24 * 3600 * 1000));
      }

      //Diferencia en Semanas
      function _dateDiffInWeeks (d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();
        //Se utiliza esta aporximacion para respetar diferencias exactas
        //de semanas
        return parseInt(Math.ceil((t2 - t1) / (24 * 3600 * 1000)) /  7);
      }

      //Diferencia en Meses
      function _dateDiffInMonths (d1, d2) {
        var d1Y = d1.getFullYear();
        var d2Y = d2.getFullYear();
        var d1M = d1.getMonth();
        var d2M = d2.getMonth();
        return (d2M + (12 * d2Y)) - (d1M + (12 * d1Y));
      }

      //Diferencia en años
      function _dateDiffInYears (d1, d2) {
        return d2.getFullYear() - d1.getFullYear();
      }

      //Transformar Milisegundos a fecha
      function _formatearFecha_yyyy_mm_dd (_fecha) {
        var d = new Date(_fecha);
        var mes = d.getMonth();
        mes = mes +1;
        if(mes < 10){
          mes = '0'+mes;
        }
        var dia = d.getDate();
        if(dia < 10){
          dia = '0'+dia;
        }
        var fecha = d.getFullYear() + '-' + mes + '-' + dia;
        return fecha;
      }

      function _decripta(llaveUno, clave) {
        var paso = _decriptaFinal(clave);
        var fraseAnumero = _obtieneNumero(llaveUno);
        var numero = paso/fraseAnumero;
        return numero;
      }

      function _decriptaFinal(clave) {
        var ret = '';
        for (var i = 0; i < clave.length; i++) {
          ret += _destraduccion(clave[i]);
        }
        return ret;
      }

      function _obtieneNumero(frase) {
        var ret = 0;
        for (var i = 0; i<frase.length; i++) {
          ret += frase.charCodeAt(i);
        }
        return ret;
      }

      function _destraduccion(c){
        switch(c) {
          case 'S' : return '0';
          case 'a' : return '1';
          case 'g' : return '2';
          case 'u' : return '3';
          case 'O' : return '4';
          case 'q' : return '5';
          case 'v' : return '6';
          case '3' : return '7';
          case '9' : return '8';
          case '0' : return '9';
          default:break;
        }
        return c;
      }

      //Primera letra mayuscula
      function _capitalize(s) {
        if(typeof s !== 'undefined') {
          s = s.toLowerCase();
          return s[0].toUpperCase() + s.slice(1);
        }
      }

      //Palabra de una frase
      function _getFirstWord(text) {
        var res = text.split(' ');
        return res[0];
      }

      // Obtenemos la hora de hoy
      var _getHora = function() {
        var now = new Date();
        var hora = now.getHours();
        return hora;
      };

      // Obtenemos lo minutos de la hora de hoy
      var _getMinutos = function() {
        var now = new Date();
        var minutos = now.getMinutes();
        return minutos;
      };



      return {
        getHora : _getHora,
        getMinutos : _getMinutos,
        deepExtend : _deepExtend,
        communicationErrorPopup: _communicationErrorPopup,
        alertPopup: _alertPopup,
        confirmPopup: _confirmPopup,
        header: _header,
        responseLogin: _responseLogin,
        cleanString: _limpiarAcentos,
        getToday: _getToday,
        addCommas: _addCommas,
        removeCommas: _removeCommas,
        millisecondsTo_dd_mm_yyyy: _millisecondsTo_dd_mm_yyyy,
        formatearFecha_dd_mm_yyyy: _formatearFecha_dd_mm_yyyy,
        formatearFecha_yyyy_mm_dd: _formatearFecha_yyyy_mm_dd,
        dateDiffInDays: _dateDiffInDays,
        dateDiffInWeeks: _dateDiffInWeeks,
        dateDiffInMonths: _dateDiffInMonths,
        dateDiffInYears: _dateDiffInYears,
        decripta: _decripta,
        formatear_yyyy_mm_dd_a_dd_mm_yyyy: _formatear_yyyy_mm_dd_a_dd_mm_yyyy,
        capitalize: _capitalize,
        responseServicesUnidades: _responseServicesUnidades,
        getFirstWord: _getFirstWord
      };

    }]);
