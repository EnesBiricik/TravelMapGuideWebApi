using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using TravelMapGuideWebApi.Server.Constants;
using TravelMapGuideWebApi.Server.Data.Context;
using TravelMapGuideWebApi.Server.Data.Entities;
using TravelMapGuideWebApi.Server.Data.Repositories.Abstract;
using TravelMapGuideWebApi.Server.Models.Travel;
using TravelMapGuideWebApi.Server.Services;

namespace TravelMapGuideWebApi.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TravelController : ControllerBase
    {
        private readonly ITravelService _travelService;
        public TravelController(ITravelService travelService)
        {
            _travelService = travelService;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var result = await _travelService.GetAllAsync();
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            return BadRequest(result.Message);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult> GetById(string id)
        {
            var data = _travelService.GetByIdAsync(id);
            return data == null ? NotFound() : Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Post(CreateTravelModel model)
        {
            var result = await _travelService.CreateAsync(model);
            if (result.IsSuccess)
            {
                return Ok();
            }
            return BadRequest(result.Message);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(string id, UpdateTravelModel model)
        {
            await _travelService.UpdateAsync(model);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(string id)
        {
            await _travelService.DeleteAsync(id);
            return NoContent();
        }
    }
}
