
using NHibernate;
using NHibernate.Criterion;
using System.Collections.Generic;
using System.Linq;
using ECO.RCF.BussinessLogic.Generics;
using ECO.RCF.DataAccess.Generics;
using System;
using System.Configuration;
using ECO.RCF.DataAccess;
using ECO.RCF.DataAccess.Mapping;
using Mapster;

namespace ECO.RCF.BussinessLogic
{
    /// <summary>
    /// Aqui se declararan los metodos que invocaran a los servicios de los casos de uso,
    /// los cuales no deberian ser desarrollados en el GenericService.
    /// </summary>
    public class BlankApplicationService : GenericService
    {
        private static BlankApplicationService instance;
        
        //Singleton
        public new static BlankApplicationService Instance
        {
            get
            {
                if (instance == null)
                {
                    instance = new BlankApplicationService();
                }
                return instance;
            }
        }

        /// <summary>
        /// Encapsulamiento interno del repositorio.
        /// </summary>
        protected NHibernateRepository repository = NHibernateRepository.Instance;

        public string SolicitarToken()
        {
            return repository.Session.QueryOver<SolicitudToken>().Where(z => z.Nombre == ConfigurationManager.AppSettings["NOMBRE_TOKEN"]).OrderBy(x => x.CId).Desc.List<SolicitudToken>().FirstOrDefault().Valor;
        }

        public IList<EntidadDTO> GetAllEntidadesFisicas()
        {


            IList<Entidad> entidadesFisicas = GetAll<Entidad>();


            return entidadesFisicas.Adapt<IList<EntidadDTO>>();
        }

    }
}
