using FluentValidation;
using TravelMapGuideWebApi.Server.Models;

namespace TravelMapGuideWebApi.Server.ValidationRules.FluentValidation
{
    public class CreateTravelModelValidator : AbstractValidator<CreateTravelModel>
    {
        public CreateTravelModelValidator()
        {
            RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
            RuleFor(x => x.Description).NotEmpty();
            RuleFor(x => x.Location).NotEmpty();
            RuleFor(x => x.Date).NotEmpty().LessThanOrEqualTo(DateTime.Now);
            RuleFor(x => x.StarReview).NotEmpty().InclusiveBetween(1, 5);
            RuleFor(x => x.Cost).NotEmpty().GreaterThanOrEqualTo(0);
        }
    }
}
