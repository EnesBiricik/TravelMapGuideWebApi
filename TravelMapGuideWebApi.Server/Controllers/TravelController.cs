using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using TravelMapGuideWebApi.Server.Constants;
using TravelMapGuideWebApi.Server.Data.Context;
using TravelMapGuideWebApi.Server.Data.Entities;

namespace TravelMapGuideWebApi.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TravelController : ControllerBase
    {
        private readonly IMongoCollection<Travel> _travels;
        public TravelController(MongoDbService mongoDbService)
        {
            _travels = mongoDbService.Database.GetCollection<Travel>(CollectionNames.Travels);
        }

        [HttpGet]
        public async Task<IEnumerable<Travel>> Get()
        {
            return await _travels.Find(FilterDefinition<Travel>.Empty).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> Get(string id)
        {
            var filter = Builders<Travel>.Filter.Eq(x => x.Id, id);
            var data = _travels.Find(filter).FirstOrDefault();
            return data == null ? NotFound() : Ok(data);
        }

        [HttpPost]
        public async Task<ActionResult> Post(Travel model)
        {
            await _travels.InsertOneAsync(model);
            return CreatedAtAction(nameof(Get),new { id= model.Id },model);
        }

        [HttpPut]
        public async Task<ActionResult> Update(Travel model)
        {
            await _travels.ReplaceOneAsync(x => x.Id == model.Id, model);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(string id)
        {
            await _travels.DeleteOneAsync(x => x.Id == id);
            return NoContent();
        }
    }
}
