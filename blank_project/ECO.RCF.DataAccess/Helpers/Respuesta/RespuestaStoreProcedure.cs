using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECO.RCF.DataAccess.Domain.Entities.Respuesta
{
    /// <summary>
    /// Clase que modela la respuesta del proceso de confirmar una liquidacion
    /// </summary>
    public class RespuestaStoreProcedure
    {

        public string Clave { get; set; }
        public string Valor { get; set; }
    }
}
