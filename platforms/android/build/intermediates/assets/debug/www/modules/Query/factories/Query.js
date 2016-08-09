angular.module('Util.Query', [])
  .factory('Query', function($cordovaSQLite) {
    var self = this;

    self.getRuta = function() {
      script = "SELECT DISTINCT valor FROM configuracion WHERE clave = 'ruta_literatura'";
      $cordovaSQLite.execute(db, script).then(function (res) {
        console.log("Cantidad de elementos: " + res.rows.length)
        if(res.rows.length > 0) {
          console.log("SELECTED -> ruta_literatura: " + res.rows.item(0).valor);
          return res.rows.item(0).valor;
        } else {
          console.log("No se encontraron resultados");
          return ruta_default;
        }
      }, function (err) {
        console.error(err);
        return ruta_default;
      });
    }

    self.get = function(memberId) {
      var parameters = [memberId];
      return DBA.query("SELECT id, name FROM team WHERE id = (?)", parameters)
        .then(function(result) {
          return DBA.getById(result);
        });
    }

    self.add = function(member) {
      var parameters = [member.id, member.name];
      return DBA.query("INSERT INTO team (id, name) VALUES (?,?)", parameters);
    }

    self.remove = function(member) {
      var parameters = [member.id];
      return DBA.query("DELETE FROM team WHERE id = (?)", parameters);
    }

    self.update = function(origMember, editMember) {
      var parameters = [editMember.id, editMember.name, origMember.id];
      return DBA.query("UPDATE team SET id = (?), name = (?) WHERE id = (?)", parameters);
    }

    return self;
  })
