using Mapster;

namespace ECO.RCF.BussinessLogic.Config
{
    public static class MapsterConfig
    {
        public static void Config()
        {

            TypeAdapterConfig.GlobalSettings.Default.PreserveReference(true);
            

        }
    }
}
