using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using TravelMapGuide.Server.Utilities.Helpers;
using TravelMapGuide.Server.Models;
using TravelMapGuide.Server.Services;
using TravelMapGuide.Server.Data.Entities;
using static System.Net.Mime.MediaTypeNames;

namespace TravelMapGuide.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TravelController : ControllerBase
    {
        private readonly ITravelService _travelService;
        private readonly ILogger<TravelController> _logger; // If you want logging somethings..
        private readonly IWebHostEnvironment _env;



        public TravelController(ITravelService travelService, ILogger<TravelController> logger, IWebHostEnvironment env)
        {
            _travelService = travelService;
            _logger = logger;
            _env = env;
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> TestForX()
        {
            return Ok(true);
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
        public async Task<IActionResult> Post([FromForm] CreateTravelModel model)
        {
            var user = JwtTokenReader.ReadUser();

            if (user.UserId != null)
            {
                model.UserId = user.UserId;
            }
            else
            {
                return Unauthorized("Kullanıcı kimliği bulunamadı.");
            }

            string imageUrl = null;
            if (model.Image != null && model.Image.Length > 0)
            {
                var fileName = Guid.NewGuid() + Path.GetExtension(model.Image.FileName);
                var imagePath = Path.Combine(_env.WebRootPath, "img", fileName); // wwwroot/img klasörüne yükleme

                using (var stream = new FileStream(imagePath, FileMode.Create))
                {
                    await model.Image.CopyToAsync(stream);
                }

                imageUrl = fileName; // URL'yi güncelle
            }


            model.ImageUrl = imageUrl;

            var data = await _travelService.CreateAsync(model);
            if (data.IsSuccess)
            {
                return Ok(data);
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

        //[Authorize]
        [HttpGet("[action]")]
        public async Task<IActionResult> GetTravelByUserId(string userId)
        {
            var result = await _travelService.GetByUserIdAsync(userId);
            if (!result.IsSuccess)
            {
                return BadRequest(result.Message);
            }

            return Ok(result.Data);
        }
    }
}
