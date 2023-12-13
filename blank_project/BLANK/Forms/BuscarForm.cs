using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TGP.BlankProject.Forms
{
    public class BuscarForm
    {
        public DateTime fechaCreacion { get; set; }

        public string[] idsLote { get; set; }

        public string[] idsOficina { get; set; }

        public DateTime fechaInicio { get; set; }

        public DateTime fechaFin { get; set; }
    }
}