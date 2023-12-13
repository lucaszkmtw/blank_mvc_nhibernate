using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Web.Mvc;
using TGP.Rendiciones.BussinessLogic.Generics;
using TGP.Rendiciones.Common.Dto;

namespace TGP.Rendiciones.Controllers
{
    /// <summary>
    /// FilterAttribute para interceptar las invocaciones a servicios CRUD de edicion de los diferentes controllers
    /// </summary>
    public class CheckObjectConcurrencyFilterAttribute : ActionFilterAttribute
    {
        // cargamos el Generic BussinessLogic Service al entorno de nuestro filtro
        private GenericService _genericBussinessLogicService = GenericService.Instance;

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            // obtenemos todos los parametros enviados al controller
            ParameterInfo[] parametros = ((ReflectedActionDescriptor)filterContext.ActionDescriptor).MethodInfo.GetParameters();
            if (parametros.Any(x => x.Name.Equals("id")))
            {
                //Este método injecta en el parametro BaseDto segun los parametros enviados por ajax.
                CheckConcurrencyAjax(filterContext, parametros);
            }
            else
            {
                //Este método solo chequea concurrencia, quedandose con el DTO enviado por submit.
                CheckConcurrencySubmit(filterContext, parametros);
            }

        }
        /// <summary>
        /// Método que chequea concurrencia para un metodo EDITAR o ELIMINAR que haya sido llamado por razor
        /// </summary>
        /// <param name="filterContext"></param>
        /// <param name="parametros"></param>
        //private void CheckConcurrencySubmit(ActionExecutingContext filterContext, ParameterInfo[] parametros)
        //{
        //    // itero sobre todos los parametros
        //    foreach (ParameterInfo parametro in parametros)
        //    {
        //        // me quedo con el nombre del parametro
        //        string parametroName = parametro.Name;
        //        // me quedo con el tipo del parametro
        //        Type parametroTipo = parametro.ParameterType;
        //        // chequeo si el tipo del parametro extiende de BaseDto
        //        if (parametroTipo.IsSubclassOf(typeof(BaseDto)))
        //        {
        //            BaseDto entidad = (BaseDto)filterContext.ActionParameters[parametro.Name];
        //            // vamos a buscar a la base el objeto acorde al compositeId y al tipo que extiende de BaseDto 
        //            BaseDto entidadDto = _genericBussinessLogicService.GetById(entidad.GetId(), parametroTipo);
        //            // chequeamos concurrencia
        //            _genericBussinessLogicService.ConcurrencyCheck(entidadDto, entidad.Version);
        //        }
        //    }
        //}
        /// <summary>
        /// Método que chequea concurrencia para un metodo EDITAR o ELIMINAR que haya sido llamado por Ajax
        /// </summary>
        /// <param name="filterContext"></param>
        /// <param name="parametros"></param>
        private void CheckConcurrencyAjax(ActionExecutingContext filterContext, ParameterInfo[] parametros)
        {
            // obtengo el parametro cuyo nombre es id
            string id = (string)filterContext.ActionParameters["id"];
            //// deserializamos el id utilizando el metodo estatico de BaseDto
            Dictionary<string, object> compositeId = BaseDto.IdDeserialize(id);
            // itero sobre todos los parametros
            foreach (ParameterInfo parametro in parametros)
            {
                // me quedo con el nombre del parametro
                string parametroName = parametro.Name;
                // me quedo con el tipo del parametro
                Type parametroTipo = parametro.ParameterType;
                // chequeo si el tipo del parametro extiende de BaseDto
                if (parametroTipo.IsSubclassOf(typeof(BaseDto)))
                {
                    //BaseDto entidad = (BaseDto)filterContext.ActionParameters[parametro.Name];
                    // vamos a buscar a la base el objeto acorde al compositeId y al tipo que extiende de BaseDto 
                    BaseDto entidadDto = _genericBussinessLogicService.GetById(compositeId, parametroTipo);
                    // chequeamos concurrencia
                    _genericBussinessLogicService.ConcurrencyCheck(entidadDto, int.Parse((string)filterContext.ActionParameters["version"]));
                    // inyectamos en la firma del metodo del controller la entidad que fuimos a buscar
                    filterContext.ActionParameters[parametroName] = entidadDto;
                }
            }
        }

        /// <summary>
        /// Metodo privado que transforma el diccionario de compositeId en un nuevo diccionario
        /// con los valores transformados a sus tipos reales.
        /// </summary>
        /// <param name="compositeId">diccionario con los campos que son id de la entidad</param>
        /// <param name="parametroTipo">tipo de la entidad que contiene los ids</param>
        /// <returns>nuevo diccionario con los values transformados</returns>
        private Dictionary<string, object> transformarTiposIds(Dictionary<string, object> compositeId, Type parametroTipo)
        {
            // instanciamos el nuevo diccionario de ids
            Dictionary<string, object> newCompositeId = new Dictionary<string, object>();
            // iteramos sobre los ids que vienen por parametros en el diccionario
            foreach (KeyValuePair<string, object> pair in compositeId)
            {
                // obtento la property del parametroTipo
                PropertyInfo propertyId = parametroTipo.GetProperty(pair.Key);
                // obtento el tipo de la property
                Type propertyType = propertyId.PropertyType;
                // convertimos el Value al tipo correcto.
                var newValue = TypeDescriptor.GetConverter(propertyType).ConvertFromString(((String[])pair.Value)[0]);
                // guardamos en el nuevo diccionario, el nombre de la property iterada con el nuevo valor transformado
                newCompositeId.Add(pair.Key, newValue);
            }
            // retornamos el nuevo diccionario de ids
            return newCompositeId;
        }
    }
}