using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.VisualStudio.TestPlatform.TestHost;
using NUnit.Framework;
using RealEstate.Application.DTOs;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace RealEstate.Tests.Controllers
{
    [TestFixture]
    public class PropertiesControllerTests
    {
        private WebApplicationFactory<Program> _factory;
        private HttpClient _client;

        [OneTimeSetUp]
        public void OneTimeSetup()
        {
            // Initialize in-memory version of the API
            _factory = new WebApplicationFactory<Program>();
            _client = _factory.CreateClient();
        }

        [Test]
        public async Task GetProperties_Returns_Success_And_PaginatedResult()
        {
            // Arrange
            // No additional mock is needed because it is being tested with the seeded db.

            // Act
            var response = await _client.GetAsync("/api/v1/properties?pageSize=5");

            // Assert
            response.EnsureSuccessStatusCode();

            var jsonString = await response.Content.ReadAsStringAsync();

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                ReferenceHandler = ReferenceHandler.Preserve
            };

            var result = JsonSerializer.Deserialize<PaginatedResultDto<PropertyDto>>(jsonString, options);

            result.Should().NotBeNull();
            result.Items.Should().HaveCount(5);
            result.PageNumber.Should().Be(1);
            result.PageSize.Should().Be(5);
            result.TotalCount.Should().Be(50);
        }

        [OneTimeTearDown]
        public void OneTimeTearDown()
        {
            _client.Dispose();
            _factory.Dispose();
        }
    }
}