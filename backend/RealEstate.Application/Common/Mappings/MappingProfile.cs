using AutoMapper;
using RealEstate.Application.DTOs;
using RealEstate.Domain.Entities;

namespace RealEstate.Application.Common.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Property, PropertyDto>();
        }
    }
}