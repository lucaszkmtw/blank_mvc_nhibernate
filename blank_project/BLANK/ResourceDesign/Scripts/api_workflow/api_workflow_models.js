
  class Actividad {
    constructor(_descripcion, _url,_fechaAlta, _usuario, _fechaActualizacion, _mPaseGdeba, _dDestinoGdeba,_idWorkflow, _mActivo) {
        this.descripcion = _descripcion;
        this.url = _url;
        this.fechaAlta = _fechaAlta;
        this.usuario = _usuario;
        this.fechaActualizacion = _fechaActualizacion;
        this.mPaseGdeba = _mPaseGdeba;
        this.dDestinoGdeba = _dDestinoGdeba;
        this.idWorkflow = _idWorkflow;
        this.mActivo = _mActivo;
    }
  }
  
  class UsuarioActividad {
    constructor( _id,
        _idActividad,
        _idUsuario,
        _marcaVer,
        _marcaHacer,
        _marcaAsignar,
        _fechaAlta,
        _usuario,
        _fechaActualizacion) {
        {
            this.id = _id
            this.idActividad= _idActividad
            this.idUsuario= _idUsuario
            this.marcaVer= _marcaVer
            this.marcaHacer= _marcaHacer
            this.marcaAsignar= _marcaAsignar
            this.fechaAlta= _fechaAlta
            this.usuario= _usuario
            this.fechaActualizacion= _fechaActualizacion
          
          }
    }
  }
  





  // EJEMPLO CREACION DE UN OBJECTO 

//   const actividadNueva = new Actividad();
//   actividadNueva.descripcion = "nadas";
//   actividadNueva.url = "cositas ricas";
//   actividadNueva.fechaAlta = new Date().toISOString();
//   actividadNueva.usuario = "nada";
//   actividadNueva.fechaActualizacion = new Date().toISOString();
//   actividadNueva.mActivo = true;
//   actividadNueva.idWorkflow = 1;