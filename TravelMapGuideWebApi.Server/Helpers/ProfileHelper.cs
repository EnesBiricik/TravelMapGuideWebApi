using AutoMapper;
using TravelMapGuideWebApi.Server.Mappings.AutoMapper;

namespace Portfolio.Business.Business.Helpers
{
    public static class ProfileHelper
    {
        public static List<Profile> GetProfiles()
        {

            return new List<Profile>
            {
                new TravelProfile()
            };
        }
    }
}
