using FluentValidation;
using TravelMapGuideWebApi.Server.Models;

namespace TravelMapGuideWebApi.Server.ValidationRules.FluentValidation
{
    public class UpdateUserModelValidator : AbstractValidator<UpdateUserModel>
    {
        public UpdateUserModelValidator()
        {
            RuleFor(x => x)
                .Must(x => x.OldPassword != x.NewPassword)
                .WithMessage("New password must be different from the old password.");

            RuleFor(x => x.NewPassword)
                .Equal(x => x.ConfirmNewPassword) //Compare zınk
                .WithMessage("New password and confirm password must match.");
        }
    }
}
