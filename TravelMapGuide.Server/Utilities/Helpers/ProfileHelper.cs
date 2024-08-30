using AutoMapper;
using TravelMapGuide.Server.Mappings.AutoMapper;

namespace TravelMapGuide.Server.Utilities.Helpers
{
    public static class ProfileHelper
    {
        public static List<Profile> GetProfiles()
        {

            return new List<Profile>
            {
                new TravelProfile(),
                new UserProfile()
            };
        }
    }
}
