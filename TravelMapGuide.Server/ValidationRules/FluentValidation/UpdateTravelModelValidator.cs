using FluentValidation;
using TravelMapGuideWebApi.Server.Models;

namespace TravelMapGuideWebApi.Server.ValidationRules.FluentValidation
{
    public class UpdateTravelModelValidator : AbstractValidator<UpdateTravelModel>
    {
        public UpdateTravelModelValidator()
        {
            RuleFor(x => x.Id)
                    .NotEmpty()
                   .Matches(@"^[a-fA-F0-9]{24}$");
            RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
            RuleFor(x => x.Description).NotEmpty();
            RuleFor(x => x.Location).NotEmpty();
            RuleFor(x => x.Date).NotEmpty().LessThanOrEqualTo(DateTime.Now);
            RuleFor(x => x.StarReview).NotEmpty().InclusiveBetween(1, 5);
            RuleFor(x => x.Cost).GreaterThanOrEqualTo(0);
        }
    }
}
