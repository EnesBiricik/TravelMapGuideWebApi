using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using TravelMapGuide.Server.Utilities.Helpers;
using TravelMapGuide.Server.Models;
using TravelMapGuide.Server.Services;

namespace TravelMapGuide.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TravelController : ControllerBase
    {
        private readonly ITravelService _travelService;
        private readonly ILogger<TravelController> _logger; // If you want logging somethings..


        public TravelController(ITravelService travelService, ILogger<TravelController> logger)
        {
            _travelService = travelService;
            _logger = logger;
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> Get()
        {
            var data = await _travelService.GetAllAsync();
            if (data.IsSuccess)
            {

                return Ok(data);
            }
            return BadRequest(data);
        }

        [HttpGet("[action]/{id}")]
        public async Task<ActionResult> GetById(string id)
        {

            var data = await _travelService.GetByIdAsync(id);
            return data.Data == null ? NotFound(data) : Ok(data);
        }

        [Authorize]
        [HttpPost("[action]")]
        public async Task<IActionResult> Post(CreateTravelModel model)
        {

            //get userId with jwtreader
            var user = JwtTokenReader.ReadUser();

            if (user.UserId != null)
            {
                model.UserId = user.UserId;
            }
            else
            {
                return Unauthorized("Kullanıcı kimliği bulunamadı.");
            }

            var data = await _travelService.CreateAsync(model);
            if (data.IsSuccess)
            {
                return Ok();
            }

            return BadRequest(data.Message);
        }

        [HttpPut("[action]")]
        public async Task<ActionResult> Update(UpdateTravelModel model)
        {
            var data = await _travelService.UpdateAsync(model);
            if (data.IsSuccess)
            {
                return Ok(data);
            }
            return data.Data == null ? NotFound(data) : Ok(data);
        }

        [HttpDelete("[action]/{id}")]
        public async Task<ActionResult> Delete(string id)
        {
            await _travelService.DeleteAsync(id);
            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("[action]")]
        public async Task<IActionResult> Test()
        {
            var authHeader = HttpContext.Request.Headers["Authorization"].FirstOrDefault();
            if (authHeader != null && authHeader.StartsWith("Bearer "))
            {
                var token = authHeader.Substring("Bearer ".Length).Trim();

                // Token içeriğini incelemek için
                var handler = new JwtSecurityTokenHandler();
                var jwtToken = handler.ReadJwtToken(token);

                // Örnek: kullanıcı adını almak
                var username = jwtToken.Claims.First(claim => claim.Type == ClaimTypes.Name).Value;
                var id = jwtToken.Claims.First(claim => claim.Type == "userId").Value;
                var role = jwtToken.Claims.First(claim => claim.Type == ClaimTypes.Role).Value;

                return Ok(new { Username = username });
            }
            return Unauthorized();
        }
    }
}
