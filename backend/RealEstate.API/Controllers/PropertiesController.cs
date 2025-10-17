using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using RealEstate.Application.DTOs;
using RealEstate.Application.Interfaces;

namespace RealEstate.API.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class PropertiesController : ControllerBase
    {
        private readonly IPropertyService _propertyService;

        public PropertiesController(IPropertyService propertyService)
        {
            _propertyService = propertyService;
        }

        /// <summary>
        /// Gets a paginated list of properties with optional filters.
        /// </summary>
        /// <param name="filter">Object with search and pagination filters.</param>
        /// <returns>A paginated list of properties.</returns>
        [HttpGet]
        [OutputCache]
        [ProducesResponseType(typeof(PaginatedResultDto<PropertyDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetProperties([FromQuery] PropertyFilterDto filter)
        {
            var result = await _propertyService.GetPropertiesAsync(filter);
            return Ok(result);
        }

        /// <summary>
        /// Gets the detail of a specific property by its ID.
        /// </summary>
        /// <param name="id">The property ID (MongoDB's ObjectId format).</param>
        /// <returns>The detail of the property.</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(PropertyDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetPropertyById(string id)
        {
            var propertyDto = await _propertyService.GetPropertyByIdAsync(id);

            if (propertyDto == null)
            {
                return NotFound();
            }

            return Ok(propertyDto);
        }
    }
}