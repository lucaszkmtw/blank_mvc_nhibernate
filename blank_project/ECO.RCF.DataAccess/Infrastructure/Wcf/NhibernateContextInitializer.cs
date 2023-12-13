using System.ServiceModel;
using System.ServiceModel.Channels;
using System.ServiceModel.Dispatcher;
using ECO.RCF.DataAccess.Infrastructure;

namespace ECO.RCF.DataAccess.Infrastructure.Wcf
{
    public class NhibernateContextInitializer : IInstanceContextInitializer
    {
        public void Initialize(InstanceContext instanceContext, Message message)
        {
            instanceContext.Extensions.Add(new NhibernateContextExtension(NHibernateHelper.OpenSession()));
        }
    }
}