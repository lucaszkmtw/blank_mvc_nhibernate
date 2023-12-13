using System;

public class EntidadDTO
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
    public virtual long? IdTipoDocumento { get; set; }
    public virtual long? MarcaOrganismo { get; set; }
    public virtual long? IdEntidadPadre { get; set; }
    public virtual long? EsDelEstado { get; set; }




}