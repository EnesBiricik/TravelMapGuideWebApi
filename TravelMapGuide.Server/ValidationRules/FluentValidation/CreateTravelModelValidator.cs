using FluentValidation;
using TravelMapGuide.Server.Models;

namespace TravelMapGuide.Server.ValidationRules.FluentValidation
{
    public class CreateTravelModelValidator : AbstractValidator<CreateTravelModel>
    {
        public CreateTravelModelValidator()
        {
            RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
            RuleFor(x => x.Description).NotEmpty();
            RuleFor(x => x.Latitude).NotEmpty();
            RuleFor(x => x.Longitude).NotEmpty();
            RuleFor(x => x.Date).NotEmpty().LessThanOrEqualTo(DateTime.Now);
            RuleFor(x => x.StarReview).NotEmpty().InclusiveBetween(1, 5);
            RuleFor(x => x.Cost).NotEmpty().GreaterThanOrEqualTo(0);
        }
    }
}
