using Microsoft.AspNetCore.Mvc;
using TravelMapGuideWebApi.Server.Models;
using TravelMapGuideWebApi.Server.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TravelMapGuideWebApi.Server.Controllers
{
    [Route("api/travel")]
    [ApiController]
    public class TravelController : ControllerBase
    {
        private readonly TravelServices _travelservices;
        public TravelController(TravelServices services)
        {
            _travelservices = services;
        }

        // GET: api/travel
        [HttpGet]
        public async Task<List<Travel>> Get() => await _travelservices.GetAsync();

        // GET api/travel/66ab7a02f8bc81f29a076150
        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<Travel>> Get(string id)
        {
            Travel travel = await _travelservices.GetAsync(id);
            if (travel == null)
            {
                return NotFound();
            }

            return travel;
        }

        // POST api/travel
        [HttpPost]
        public async Task<ActionResult<Travel>> Post(Travel newTravel)
        {
            // `Id` alanını model durumundan çıkarıyoruz.
            ModelState.Remove(nameof(newTravel.Id));

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _travelservices.CreateAsync(newTravel);
            return CreatedAtAction(nameof(Get), new { id = newTravel.Id }, newTravel);
        }

        // PUT api/travel/66ab7a02f8bc81f29a076150
        [HttpPut("{id:length(24)}")]
        public async Task<ActionResult> Put(string id, Travel updateStudent)
        {
            Travel travel = await _travelservices.GetAsync(id);
            if (travel == null)
            {
                return NotFound("There is no student with this id: " + id);
            }

            updateStudent.Id = travel.Id;

            await _travelservices.UpdateAsync(id, updateStudent);

            return Ok("Updated Successfully");
        }

        // DELETE api/travel/66ab7a02f8bc81f29a076150f
        [HttpDelete("{id:length(24)}")]
        public async Task<ActionResult> Delete(string id)
        {
            Travel travel = await _travelservices.GetAsync(id);
            if (travel == null)
            {
                return NotFound("There is no student with this id: " + id);
            }

            await _travelservices.RemoveAsync(id);

            return Ok("Deleted Successfully");
        }
    }
}
