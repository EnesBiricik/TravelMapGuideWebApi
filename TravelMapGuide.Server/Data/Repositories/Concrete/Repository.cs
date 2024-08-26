using MongoDB.Driver;
using TravelMapGuideWebApi.Server.Data.Context;
using TravelMapGuideWebApi.Server.Data.Entities;
using TravelMapGuideWebApi.Server.Data.Repositories.Abstract;

namespace TravelMapGuideWebApi.Server.Data.Repositories.Concrete
{
    public class Repository<T, TCollectionName> : IRepository<T> where T : BaseEntity
    {
        protected readonly IMongoCollection<T> _collection;
        public Repository(MongoDbService mongoDbService, TCollectionName collectionName)
        {
            var collectionNameStr = collectionName as string;
            if (collectionNameStr == null)
            {
                throw new ArgumentException("Collection name must be a string.");
            }
            _collection = mongoDbService.Database.GetCollection<T>(collectionNameStr);
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _collection.Find(_ => true).ToListAsync();
        }

        public async Task<T> GetByIdAsync(string id)
        {
            return await _collection.Find(x => x.Id == id).FirstOrDefaultAsync();
        }

        public async Task<T> CreateAsync(T entity)
        {
            await _collection.InsertOneAsync(entity);
            return entity;
        }

        public async Task<T> UpdateAsync(T entity)
        {
            await _collection.ReplaceOneAsync(x => x.Id == entity.Id, entity);
            return entity;
        }

        public async Task DeleteAsync(string id)
        {
            await _collection.DeleteOneAsync(x => x.Id == id);
        }

        public Task<IEnumerable<T>> GetAllAsync(int pageSize, int pageIndex, int pageCount)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> IsExistById(string id)
        {
            var result = await _collection.CountDocumentsAsync(x => x.Id == id);

            return result > 0;
        }
    }
}
