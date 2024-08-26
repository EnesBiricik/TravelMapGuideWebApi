using FluentValidation;
using TravelMapGuideWebApi.Server.Models;

namespace TravelMapGuideWebApi.Server.ValidationRules.FluentValidation
{
    public class UserRegisterModelValidator : AbstractValidator<UserRegisterModel>
    {
        public UserRegisterModelValidator()
        {
            RuleFor(x => x.Username).NotEmpty().MaximumLength(100);
            RuleFor(x => x.Email).NotEmpty();
            RuleFor(x => x.Password).NotEmpty();
        }
    }
}
