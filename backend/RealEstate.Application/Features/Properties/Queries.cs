using FluentValidation;
using RealEstate.Application.DTOs;

namespace RealEstate.Application.Features.Properties.Queries
{
    public class PropertyFilterDtoValidator : AbstractValidator<PropertyFilterDto>
    {
        public PropertyFilterDtoValidator()
        {
            RuleFor(x => x.PageNumber)
                .GreaterThan(0).WithMessage("El número de página debe ser mayor que cero.");

            RuleFor(x => x.PageSize)
                .GreaterThan(0).WithMessage("El tamaño de página debe ser mayor que cero.");

            RuleFor(x => x.MinPrice)
                .LessThan(x => x.MaxPrice)
                .When(x => x.MinPrice.HasValue && x.MaxPrice.HasValue)
                .WithMessage("El precio mínimo no puede ser mayor que el precio máximo.");
        }
    }
}