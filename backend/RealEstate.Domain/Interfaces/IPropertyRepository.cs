using RealEstate.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RealEstate.Domain.Interfaces
{
    public interface IPropertyRepository
    {
        Task<(long totalCount, IReadOnlyList<Property> items)> GetPropertiesAsync(
            int pageNumber,
            int pageSize,
            string name,
            string address,
            decimal? minPrice,
            decimal? maxPrice);

        Task<Property> GetPropertyByIdAsync(string id);
        Task CreatePropertyAsync(Property property);
    }
}