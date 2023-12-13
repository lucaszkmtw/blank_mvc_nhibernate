using System;
using System.Globalization;

namespace ECO.RCF.BussinessLogic.Helpers
{
    /// <summary>
    /// Clase de soporte que se utiliza para este caso exponer el metodo de Utils.DateUtilsService
    /// para obtener la fecha y hora de la base.
    /// </summary>
    public class HelperService
    {

        #region // Variables //

        /// <summary>
        /// Encapsulamiento interno del repositorio.
        /// </summary>
        private static DataAccess.Helpers.HelperService service = DataAccess.Helpers.HelperService.Instance;
        /// <summary>
        /// Instancia privada de la clase
        /// </summary>
        private static HelperService instance;
        //private Utils.DateUtilsService dateUtils;


        public static HelperService Instance
        {
            get
            {
                if (instance == null)
                {
                    instance = new HelperService();
                }
                return instance;
            }
        }



        #endregion

        #region // Constructores //
        /// <summary>
        /// Constructor por defecto
        /// </summary>
        HelperService() { }
        #endregion


        #region // Metodos DateUtils  //

        public static DateTime GetDateToday()
        {
            return service.GetDateToday();
        }

        public static String GetShortDateTodayStr()
        {
            return service.GetShortDate(GetDateToday());
        }

        public static DateTime GetDateTodayEndDay()
        {
            return service.GetDateTodayEndDay();
        }

        public static DateTime GetDateTodayStartDay()
        {
            return service.GetDateTodayStartDay();
        }

        public static DateTime GetDateEndDay()
        {
            return service.GetDateTodayEndDay();
        }

        public static String GetShortDate(DateTime date)
        {
            return service.GetShortDate(date);
        }
        #endregion
    }
}
