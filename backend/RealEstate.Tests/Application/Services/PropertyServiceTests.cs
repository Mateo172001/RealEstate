using AutoMapper;
using FluentAssertions;
using Moq;
using NUnit.Framework;
using RealEstate.Application.DTOs;
using RealEstate.Application.Services;
using RealEstate.Domain.Entities;
using RealEstate.Domain.Interfaces;

namespace RealEstate.Tests.Application.Services
{
    [TestFixture]
    public class PropertyServiceTests
    {
        private Mock<IPropertyRepository> _mockRepo;
        private Mock<IMapper> _mockMapper;
        private PropertyService _service;

        [SetUp]
        public void Setup()
        {
            // Simulations of dependencies
            _mockRepo = new Mock<IPropertyRepository>();
            _mockMapper = new Mock<IMapper>();

            _service = new PropertyService(_mockRepo.Object, _mockMapper.Object);
        }

        [Test]
        public async Task GetPropertyByIdAsync_Should_Return_PropertyDto_When_Property_Exists()
        {
            // Arrange
            var propertyId = "some-id";
            var propertyEntity = new Property { Id = propertyId, Name = "Test Property" };
            var propertyDto = new PropertyDto { Id = propertyId, Name = "Test Property" };

            _mockRepo.Setup(r => r.GetPropertyByIdAsync(propertyId)).ReturnsAsync(propertyEntity);

            _mockMapper.Setup(m => m.Map<PropertyDto>(propertyEntity)).Returns(propertyDto);

            // Act
            var result = await _service.GetPropertyByIdAsync(propertyId);

            // Assert
            result.Should().NotBeNull();
            result.Should().BeEquivalentTo(propertyDto);
            _mockRepo.Verify(r => r.GetPropertyByIdAsync(propertyId), Times.Once);
        }

        [Test]
        public async Task GetPropertyByIdAsync_Should_Return_Null_When_Property_Does_Not_Exist()
        {
            // Arrange
            var propertyId = "non-existent-id";
            _mockRepo.Setup(r => r.GetPropertyByIdAsync(propertyId)).ReturnsAsync((Property)null);

            // Act
            var result = await _service.GetPropertyByIdAsync(propertyId);

            // Assert
            result.Should().BeNull();
        }

        [Test]
        public async Task GetPropertiesAsync_Should_Return_Paginated_Result()
        {
            // Arrange
            var filter = new PropertyFilterDto { PageNumber = 1, PageSize = 10 };
            var properties = new List<Property> { new Property { Id = "1", Name = "Prop1" } };
            var propertyDtos = new List<PropertyDto> { new PropertyDto { Id = "1", Name = "Prop1" } };
            var totalCount = 1L;

            // setting mocks
            _mockRepo.Setup(r => r.GetPropertiesAsync(filter.PageNumber, filter.PageSize, null, null, null, null))
                .ReturnsAsync((totalCount, properties));
            _mockMapper.Setup(m => m.Map<List<PropertyDto>>(properties)).Returns(propertyDtos);

            // Act
            var result = await _service.GetPropertiesAsync(filter);

            // Assert
            result.Should().NotBeNull();
            result.Items.Should().HaveCount(1);
            result.TotalCount.Should().Be(totalCount);
            result.Items.First().Name.Should().Be("Prop1");
        }
    }
}