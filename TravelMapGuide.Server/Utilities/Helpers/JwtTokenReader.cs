using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using TravelMapGuide.Server.Models.Jwt;

namespace TravelMapGuide.Server.Utilities.Helpers
{
    public static class JwtTokenReader
    {
        private static IHttpContextAccessor _httpContextAccessor;

        public static void Initialize(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public static ClaimTokenResponseModel ReadUser()
        {
            var context = _httpContextAccessor?.HttpContext;
            if (context == null) return null;

            var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
            if (authHeader != null && authHeader.StartsWith("Bearer "))
            {
                var token = authHeader.Substring("Bearer ".Length).Trim();

                var handler = new JwtSecurityTokenHandler();
                var jwtToken = handler.ReadJwtToken(token);

                var username = jwtToken.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.Name)?.Value;
                var userId = jwtToken.Claims.FirstOrDefault(claim => claim.Type == "userId")?.Value;
                var roleName = jwtToken.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.Role)?.Value;
                var userImg = jwtToken.Claims.FirstOrDefault(claim => claim.Type == "userImg")?.Value;

                return new ClaimTokenResponseModel
                {
                    UserName = username,
                    UserId = userId,
                    RoleName = roleName,
                    UserImg = userImg,
                };
            }
            return null;
        }
    }

}
