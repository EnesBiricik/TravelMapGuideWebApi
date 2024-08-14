using AutoMapper;
using FluentValidation;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using TravelMapGuideWebApi.Server.Data.Entities;
using TravelMapGuideWebApi.Server.Data.Repositories.Abstract;
using TravelMapGuideWebApi.Server.Data.Repositories.Concrete;
using TravelMapGuideWebApi.Server.Helpers;
using TravelMapGuideWebApi.Server.Models;

namespace TravelMapGuideWebApi.Server.Services
{
    public class UserService : IUserService
    {
        private readonly IValidator<UserRegisterModel> _createUserValidator;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly JwtTokenGenerator _tokenGenerator;


        public UserService(IUserRepository userRepository, IValidator<UserRegisterModel> createTravelValidator, IMapper mapper, JwtTokenGenerator jwtTokenGenerator)
        {
            _userRepository = userRepository;
            _createUserValidator = createTravelValidator;
            _mapper = mapper; // entegre edilecek
            _tokenGenerator = jwtTokenGenerator;
        }

        public async Task<Result<TokenResponseModel>> LoginUserAsync(UserLoginModel model)
        {
            var user = await _userRepository.GetUserByUsernameAsync(model.Username);

            if (user == null || !VerifyPassword(model.Password, user.Password))
            {
                return Result<TokenResponseModel>.Failure("Invalid username or password.");
            }

            if (user!= null)
            {
                var token = _tokenGenerator.GenerateToken(user.Username);
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


            var passwordHash = HashPassword(model.Password);

            var user = new User
            {
                Username = model.Username,
                Password = passwordHash,
                Email = model.Email
            };

            var result = await _userRepository.CreateAsync(user);
            if (result != null)
            {
                return Result<User>.Success(result, "User is Created.");
            }
            return Result.Failure("An error occurred while creating the user.");

        }

        public async Task<Result<User>> UpdateUserAsync(UpdateUserModel model)
        {
            var user = await _userRepository.GetByIdAsync(model.UserId);
            if (user == null)
            {
                return Result<User>.Failure("User not found");
            }

            if (!VerifyPassword(model.OldPassword, user.Password))
            {
                return Result<User>.Failure("Old password is incorrect");
            }

            if (model.NewPassword != model.ConfirmNewPassword)
            {
                return Result<User>.Failure("New password and confirmation password do not match");
            }

            if (!string.IsNullOrEmpty(model.NewPassword))
            {
                user.Password = HashPassword(model.NewPassword);
            }

            if (!string.IsNullOrEmpty(model.Username) && model.Username != user.Username)
            {
                var isExist = await _userRepository.GetUserByUsernameAsync(model.Username);
                if (isExist!= null)
                {
                    return Result<User>.Failure("Username already exists");
                }
                user.Username = model.Username;
            }

            // E-posta adresi değişikliği kontrolü
            if (!string.IsNullOrEmpty(model.Email) && model.Email != user.Email)
            {
                var isExist = await _userRepository.GetUserByEmailAsync(model.Username);
                if (isExist != null)
                {
                    return Result<User>.Failure("Email already exists");
                }
                user.Email = model.Email;
            }

            // Kullanıcıyı güncelle
            var updateResult = await _userRepository.UpdateAsync(user);
            if (updateResult != null)
            {
                return Result<User>.Success(updateResult);
            }

            return Result<User>.Failure("Failed to update user");
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

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashBytes);
        }

        private bool VerifyPassword(string password, string storedHash)
        {
            var hash = HashPassword(password);
            return hash == storedHash;
        }
    }
}
