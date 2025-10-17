
using FluentAssertions;
using FluentValidation.TestHelper;
using NUnit.Framework;
using RealEstate.Application.DTOs;
using RealEstate.Application.Features.Properties.Queries;

namespace RealEstate.Tests.Application.Features.Properties
{
    [TestFixture]
    public class PropertyFilterDtoValidatorTests
    {
        private PropertyFilterDtoValidator _validator;

        [SetUp]
        public void Setup()
        {
            _validator = new PropertyFilterDtoValidator();
        }

        [Test]
        public void Should_Not_Have_Errors_When_Filter_Is_Valid()
        {
            // Arrange
            var model = new PropertyFilterDto { PageNumber = 1, PageSize = 20, MinPrice = 100, MaxPrice = 200 };

            // Act
            var result = _validator.TestValidate(model);

            // Assert
            result.IsValid.Should().BeTrue();
        }

        [Test]
        public void Should_Have_Error_When_PageNumber_Is_Zero()
        {
            // Arrange
            var model = new PropertyFilterDto { PageNumber = 0 };

            // Act
            var result = _validator.TestValidate(model);

            // Assert
            result.ShouldHaveValidationErrorFor(x => x.PageNumber);
        }

        [Test]
        public void Should_Have_Error_When_MinPrice_Is_Greater_Than_MaxPrice()
        {
            // Arrange
            var model = new PropertyFilterDto { MinPrice = 500, MaxPrice = 100 };

            // Act
            var result = _validator.TestValidate(model);

            // Assert
            result.ShouldHaveValidationErrorFor(x => x.MinPrice)
                .WithErrorMessage("El precio mínimo no puede ser mayor que el precio máximo.");
        }
    }
}