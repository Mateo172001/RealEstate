using AutoMapper;
using RealEstate.Application.DTOs;
using RealEstate.Application.Interfaces;
using RealEstate.Domain.Interfaces;
using System.Linq;
using System.Threading.Tasks;

namespace RealEstate.Application.Services
{
    public class PropertyService : IPropertyService
    {
        private readonly IPropertyRepository _propertyRepository;
        private readonly IMapper _mapper;

        public PropertyService(IPropertyRepository propertyRepository, IMapper mapper)
        {
            _propertyRepository = propertyRepository;
            _mapper = mapper;
        }

        public async Task<PropertyDto?> GetPropertyByIdAsync(string id)
        {
            var property = await _propertyRepository.GetPropertyByIdAsync(id);
            if (property == null)
            {
                return null;
            }
            return _mapper.Map<PropertyDto>(property);
        }

        public async Task<PaginatedResultDto<PropertyDto>> GetPropertiesAsync(PropertyFilterDto filter)
        {
            
            var (totalCount, properties) = await _propertyRepository.GetPropertiesAsync(
                filter.PageNumber,
                filter.PageSize,
                filter.Name,
                filter.Address,
                filter.MinPrice,
                filter.MaxPrice);

            var propertyDtos = _mapper.Map<List<PropertyDto>>(properties);

            return new PaginatedResultDto<PropertyDto>(propertyDtos, totalCount, filter.PageNumber, filter.PageSize);
        }
    }
}