using NHibernate;
using NHibernate.Criterion;
using NHibernate.Envers;
using NHibernate.SqlCommand;
using Oracle.DataAccess.Client;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using ECO.RCF.DataAccess.Domain.Entities;
using ECO.RCF.DataAccess.Domain.Entities.Respuesta;
using ECO.RCF.DataAccess.Generics;
using ECO.RCF.DataAccess.Infrastructure;
using ECO.RCF.DataAccess.Infrastructure.Transactions;

namespace ECO.RCF.DataAccess
{
    /// <summary>
    /// Implementacion generica de la capa de servicio (logica de negocio) de nuestra aplicacion.
    /// Dentro de esta clase se interactua con la capa de acceso a datos a traves del repositorio.
    /// </summary>
    /// <typeparam name="ID"></typeparam>
    /// <typeparam name="T"></typeparam>
    public class GenericDataAccessService
    {
        #region // Variables //

        private static GenericDataAccessService instance;

        //private static readonly ILog Log = LogManager.GetLogger(typeof(System.Web.HttpApplication));
        /// <summary>
        /// Encapsulamiento interno del repositorio.
        /// </summary>
        private NHibernateRepository repository = NHibernateRepository.Instance;

        /// <summary>
        /// Servicio de Historia
        /// </summary>
        //private HistoriaService historiaService;

        /// <summary>
        /// Encapsulamiento interno para el tipo de revision de envers
        /// </summary>
        private Dictionary<string, RevisionType> tiposRevision = new Dictionary<string, RevisionType>() {
            { TipoRevision.ALTA, RevisionType.Added },
            { TipoRevision.MODIFICACION, RevisionType.Modified },
            { TipoRevision.BAJA, RevisionType.Deleted } };

        #endregion

        #region // Propiedades //
        #endregion

        #region // Constructores //


        /// <summary>
        /// Constructor por defecto
        /// </summary>
        public GenericDataAccessService()
        {
            //historiaService = HistoriaService.GetInstance(repository.Session);
        }
        #endregion

        #region // Metodos  //
        public static GenericDataAccessService GetInstance
        {
            get
            {
                if (instance == null)
                {
                    instance = new GenericDataAccessService();
                }
                return instance;
            }
        }

        /// <summary>
        /// Metodo que devuelve una transaccion del repositorio
        /// </summary>
        /// <returns></returns>
        public Transaction BeginTransaction(ISession session = null)
        {
            return repository.BeginTransaction(session);
        }

        /// <summary>
        /// Metodo que devuelve una transaccion del repositorio
        /// </summary>
        /// <returns></returns>
        public ISession GetSession()
        {
            return repository.Session;
        }

        /// <summary>
        /// Metodo que devuelve una transaccion del repositorio
        /// </summary>
        /// <returns></returns>
        public ISession GetSessionPorConfig(string configPath)
        {

            return NHibernateHelper.GetSessionFromConfig(configPath);
        }

        #region CONSULTA
        /// <summary>
        /// Devuelve un Response con una lista de todos los objetos tipados en T solicitadas al repositorio
        /// </summary>
        /// <returns></returns>
        public IList<BaseEntity> GetAll(System.Type obj, ISession session = null)
        {
            return repository.GetAll(obj, session);
        }

        /// <summary>
        /// Devuelve un Response con una lista de todos los objetos tipados en T solicitadas al repositorio
        /// </summary>
        /// <returns></returns>
        public IList<BaseEntity> GetAll(System.Type obj, string[] propiedades, ISession session = null)
        {
            return repository.GetAll(obj, propiedades, session);
        }

        /// <summary>
        /// Devuelve una lista de todos los objetos tipados en T solicitadas al repositorio
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public IList<T> GetAll<T>(ISession session = null) where T : class
        {
            return repository.GetAll<T>(session);
        }

        /// <summary>
        /// Devuelve una lista de todos los objetos tipados en T solicitadas al repositorio
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public IList<T> GetAll<T>(string[] propiedades, ISession session = null) where T : class
        {
            return repository.GetAll<T>(propiedades, session);
        }


        /// <summary>
        /// Devuelve un Response con una lista de todos los objetos tipados en T solicitadas al repositorio
        /// con un search dado por parametro
        /// </summary>
        /// <param name="pager"></param>
        /// <returns></returns>
        public IList<T> GetByCriteria<T>(Search search, bool distinct = false, ISession altSession = null) where T : class
        {
            ISession sesion = altSession ?? repository.Session;

            ICriteria criteria = sesion.CreateCriteria(typeof(T), "Criteria");

            foreach (ICriterion expression in search.Expressions)
            {
                criteria.Add(expression);
            }

            /// Orden (opcional)
            if (search.Order != null)
                criteria.AddOrder(search.Order);

            /// MaxResult (opcional)
            if (search.MaxResult != null)
                criteria.SetMaxResults((int)search.MaxResult);

            /// Alias (opcionales)
            foreach (KeyValuePair<string, string> pair in search.Alias)
            {
                criteria.CreateAlias(pair.Key, pair.Value);
            }

            /// Alias left join (opcionales)
            foreach (KeyValuePair<string, string> pair in search.AliasLeftJoin)
            {
                criteria.CreateAlias(pair.Key, pair.Value, JoinType.LeftOuterJoin);
            }

            /// DistinctRootEntity (opcional)
            if (search.DistinctRootEntity)
                criteria.SetResultTransformer(new NHibernate.Transform.DistinctRootEntityResultTransformer());




            return repository.GetByCriteria<T>(criteria);
        }



        public IList<object> GetByCriteriaDistinct<T>(Search search, string[] propiedades, ISession altSession = null) where T : class
        {
            ISession sesion = altSession ?? repository.Session;

            ICriteria criteria = sesion.CreateCriteria(typeof(T));

            //foreach (ICriterion expression in search.Expressions)
            //{
            //    criteria.Add(expression);
            //}

            ///// Orden (opcional)
            //if (search.Order != null)
            //    criteria.AddOrder(search.Order);

            ///// MaxResult (opcional)
            //if (search.MaxResult != null)
            //    criteria.SetMaxResults((int)search.MaxResult);

            ///// Alias (opcionales)
            //foreach (KeyValuePair<string, string> pair in search.Alias)
            //{
            //    criteria.CreateAlias(pair.Key, pair.Value);
            //}

            ///// Alias left join (opcionales)
            //foreach (KeyValuePair<string, string> pair in search.AliasLeftJoin)
            //{
            //    criteria.CreateAlias(pair.Key, pair.Value, JoinType.LeftOuterJoin);
            //}

            ///// DistinctRootEntity (opcional)
            //if (search.DistinctRootEntity)
            //    criteria.SetResultTransformer(new NHibernate.Transform.DistinctRootEntityResultTransformer());

          foreach(string propiedad in propiedades)
            {
                criteria.SetProjection(Projections.Distinct(Projections.Property(propiedad)));
            }

            return repository.GetByCriteriaDistinct<T>(criteria);
        }




        /// <summary>
        /// Devuelve un Response con una lista de todos los objetos tipados en T solicitadas al repositorio
        /// con un search dado por parametro
        /// </summary>
        /// <param name="pager"></param>
        /// <returns></returns>
        public IList<T> GetByCriteria<T>(Search search, string[] propiedades, bool distinct = false, ISession altSession = null) where T : class
        {
            ISession sesion = altSession ?? repository.Session;

            ICriteria criteria = sesion.CreateCriteria(typeof(T), "Criteria");

            foreach (ICriterion expression in search.Expressions)
            {
                criteria.Add(expression);
            }

            /// Orden (opcional)
            if (search.Order != null)
                criteria.AddOrder(search.Order);

            /// MaxResult (opcional)
            if (search.MaxResult != null)
                criteria.SetMaxResults((int)search.MaxResult);

            /// Alias (opcionales)
            foreach (KeyValuePair<string, string> pair in search.Alias)
            {
                criteria.CreateAlias(pair.Key, pair.Value);
            }

            /// Alias left join (opcionales)
            foreach (KeyValuePair<string, string> pair in search.AliasLeftJoin)
            {
                criteria.CreateAlias(pair.Key, pair.Value, JoinType.LeftOuterJoin);
            }

            /// DistinctRootEntity (opcional)
            if (search.DistinctRootEntity)
                criteria.SetResultTransformer(new NHibernate.Transform.DistinctRootEntityResultTransformer());


            return repository.GetByCriteria<T>(criteria, propiedades, distinct, search.Alias.Union(search.AliasLeftJoin).Select(x => x.Value).ToList());
        }

        /// <summary>
        /// Devuelve un Response con una lista de todos los objetos tipados en T solicitadas al repositorio
        /// con un search dado por parametro
        /// </summary>
        /// <param name="pager"></param>
        /// <returns></returns>
        public IList<BaseEntity> GetByCriteria(Search search, Type entityType, bool distinct = false)
        {
            ISession sesion = repository.Session;

            ICriteria criteria = sesion.CreateCriteria(entityType, "Criteria");

            foreach (ICriterion expression in search.Expressions)
            {
                criteria.Add(expression);
            }

            /// Orden (opcional)
            if (search.Order != null)
                criteria.AddOrder(search.Order);

            /// MaxResult (opcional)
            if (search.MaxResult != null)
                criteria.SetMaxResults((int)search.MaxResult);

            /// Alias (opcionales)
            foreach (KeyValuePair<string, string> pair in search.Alias)
            {
                criteria.CreateAlias(pair.Key, pair.Value);
            }

            /// Alias left join (opcionales)
            foreach (KeyValuePair<string, string> pair in search.AliasLeftJoin)
            {
                criteria.CreateAlias(pair.Key, pair.Value, JoinType.LeftOuterJoin);
            }

            /// DistinctRootEntity (opcional)
            if (search.DistinctRootEntity)
                criteria.SetResultTransformer(new NHibernate.Transform.DistinctRootEntityResultTransformer());


            return repository.GetByCriteria(criteria);
        }

        /// <summary>
        /// Devuelve un Response con una lista de todos los objetos tipados en T solicitadas al repositorio
        /// con un search dado por parametro
        /// </summary>
        /// <param name="pager"></param>
        /// <returns></returns>
        public IList<BaseEntity> GetByCriteria(Search search, Type entityType, string[] propiedades, bool distinct = false)
        {
            ISession sesion = repository.Session;

            ICriteria criteria = sesion.CreateCriteria(entityType, "Criteria");

            foreach (ICriterion expression in search.Expressions)
            {
                criteria.Add(expression);
            }

            /// Orden (opcional)
            if (search.Order != null)
                criteria.AddOrder(search.Order);

            /// MaxResult (opcional)
            if (search.MaxResult != null)
                criteria.SetMaxResults((int)search.MaxResult);

            /// Alias (opcionales)
            foreach (KeyValuePair<string, string> pair in search.Alias)
            {
                criteria.CreateAlias(pair.Key, pair.Value);
            }

            /// Alias left join (opcionales)
            foreach (KeyValuePair<string, string> pair in search.AliasLeftJoin)
            {
                criteria.CreateAlias(pair.Key, pair.Value, JoinType.LeftOuterJoin);
            }

            /// DistinctRootEntity (opcional)
            if (search.DistinctRootEntity)
                criteria.SetResultTransformer(new NHibernate.Transform.DistinctRootEntityResultTransformer());


            return repository.GetByCriteria(criteria, propiedades, entityType, distinct, search.Alias.Union(search.AliasLeftJoin).Select(x => x.Value).ToList());
        }

        /// <summary>
        /// Metodo que devuelve el count del criteria
        /// </summary>
        /// <param name="search"></param>
        /// <param name="obj"></param>
        /// <returns></returns>
        public int GetCountByCriteria(Search search, System.Type obj, ISession altSession = null)
        {

            ISession sesion = altSession ?? repository.Session;

            ICriteria criteria = sesion.CreateCriteria(obj, "Criteria");

            foreach (ICriterion expression in search.Expressions)
            {
                criteria.Add(expression);
            }

            /// Orden (opcional)
            if (search.Order != null)
                criteria.AddOrder(search.Order);

            /// MaxResult (opcional)
            if (search.MaxResult != null)
                criteria.SetMaxResults((int)search.MaxResult);

            /// Alias (opcionales)
            foreach (KeyValuePair<string, string> pair in search.Alias)
            {
                criteria.CreateAlias(pair.Key, pair.Value);
            }

            /// Alias left join (opcionales)
            foreach (KeyValuePair<string, string> pair in search.AliasLeftJoin)
            {
                criteria.CreateAlias(pair.Key, pair.Value, JoinType.LeftOuterJoin);
            }

            /// DistinctRootEntity (opcional)
            if (search.DistinctRootEntity)
                criteria.SetResultTransformer(new NHibernate.Transform.DistinctRootEntityResultTransformer());

            return repository.GetCountByCriteria(criteria);
        }

        /// <summary>
        /// Metodo que devuelve el count del criteria
        /// </summary>
        /// <param name="search"></param>
        /// <param name="obj"></param>
        /// <returns></returns>
        public int GetCountByCriteria<T>(Search search, ISession altSession = null)
        {
            ISession sesion = altSession ?? repository.Session;

            ICriteria criteria = sesion.CreateCriteria(typeof(T), "Criteria");

            foreach (ICriterion expression in search.Expressions)
            {
                criteria.Add(expression);
            }

            /// Orden (opcional)
            if (search.Order != null)
                criteria.AddOrder(search.Order);

            /// MaxResult (opcional)
            if (search.MaxResult != null)
                criteria.SetMaxResults((int)search.MaxResult);

            /// Alias (opcionales)
            foreach (KeyValuePair<string, string> pair in search.Alias)
            {
                criteria.CreateAlias(pair.Key, pair.Value);
            }

            /// Alias left join (opcionales)
            foreach (KeyValuePair<string, string> pair in search.AliasLeftJoin)
            {
                criteria.CreateAlias(pair.Key, pair.Value, JoinType.LeftOuterJoin);
            }

            /// DistinctRootEntity (opcional)
            if (search.DistinctRootEntity)
                criteria.SetResultTransformer(new NHibernate.Transform.DistinctRootEntityResultTransformer());

            return repository.GetCountByCriteria(criteria);
        }

        /// <summary>
        /// Devuelve un Response con una lista de todos los objetos tipados en T solicitadas al repositorio mediante una consulta sql
        /// </summary>
        /// <returns></returns>
        public IList<BaseEntity> GetBySql(System.Type obj, string sql, string parametro)
        {
            return repository.GetBySql(obj, sql, parametro);
        }
        public object GetBySqlFunction(string sql, string parametro)
        {
            return repository.GetBySqlFunction(sql, parametro);
        }
        /// <summary>
        /// Devuelve un Response con una lista de todos los objetos tipados en T solicitadas al repositorio mediante una consulta sql
        /// </summary>
        /// <returns></returns>
        public IList<T> GetBySql<T>(string sql, string parametro) where T : class
        {
            return repository.GetBySql<T>(sql, parametro);
        }

        /// <summary>
        /// Devuelve un Response con una lista de todos los objetos tipados en T solicitadas al repositorio
        /// con un paginado dado por parametro y un filtro ingresado
        /// </summary>
        /// <param name="pager"></param>
        /// <param name="filter"></param>
        /// <returns></returns>
        //public Response PagedSearch(Pager pager, System.Type filter)
        //{
        //    return this.Execute(delegate ()
        //    {
        //        return repository.PagedSearch(pager, filter);
        //    });
        //}

        /// <summary>
        /// Devuelve un Response con una lista de todos los objetos tipados en T solicitadas al repositorio
        /// con filtro ingresado
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        public IList<BaseEntity> Search(BaseEntity filter)
        {
            Type t = filter.GetType();

            return repository.Search(t);
        }

        /// <summary>
        /// Retorna un objeto tipado con T cuyo id viene por parametro, dicho objeto es solicitado al repositorio.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public BaseEntity GetById(long id, Type baseEntityType, ISession session = null)
        {
            return repository.GetById(id, baseEntityType, session);
        }

        /// <summary>
        /// Retorna un objeto tipado con T cuyo id viene por parametro, dicho objeto es solicitado al repositorio.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public BaseEntity GetById(long id, Type baseEntityType, string[] propiedades, ISession session = null)
        {
            return repository.GetById(id, baseEntityType, propiedades, session);
        }

        /// <summary>
        /// Retorna un objeto tipado con T cuyo id viene por parametro, dicho objeto es solicitado al repositorio.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public T GetById<T>(long id, ISession session = null) where T : class
        {
            return repository.GetById<T>(id, session);
        }

        /// <summary>
        /// Retorna un objeto tipado con T cuyo id viene por parametro, dicho objeto es solicitado al repositorio.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public T GetById<T>(long id, string[] propiedades, ISession session = null) where T : class
        {
            return repository.GetById<T>(id, propiedades, session);
        }

        /// <summary>
        /// Retorna un objeto tipado con T cuyo id viene por parametro, dicho objeto es solicitado al repositorio.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public T GetById<T>(Dictionary<string, object> ids, ISession session = null) where T : class
        {
            return repository.GetById<T>(ids, session);
        }

        /// <summary>
        /// Retorna un objeto tipado con T cuyo id viene por parametro, dicho objeto es solicitado al repositorio.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public T GetById<T>(Dictionary<string, object> ids, string[] propiedades, ISession session = null) where T : class
        {
            return repository.GetById<T>(ids, propiedades, session);
        }

        /// <summary>
        /// Metodo para ir a buscar un objeto a la base por id, sin importar si es Id o compisiteId.
        /// </summary>
        /// <param name="ids">diccionario con el conjuntos de ids y sus valores para ir a buscar un objeto a la base</param>
        /// <param name="baseEntityType">tipo de la entidad persistente a buscar</param>
        /// <returns>la entidad encontrada</returns>
        public BaseEntity GetById(Dictionary<string, object> ids, Type baseEntityType, string[] propiedades, ISession session = null)
        {
            return repository.GetById(ids, baseEntityType, propiedades, session);
        }

        /// <summary>
        /// Metodo para ir a buscar un objeto a la base por id, sin importar si es Id o compisiteId.
        /// </summary>
        /// <param name="ids">diccionario con el conjuntos de ids y sus valores para ir a buscar un objeto a la base</param>
        /// <param name="baseEntityType">tipo de la entidad persistente a buscar</param>
        /// <returns>la entidad encontrada</returns>
        public BaseEntity GetById(Dictionary<string, object> ids, Type baseEntityType, ISession session = null)
        {
            return repository.GetById(ids, baseEntityType, session);
        }
        #endregion


        #region ABM


        #region SaveOrUpdate
        /// <summary>
        /// Inserta un objeto tipado en T, utilizando el repositorio, y retorna su ID.
        /// </summary>
        /// <param name="entity"></param>
        public void SaveOrUpdate(BaseEntity entity, ISession session = null)
        {

            try
            {
                repository.SaveOrUpdate(entity, session);
            }
            catch (Exception)
            {
                // Limpiamos con un SP el usuario seteado en el contexto de la BD - SOLO NECESARIO PARA ENTIDADES SIGAF, PARA EL RESTO NO HACE NADA
                repository.RollbackUserDBContext();
                throw;
            }
        }
        #endregion



        #region Insert


        /// <summary>
        /// Inserta un objeto tipado en T, utilizando el repositorio, y retorna su ID.
        /// </summary>
        /// <param name="entity"></param>
        public object Insert(BaseEntity entity, ISession session = null)
        {

            try
            {
                var id = repository.Insert(entity, session);
                return id;
            }
            catch (Exception)
            {
                // Limpiamos con un SP el usuario seteado en el contexto de la BD - SOLO NECESARIO PARA ENTIDADES SIGAF, PARA EL RESTO NO HACE NADA
                repository.RollbackUserDBContext();
                throw;
            }
        }

        /// <summary>
        /// Inserta un objeto tipado en T, utilizando el repositorio, y retorna su ID.
        /// </summary>
        /// <param name="entity"></param>
        public object InsertAll(IList<BaseEntity> entities, bool commit = true, ISession session = null)
        {

            try
            {
                IList<object> ids = new List<object>();
                foreach (BaseEntity entity in entities)
                {
                    ids.Add(repository.Insert(entity, session));
                }
                return ids;
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// Inserta un objeto tipado en T, utilizando el repositorio, y retorna su ID.
        /// </summary>
        /// <param name="entity"></param>
        public object InsertAll<T>(IList<T> entities, bool commit = true, ISession session = null) where T : class
        {

            try
            {
                IList<object> ids = new List<object>();
                foreach (T entity in entities)
                {
                    ids.Add(repository.Insert<T>(entity, session));
                }
                return ids;
            }
            catch (Exception)
            {
                // Limpiamos con un SP el usuario seteado en el contexto de la BD - SOLO NECESARIO PARA ENTIDADES SIGAF, PARA EL RESTO NO HACE NADA
                throw;
            }
        }

        #endregion

        #region Delete
        /// <summary>
        /// Elimina un objeto cuyo ID es pasado por parametro, utilizando el repositorio.
        /// </summary>
        /// <param name="id"></param>
        public void DeleteAll<T>(List<Dictionary<string, object>> ids, bool commit = true, ISession session = null) where T : class
        {

            try
            {
                foreach (Dictionary<string, object> idValues in ids)
                {
                    repository.Delete(repository.GetById<T>(idValues, session) as BaseEntity, session);
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// Elimina un objeto cuyo ID es pasado por parametro, utilizando el repositorio.
        /// </summary>
        /// <param name="id"></param>
        public void DeleteAll(List<Dictionary<string, object>> ids, Type baseEntityType, bool commit = true, ISession session = null)
        {

            try
            {
                foreach (Dictionary<string, object> idValues in ids)
                {
                    repository.Delete(repository.GetById(idValues, baseEntityType, session), session);
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// Elimina un objeto cuyo ID es pasado por parametro, utilizando el repositorio.
        /// </summary>
        /// <param name="id"></param>
        public void DeleteAll<T>(IList<long> ids, bool commit = true, ISession session = null) where T : class
        {

            try
            {
                foreach (long idValue in ids)
                {
                    repository.Delete(repository.GetById<T>(idValue, session) as BaseEntity, session);
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// Elimina un objeto cuyo ID es pasado por parametro, utilizando el repositorio.
        /// </summary>
        /// <param name="id"></param>
        public void DeleteAll(IList<long> ids, Type baseEntityType, bool commit = true, ISession session = null)
        {

            try
            {
                foreach (long idValue in ids)
                {
                    repository.Delete(repository.GetById(idValue, baseEntityType, session), session);
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// Elimina un objeto cuyo ID es pasado por parametro, utilizando el repositorio.
        /// </summary>
        /// <param name="id"></param>
        public void Delete(Dictionary<string, object> ids, Type baseEntityType, ISession session = null)
        {

            try
            {
                repository.Delete(repository.GetById(ids, baseEntityType, session), session);
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// Elimina un objeto cuyo ID es pasado por parametro, utilizando el repositorio.
        /// </summary>
        /// <param name="id"></param>
        public void Delete<T>(Dictionary<string, object> ids, ISession session = null) where T : class
        {
            try
            {
                repository.Delete(repository.GetById<T>(ids, session) as BaseEntity, session);
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// Elimina un objeto cuyo ID es pasado por parametro, utilizando el repositorio.
        /// </summary>
        /// <param name="id"></param>
        public void Delete(long id, Type baseEntityType, ISession session = null)
        {

            try
            {
                repository.Delete(repository.GetById(id, baseEntityType, session), session);
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// Elimina un objeto cuyo ID es pasado por parametro, utilizando el repositorio.
        /// </summary>
        /// <param name="id"></param>
        public void Delete<T>(long id, ISession session = null) where T : class
        {

            try
            {
                repository.Delete(repository.GetById<T>(id, session) as BaseEntity, session);
            }
            catch (Exception)
            {
                throw;
            }
        }
        #endregion

        #region Update
        /// <summary>
        /// Actualiza un objeto tipado en T, utilizando el repositorio.
        /// </summary>
        /// <param name="entity"></param>
        public void Update(BaseEntity entity, ISession session = null)
        {
            try
            {

                repository.Update(entity, session);
            }
            catch (Exception)
            {
                // Limpiamos con un SP el usuario seteado en el contexto de la BD - SOLO NECESARIO PARA ENTIDADES SIGAF, PARA EL RESTO NO HACE NADA
                repository.RollbackUserDBContext(session);
                throw;
            }
        }

        /// <summary>
        /// Actualiza un objeto tipado en T, utilizando el repositorio.
        /// </summary>
        /// <param name="entity"></param>
        public void UpdateAll(IList<BaseEntity> entities, bool commit = true, ISession session = null)
        {
            try
            {
                foreach (BaseEntity entity in entities)
                {
                    repository.Update(entity, session);
                }
            }
            catch (Exception)
            {
                throw;
            }
        }
        #endregion


        #endregion



        protected int CurrentPage(int page, int records)
        {
            return (page - 1) * records;
        }


        /// <summary>
        /// Metodo utilizado por el BussinessLogic para el chequeo de concurrencia.
        /// Si ambas versiones no son iguales lanza una StaleObjectStateException
        /// que será atrapada por el ErrorManagerTGP.
        /// </summary>
        /// <param name="versionPersistentObject">Numero de version del objeto persistido actualmente</param>
        /// <param name="versionModifiedObject">Numero de version del objeto que estamos modificando</param>
        /// <param name="entityName">Nombre de la entidad modificada</param>
        /// <param name="idModifiedObject">Id de la entidad</param>
        public void ConcurrencyCheck(long versionPersistentObject, long versionModifiedObject, string entityName, Dictionary<string, object> idModifiedObject)
        {
            if (!versionPersistentObject.Equals(versionModifiedObject))
            {
                throw new StaleObjectStateException(entityName, idModifiedObject);
            }
        }

        /// <summary>
        /// Retorna los elementos de la lista principal que no estan en la lista secundaria
        /// </summary>
        /// <param name="main">Lista principal</param>
        /// <param name="secondary">Lista secundaria</param>
        /// <returns></returns>
        public IList<object> GetDifferents(IList<object> main, IList<object> secondary)
        {
            return (from x in main where !secondary.Contains(x) select x).ToList();
        }

        #endregion

        #region Otros
        public string ObtenerNombreBaseDeDatos()
        {
            return repository.ObtenerNombreBaseDeDatos();
        }
        #endregion

        #region LLAMADAS GENERICAS SP
        /// <summary>
        /// Metodo que llama a Store procedure y no espera respueta
        /// </summary>
        /// <param name="sp"></param>
        public void GenericCallStoreProcedure(StoreProcedureDTO sp)
        {
            ISession session = GetSession();
            System.Data.Common.DbCommand command = new OracleCommand();
            //Step - 4 - Setting the connection property of the command instance 
            //with NHibernate session's Connection property.
            command.Connection = session.Connection;
            //Step - 5 - Setting the CommandType property 
            //as CommandType.StoredProcedure
            command.CommandType = System.Data.CommandType.StoredProcedure;
            //Step - 6 - Setting the CommandText to the name 
            //of the stored procedure to invoke.
            command.CommandText = sp.NombreStoreProcedure;
            ////PARATROS DE ENTRADA
            ObtenerParametrosDeEntrada(sp, ref command);

            session.Transaction.Enlist(command);
            //Step - 10 - Executing the stored procedure.
            command.ExecuteNonQuery();

        }

        /// <summary>
        /// Metodo utilizado por el BussinessLogic para el llamado a stores procedures.
        /// Si ambas versiones no son iguales lanza una StaleObjectStateException
        /// que será atrapada por el ErrorManagerTGP.
        /// </summary>
        /// <param name="versionPersistentObject">Numero de version del objeto persistido actualmente</param>
        /// <param name="versionModifiedObject">Numero de version del objeto que estamos modificando</param>
        /// <param name="entityName">Nombre de la entidad modificada</param>
        /// <param name="idModifiedObject">Id de la entidad</param>
        public List<RespuestaStoreProcedure> GenericCallStoreProcedureWithResponse(StoreProcedureDTO sp)
        {
            ISession session = GetSession();
            System.Data.Common.DbCommand command = new OracleCommand();
            //Step - 4 - Setting the connection property of the command instance 
            //with NHibernate session's Connection property.
            command.Connection = session.Connection;
            //Step - 5 - Setting the CommandType property 
            //as CommandType.StoredProcedure
            command.CommandType = System.Data.CommandType.StoredProcedure;
            //Step - 6 - Setting the CommandText to the name 
            //of the stored procedure to invoke.
            command.CommandText = sp.NombreStoreProcedure;
            ////PARATROS DE ENTRADA
            ObtenerParametrosDeEntrada(sp, ref command);
            ////PARATROS DE SALIDA
            ObtenerParametrosDeSalida(sp, ref command);

            session.Transaction.Enlist(command);
            //Step - 10 - Executing the stored procedure.
            command.ExecuteNonQuery();

            List<RespuestaStoreProcedure> respuesta = new List<RespuestaStoreProcedure>();
            foreach (ParametroStoreProcedure parametro in sp.Parametros.Where(p => p.EsParametroEntrada == false).ToList())
            {
                respuesta.Add(new RespuestaStoreProcedure
                {
                    Clave = parametro.Nombre,
                    Valor = ((Oracle.DataAccess.Client.OracleParameter)command.Parameters[parametro.Nombre]).Value.ToString(),
                });

            };
            return respuesta;
        }

        private void ObtenerParametrosDeEntrada(StoreProcedureDTO sp, ref DbCommand command)
        {
            foreach (ParametroStoreProcedure parametro in sp.Parametros.Where(p => p.EsParametroEntrada == true).ToList())
            {
                Oracle.DataAccess.Client.OracleParameter inputParameter =
                new Oracle.DataAccess.Client.OracleParameter(parametro.Nombre, ConvertToDbType(parametro.TipoDato))
                {
                    Direction = ParameterDirection.Input,
                    Value = ConvertirTipoDato(parametro)
                };
                command.Parameters.Add(inputParameter);

                //command.Parameters.Add(new Oracle.DataAccess.Client.OracleParameter(parametro.Nombre, parametro.Valor));

            }
        }

        private object ConvertirTipoDato(ParametroStoreProcedure parametro)
        {
            if (parametro.TipoDato == TipoDatoParametro.Date)
            {
                return DateTime.Parse(parametro.Valor);
            }
            if (parametro.TipoDato == TipoDatoParametro.Int32)
            {
                return int.Parse(parametro.Valor);
            }
            if (parametro.TipoDato == TipoDatoParametro.Int64)
            {
                return long.Parse(parametro.Valor);
            }
            if (parametro.TipoDato == TipoDatoParametro.Varchar2)
            {
                return parametro.Valor;
            }
            if (parametro.TipoDato == TipoDatoParametro.Decimal)
            {
                return decimal.Parse(parametro.Valor);
            }
            else
            {
                throw new Exception("El tipo de dato del valor del parámetro no esta definido");
            }
        }

        private void ObtenerParametrosDeSalida(StoreProcedureDTO sp, ref DbCommand command)
        {
            foreach (ParametroStoreProcedure parametro in sp.Parametros.Where(p => p.EsParametroEntrada == false).ToList())
            {
                Oracle.DataAccess.Client.OracleParameter outputParameter = new OracleParameter();
                if (parametro.EsConTamaño)
                {
                    outputParameter = new Oracle.DataAccess.Client.OracleParameter(parametro.Nombre, ConvertToDbType(parametro.TipoDato), parametro.Tamaño)
                    {
                        Direction = ParameterDirection.Output
                    };
                }
                else
                {
                    outputParameter = new Oracle.DataAccess.Client.OracleParameter(parametro.Nombre, ConvertToDbType(parametro.TipoDato))
                    {
                        Direction = ParameterDirection.Output
                    };
                }
                command.Parameters.Add(outputParameter);


            }
        }

        private OracleDbType ConvertToDbType(TipoDatoParametro tipoDato)
        {
            if (tipoDato == TipoDatoParametro.Date)
            {
                return Oracle.DataAccess.Client.OracleDbType.Date;
            }
            if (tipoDato == TipoDatoParametro.Int32)
            {
                return Oracle.DataAccess.Client.OracleDbType.Int32;
            }
            if (tipoDato == TipoDatoParametro.Int64)
            {
                return Oracle.DataAccess.Client.OracleDbType.Int64;
            }
            if (tipoDato == TipoDatoParametro.Varchar2)
            {
                return Oracle.DataAccess.Client.OracleDbType.Varchar2;
            }
            if (tipoDato == TipoDatoParametro.Decimal)
            {
                return Oracle.DataAccess.Client.OracleDbType.Decimal;
            }
            else
            {
                throw new Exception("El tipo de parámetro no esta definido");
            }

        }
        #endregion

    }
}
