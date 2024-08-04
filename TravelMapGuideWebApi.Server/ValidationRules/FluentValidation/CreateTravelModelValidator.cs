using FluentValidation;
using TravelMapGuideWebApi.Server.Models.Travel;

namespace TravelMapGuideWebApi.Server.ValidationRules.FluentValidation
{
    public class CreateTravelModelValidator : AbstractValidator<CreateTravelModel>
    {
        public CreateTravelModelValidator()
        {
            RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
            RuleFor(x => x.Description).NotEmpty();
            //...
        }
    }
}
