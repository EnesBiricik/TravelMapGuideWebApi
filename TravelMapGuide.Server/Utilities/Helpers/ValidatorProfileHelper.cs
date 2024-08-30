using System.Reflection;
using TravelMapGuide.Server.ValidationRules.FluentValidation;

namespace TravelMapGuide.Server.Utilities.Helpers
{
    public static class ValidatorProfileHelper
    {
        public static List<Assembly> GetValidatorAssemblies()
        {
            return new List<Assembly>
            {
                typeof(CreateTravelModelValidator).Assembly,
                typeof(UpdateTravelModelValidator).Assembly,
                typeof(UserRegisterModelValidator).Assembly,
                typeof(UpdateUserModelValidator).Assembly
            };
        }
    }
}
