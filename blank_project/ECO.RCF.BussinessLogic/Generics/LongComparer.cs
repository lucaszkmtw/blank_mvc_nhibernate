using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECO.RCF.BussinessLogic.Generics
{
    public class LongComparer : IEqualityComparer<long>
    {
        public bool Equals( long x, long y)
        {
            return x == y;
        }

        public int GetHashCode(long obj)
        {
            return obj.GetHashCode();
        }
    }
}
