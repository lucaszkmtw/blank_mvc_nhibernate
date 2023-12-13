using System.ServiceModel;

namespace ECO.RCF.DataAccess.Infrastructure.Wcf
{
    public class NhibernateContext
    {
        public static NhibernateContextExtension Current()
        {
            return OperationContext.Current.
                InstanceContext.
                Extensions.
                Find<NhibernateContextExtension>();
        }
    }
}