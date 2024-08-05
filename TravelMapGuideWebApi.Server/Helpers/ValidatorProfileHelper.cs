using FluentValidation;
using System.Reflection;
using TravelMapGuideWebApi.Server.ValidationRules.FluentValidation;

namespace TravelMapGuideWebApi.Server.Validators
{
    public static class ValidatorProfileHelper
    {
        public static List<Assembly> GetValidatorAssemblies()
        {
            return new List<Assembly>
            {
                typeof(CreateTravelModelValidator).Assembly,
                typeof(UpdateTravelModelValidator).Assembly
            };
        }
    }
}
