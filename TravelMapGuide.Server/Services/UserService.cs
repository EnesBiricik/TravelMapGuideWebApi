using FluentValidation;
using System.Text.RegularExpressions;
using TravelMapGuide.Server.Models;
using TravelMapGuide.Server.Data.Entities;
using TravelMapGuide.Server.Data.Repositories.Abstract;
using TravelMapGuide.Server.Utilities.Enums;
using TravelMapGuide.Server.Utilities.Helpers;
using TravelMapGuide.Server.Data.Repositories.Concrete;

namespace TravelMapGuide.Server.Services
{
    public class UserService : IUserService
    {
        private readonly IValidator<UserRegisterModel> _createUserValidator;
        private readonly IValidator<UpdateUserModel> _updateUserValidator;
        private readonly IUserRepository _userRepository;
        private readonly IRoleRepository _roleRepository;
        private readonly JwtTokenGenerator _tokenGenerator;
        private readonly IBlacklistService _blacklistService;



        public UserService(IUserRepository userRepository, IValidator<UserRegisterModel> createTravelValidator, JwtTokenGenerator jwtTokenGenerator, IRoleRepository roleRepository, IBlacklistService blacklistService, IValidator<UpdateUserModel> updateUserValidator)
        {
            _userRepository = userRepository;
            _createUserValidator = createTravelValidator;
            _tokenGenerator = jwtTokenGenerator;
            _roleRepository = roleRepository;
            _blacklistService = blacklistService;
            _updateUserValidator = updateUserValidator;
        }

        public async Task<Result<TokenResponseModel>> LoginUserAsync(UserLoginModel model)
        {
            var user = await _userRepository.GetUserByUsernameAsync(model.Username);

            if (user == null || !VerifyPassword(model.Password, user.Password))
            {
                return Result<TokenResponseModel>.Failure("Invalid username or password.");
            }

            if (user != null)
            {
                var token = _tokenGenerator.GenerateToken(user.Username, user.Role.Name, user.Id);
                var date = DateTime.UtcNow;
                var response = new TokenResponseModel
                {
                    Expiration = date,
                    Token = token
                };
                return Result<TokenResponseModel>.Success(response, "Login is success.");
            }

            return Result<TokenResponseModel>.Failure("An error occurred while login the system.");
        }
        public async Task<Result> RegisterUserAsync(UserRegisterModel model)
        {
            var existingUserByUsername = await _userRepository.GetUserByUsernameAsync(model.Username);
            if (existingUserByUsername != null)
            {
                return Result.Failure("This Username is already taken.");
            }

            var existingUserByEmail = await _userRepository.GetUserByEmailAsync(model.Email);
            if (existingUserByEmail != null)
            {
                return Result.Failure("This Email is already taken.");
            }


            var passwordHash = PasswordHasher.HashPassword(model.Password);

            var userRole = await _roleRepository.GetRoleByNameAsync(Roles.User);
            if (userRole == null)
            {
                return Result.Failure("Default user role not found.");
            }

            var user = new User
            {
                Username = model.Username,
                Password = passwordHash,
                Email = model.Email,
                RoleId = userRole.Id,
                Role = userRole,
                ImageUrl = model.ImageUrl
            };

            var result = await _userRepository.CreateAsync(user);
            if (result != null)
            {
                return Result<User>.Success(result, "User is Created.");
            }
            return Result.Failure("An error occurred while creating the user.");

        }
        public async Task<Result<UpdateUserResponseModel>> UpdateUserAsync(UpdateUserModel model, string oldToken)
        {
            var validateResult = _updateUserValidator.Validate(model);
            if (!validateResult.IsValid)
            {
                var errors = string.Join("; ", validateResult.Errors.Select(e => e.ErrorMessage));
                return Result<UpdateUserResponseModel>.Failure("Validate Errors: ", errors);
            }

            var user = await _userRepository.GetByIdAsync(model.UserId);
            if (user == null)
            {
                return Result<UpdateUserResponseModel>.Failure("User not found");
            }

            if (model.NewPassword.Length > 0)
            {
                if (!VerifyPassword(model.OldPassword, user.Password))
                {
                    return Result<UpdateUserResponseModel>.Failure("Old password is incorrect");
                }

                user.Password = PasswordHasher.HashPassword(model.NewPassword);
            }

            if (await _userRepository.IsUserExistsByUsernameAsync(user.Username))
            {
                var isExist = await _userRepository.GetUserByUsernameAsync(model.Username);
                if (isExist != null)
                {
                    return Result<UpdateUserResponseModel>.Failure("Username already exists");
                }
                user.Username = model.Username;
            }

            if (await _userRepository.IsUserExistsByEmailAsync(user.Email))
            {
                var isExist = await _userRepository.GetUserByEmailAsync(model.Username);
                if (isExist != null)
                {
                    return Result<UpdateUserResponseModel>.Failure("Email already exists");
                }
                user.Email = model.Email;
            }

            var updateResult = await _userRepository.UpdateAsync(user);
            if (updateResult != null)
            {
                await _blacklistService.BlacklistTokenAsync(oldToken);
                var newToken = _tokenGenerator.GenerateToken(updateResult.Username, updateResult.Role.Name, user.Id.ToString());

                return Result<UpdateUserResponseModel>.Success(new UpdateUserResponseModel { User = updateResult, Token = newToken }, "Güncelleme işlemi başarılı.");
            }

            return Result<UpdateUserResponseModel>.Failure("Failed to update user");
        }
        public async Task<Result<UpdateUserResponseModel>> UpdateUserRoleAsync(RoleUpdateModel model)
        {
            var user = await _userRepository.GetByIdAsync(model.UserId);
            if (user == null)
            {
                return Result<UpdateUserResponseModel>.Failure("Kullanıcı bulunamadı");
            }

            var role = await _roleRepository.GetByIdAsync(model.RoleId);
            if (role == null)
            {
                return Result<UpdateUserResponseModel>.Failure("Belirtilen rol bulunamadı");
            }

            user.Role = role;
            var updateResult = await _userRepository.UpdateAsync(user);

            if (updateResult != null)
            {
                var newToken = _tokenGenerator.GenerateToken(updateResult.Username, updateResult.Role.Name, model.UserId);
                return Result<UpdateUserResponseModel>.Success(
                    new UpdateUserResponseModel
                    {
                        User = user,
                        Token = newToken
                    },
                    "Rol Güncelleme işlemi başarılı."
                );
            }
            return Result<UpdateUserResponseModel>.Failure("Failed to update user");
        }
        public async Task<Result> DeleteAsync(string id)
        {

            bool isValid = Regex.IsMatch(id, @"^[a-fA-F0-9]{24}$");
            if (string.IsNullOrEmpty(id) || !isValid)
            {
                return Result<Travel>.Failure("Travel is not found. Id not matched.");
            }

            await _userRepository.DeleteAsync(id);
            return Result.Success();
        }
        private bool VerifyPassword(string password, string storedHash)
        {
            var hash = PasswordHasher.HashPassword(password);
            return hash == storedHash;
        }
        public async Task<bool> LogoutAsync(string token)
        {
            await _blacklistService.BlacklistTokenAsync(token);
            return await _blacklistService.IsTokenBlacklistedAsync(token);
        }

        public async Task<Result<IEnumerable<User>>> GetAllAsync()
        {
            try
            {
                var data = await _userRepository.GetAllAsync();

                return Result<IEnumerable<User>>.Success(data);
            }
            catch (Exception ex)
            {
                return Result<IEnumerable<User>>.Failure("An error occurred while getting travels.", ex.Message);
            }
        }
    }
}
