using FluentNHibernate.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ECO.RCF.DataAccess.Generics;

namespace ECO.RCF.DataAccess.Mapping
{
    public class EntidadMap : ClassMap<Entidad>
    {
        public EntidadMap()
        {
            Table("RCF_ENTIDAD");
            Id(x => x.Id, "C_ID").GeneratedBy.SequenceIdentity("RCF_ENTIDAD_SQ");

            Map(x => x.Nombre, "D_NOMBRE");
            Map(x => x.Apellido, "D_APELLIDO");
            Map(x => x.RazonSocial, "D_RAZON_SOCIAL");
            Map(x => x.Cuit, "N_CUIT");
            Map(x => x.Dni, "N_DOCUMENTO");
            Map(x => x.FechaDesde, "F_VIGENCIA_DESDE");
            Map(x => x.FechaHasta, "F_VIGENCIA_HASTA");
            Map(x => x.FechaAlta, "FH_ALTA");
            Map(x => x.Usuario, "C_USUARIO");
            Map(x => x.FechaActualizacion, "FHU_ACTUALIZ");
            Map(x => x.MarcaOrganismo, "M_ORGANISMO");
            Map(x => x.EsDelEstado, "M_PERTENECE_AL_ESTADO");
            //Map(x => x.IdEntidadPadre, "N_ID_ENTIDAD_PADRE");

            Version(x => x.Version).Column("N_VERSION_HIBERNATE").UnsavedValue("0").Access.Property();


       

        }
    }

    public class Entidad : BaseEntity
    {
        public virtual string Nombre { get; set; }
        public virtual string Apellido { get; set; }
        public virtual string RazonSocial { get; set; }
        public virtual long? Cuit { get; set; }
        public virtual long? Dni { get; set; }
        public virtual DateTime? FechaDesde { get; set; }
        public virtual DateTime? FechaHasta { get; set; }
        public virtual DateTime FechaAlta { get; set; }
        public virtual string Usuario { get; set; }
        public virtual DateTime? FechaActualizacion { get; set; }
        //public virtual long? IdTipoEntidad { get; set; }
        public virtual long? IdTipoDocumento { get; set; }
        public virtual long? MarcaOrganismo { get; set; }
        public virtual long? IdEntidadPadre { get; set; }
        public virtual long? EsDelEstado { get; set; }




    }
}
