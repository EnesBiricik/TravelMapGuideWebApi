using System.Threading.Tasks;
using TravelMapGuideWebApi.Server.Data.Entities;
using TravelMapGuideWebApi.Server.Helpers;
using TravelMapGuideWebApi.Server.Models;

namespace TravelMapGuideWebApi.Server.Services
{
    public interface IUserService
    {
        Task<Result> RegisterUserAsync(UserRegisterModel model);
        Task<Result<TokenResponseModel>> LoginUserAsync(UserLoginModel model);
        Task<Result<User>> UpdateUserAsync(UpdateUserModel model, string oldToken);
        Task<Result> DeleteAsync(string id);
        Task<bool> LogoutAsync(string token);
    }
}
