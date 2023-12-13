using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECO.RCF.DataAccess.Domain.Entities
{
    /// <summary>
    /// Clase que modela la respuesta del proceso de confirmar una liquidacion
    /// </summary>
    public class StoreProcedureDTO
    {
        public string NombreStoreProcedure { get; set; }
        public List<ParametroStoreProcedure> Parametros { get; set; }

    }
}
