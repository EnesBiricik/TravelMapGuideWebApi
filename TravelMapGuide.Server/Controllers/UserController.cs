using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using TravelMapGuide.Server.Models;
using TravelMapGuide.Server.Services;

namespace TravelMapGuide.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Register([FromBody] UserRegisterModel model)
        {
            var user = await _userService.RegisterUserAsync(model);
            if (user.IsSuccess)
            {
                return Ok(user);
            }
            return BadRequest(user);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Login([FromBody] UserLoginModel model)
        {
            var result = await _userService.LoginUserAsync(model);
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            return Unauthorized(result.Message);
         }

        //token refresh araştırması
        [Authorize]
        [HttpGet("[action]")]
        public async Task<IActionResult> Test()
        {
            var authHeader = HttpContext.Request.Headers["Authorization"].FirstOrDefault();
            if (authHeader != null && authHeader.StartsWith("Bearer "))
            {
                var token = authHeader.Substring("Bearer ".Length).Trim();
                var handler = new JwtSecurityTokenHandler();
                var jwtToken = handler.ReadJwtToken(token);

                var username = jwtToken.Claims.First(claim => claim.Type == ClaimTypes.Name).Value;
                var id = jwtToken.Claims.First(claim => claim.Type == "userId").Value;
                var role = jwtToken.Claims.First(claim => claim.Type == ClaimTypes.Role).Value;

                return Ok(new { Username = username });
            }

            return Unauthorized();
        }

        [Authorize]
        [HttpPut("[action]")]
        public async Task<IActionResult> Update([FromBody] UpdateUserModel model)
        {
            var userId = User.FindFirstValue("userId");
            if (userId != null)
            {
                model.UserId = userId;
            }

            var oldToken = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

            var result = await _userService.UpdateUserAsync(model, oldToken);
            if (result.IsSuccess)
            {
                return Ok(new
                {
                    User = result.Data.User,
                    Token = result.Data.Token
                });
            }
            return result.Data == null ? NotFound(result) : Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("[action]")]
        public async Task<IActionResult> RoleUpdate([FromBody] RoleUpdateModel model)
        {
            var result = await _userService.UpdateUserRoleAsync(model);
            if (result.IsSuccess)
            {
                return Ok(new
                {
                    User = result.Data.User,
                    Token = result.Data.Token
                });
            }
            return result.Data == null ? NotFound(result) : Ok(result);
        }

        [HttpDelete("[action]/{id}")]
        public async Task<ActionResult> Delete(string id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (id != userId)
            {
                return Forbid();
            }
            await _userService.DeleteAsync(id);
            return NoContent();
        }

        [Authorize]
        [HttpPost("[action]")]
        public async Task<IActionResult> Logout()
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            var result = await _userService.LogoutAsync(token);
            if (result)
            {
                return Ok("Çıkış yapıldı.");
            }
            return BadRequest("Çıkış yapılamadı.");
        }
    }
}
