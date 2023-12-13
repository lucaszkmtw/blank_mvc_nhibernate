
using ECO.RCF.BussinessLogic;
using System.Collections.Generic;
using System.Web.Mvc;


namespace ECO.RCF.Controllers
{
    #region //Referencias a las capas //
    #endregion

    

    public class HomeController : WebSecurityController
    {

        protected BlankApplicationService service = BlankApplicationService.Instance;

        #region // Metodos Publicos //


        public HomeController() { }
        /// <summary>0
        /// Metodo que muestra la vista por defecto de la aplicacion
        /// </summary>
        /// <returns></returns>
        //Ejemplo de utilizacion de atributo [Autoriza("crearAplicacion")]
        public ActionResult Index()
        {
            if (Session["usuario"] == null)
            {
                Session.Clear();
                return RedirectToAction("Login", "Account");
            }
            else
            {
                return View();
            }
        }

        public ActionResult TestIndex()
        {
            return View();
        }

        #endregion

        #region // Metodos Privados //

        //TODO: Para un mejor desarrollo ver las buenas practicas que se encuentra en la carpeta documentación

        #endregion


    }
}