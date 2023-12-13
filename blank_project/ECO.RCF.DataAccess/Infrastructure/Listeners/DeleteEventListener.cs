using NHibernate.Engine;
using NHibernate.Event;
using NHibernate.Event.Default;
using NHibernate.Persister.Entity;
using System;
using System.Collections.Generic;
using ECO.RCF.DataAccess.Generics;

namespace ECO.RCF.DataAccess.Infrastructure.Listeners
{
    public class DeleteEventListener : DefaultDeleteEventListener
    {
        protected override void DeleteEntity(IEventSource session, object entity, EntityEntry entityEntry, bool isCascadeDeleteEnabled, IEntityPersister persister, ISet<object> transientEntities)
        {
            if (entity is Audit)
            {
                var e = (Audit)entity;
                e.FechaBaja = DateTime.Now;
                e.UsuarioBaja = SessionWrapper.GetUser();

                CascadeBeforeDelete(session, persister, entity, entityEntry, transientEntities);
                CascadeAfterDelete(session, persister, entity, transientEntities);
            }
            else
            {
                base.DeleteEntity(session, entity, entityEntry, isCascadeDeleteEnabled, persister, transientEntities);
            }
        }
    }
}
