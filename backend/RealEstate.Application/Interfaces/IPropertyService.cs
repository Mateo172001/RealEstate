using RealEstate.Application.DTOs;
using System.Threading.Tasks;

namespace RealEstate.Application.Interfaces
{
    public interface IPropertyService
    {
        Task<PaginatedResultDto<PropertyDto>> GetPropertiesAsync(PropertyFilterDto filter);
        Task<PropertyDto?> GetPropertyByIdAsync(string id);
    }
}