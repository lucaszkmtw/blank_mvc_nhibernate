using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECO.RCF.DataAccess.Domain.Entities
{

    public enum TipoDatoParametro
    {
        DateTime = 1,
        Int32 = 2,
        Int64 = 3,
        Varchar2 = 4,
        Date = 5,
        Decimal = 6
    };

    /// <summary>
    /// Clase que modela la respuesta del proceso de confirmar una liquidacion
    /// </summary>
    public class ParametroStoreProcedure
    {
        public ParametroStoreProcedure()
        {
            EsConTamaño = false;
            Tamaño = 0;
        }

        public string Nombre { get; set; }
        public TipoDatoParametro TipoDato { get; set; }
        public bool EsParametroEntrada { get; set; }
        public string Valor { get; set; }
        public bool EsConTamaño { get; set; }
        public int Tamaño { get; set; }
    }
}
