using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using TravelMapGuide.Server.Utilities.Helpers;
using TravelMapGuide.Server.Models;
using TravelMapGuide.Server.Services;
using TravelMapGuide.Server.Data.Entities;
using static System.Net.Mime.MediaTypeNames;
using Microsoft.IdentityModel.Tokens;

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
                return Unauthorized("User ID not found.");
            }

            var data = await _travelService.CreateAsync(model);
            if (data.IsSuccess)
            {
                return Ok(data);
            }

            return BadRequest(data.Message);
        }

        [Authorize]
        [HttpPut("[action]")]
        public async Task<ActionResult> Update(UpdateTravelModel model)
        {
            var user = JwtTokenReader.ReadUser();
            if (string.IsNullOrEmpty(user.UserId))
            {
                return Unauthorized("You do not have access permission.");
            }

            var result = await _travelService.UpdateAsync(model);
            if (result.IsSuccess)
            {
                return Ok(result);
            }
            return result.Data == null ? NotFound(result) : Ok(result);
        }

        [Authorize]
        [HttpDelete("[action]/{id}")]
        public async Task<ActionResult> Delete(string id)
        {
            var user = JwtTokenReader.ReadUser();
            if (string.IsNullOrEmpty(user.UserId) || (!string.IsNullOrEmpty(user.UserId) && user.UserId != id))
            {
                return Unauthorized("You do not have access permission.");
            }
            await _travelService.DeleteAsync(id);
            return NoContent();
        }

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
