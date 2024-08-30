namespace TravelMapGuide.Server.Data.Repositories.Abstract
{
    public interface IRepository<T>
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<IEnumerable<T>> GetAllAsync(int pageSize, int pageIndex, int pageCount);
        Task<T> GetByIdAsync(string id);
        Task<T> CreateAsync(T entity);
        Task<T> UpdateAsync(T entity);
        Task DeleteAsync(string id);
        Task<bool> IsExistById(string id);

    }
}
