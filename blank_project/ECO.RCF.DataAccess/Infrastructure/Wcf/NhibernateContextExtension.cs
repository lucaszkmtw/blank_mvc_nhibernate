using NHibernate;
using System.ServiceModel;

namespace ECO.RCF.DataAccess.Infrastructure.Wcf
{
    public class NhibernateContextExtension : IExtension<InstanceContext>
    {
        public NhibernateContextExtension(ISession session)
        {
            Session = session;
        }
        public ISession Session { get; private set; }

        public void Attach(InstanceContext owner) { }
        public void Detach(InstanceContext owner) { }
    }
}