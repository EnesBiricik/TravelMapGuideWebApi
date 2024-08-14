using Microsoft.AspNetCore.Mvc;
using TravelMapGuideWebApi.Server.Models;
using TravelMapGuideWebApi.Server.Services;

namespace TravelMapGuideWebApi.Server.Controllers
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

        [HttpPost("[action]")]
        public async Task<IActionResult> Post(CreateTravelModel model)
        {
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
    }
}
