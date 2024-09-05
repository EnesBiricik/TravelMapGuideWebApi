using TravelMapGuide.Server.Data.Entities;
using TravelMapGuide.Server.Models;
using TravelMapGuide.Server.Utilities.Helpers;

namespace TravelMapGuide.Server.Services
{
    public interface IUserService
    {
        Task<Result> RegisterUserAsync(UserRegisterModel model);
        Task<Result<TokenResponseModel>> LoginUserAsync(UserLoginModel model);
        Task<Result<UpdateUserResponseModel>> UpdateUserAsync(UpdateUserModel model, string oldToken);
        Task<Result<UpdateUserResponseModel>> UpdateUserRoleAsync(RoleUpdateModel model);
        Task<Result> DeleteAsync(string id);
        Task<bool> LogoutAsync(string token);
        Task<Result<IEnumerable<User>>> GetAllAsync();
    }
}
