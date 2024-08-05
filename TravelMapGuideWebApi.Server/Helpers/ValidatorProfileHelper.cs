using FluentValidation;
using TravelMapGuideWebApi.Server.ValidationRules.FluentValidation;

namespace TravelMapGuideWebApi.Server.Validators
{
    public static class ValidatorProfileHelper
    {
        public static List<IValidator> GetValidators()
        {
            return new List<IValidator>
            {
                new CreateTravelModelValidator(),
                new UpdateTravelModelValidator()
            };
        }
    }
}
