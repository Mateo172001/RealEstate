# Backend - Real Estate API

A scalable, production-ready RESTful API built with .NET 8 Web API and MongoDB. Implements Clean Architecture, CQRS patterns, and modern backend best practices.

## Table of Contents

- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Clean Architecture Implementation](#clean-architecture-implementation)
- [Best Practices](#best-practices)
- [API Documentation](#api-documentation)
- [Performance Optimizations](#performance-optimizations)
- [Testing](#testing)

## Technology Stack

### Core Framework
- **.NET 8** - Latest LTS version with improved performance
- **ASP.NET Core Web API** - RESTful API framework
- **C# 12** - Modern language features

### Database
- **MongoDB 7.x** - NoSQL database for flexible document storage
- **MongoDB.Driver** - Official .NET driver

### Libraries & Tools
- **AutoMapper** - Object-to-object mapping
- **Bogus** - Realistic fake data generation
- **Serilog** - Structured logging
- **Swagger/OpenAPI** - API documentation
- **AspNetCore.HealthChecks** - Health monitoring

### Patterns & Features
- **Clean Architecture** - Layered architecture with dependency inversion
- **Repository Pattern** - Data access abstraction
- **CQRS Pattern** - Command Query Responsibility Segregation
- **Dependency Injection** - Built-in IoC container
- **API Versioning** - Version management with Asp.Versioning
- **Rate Limiting** - Request throttling
- **Response Compression** - Brotli and Gzip
- **CORS** - Cross-Origin Resource Sharing configuration

## Architecture

### Clean Architecture Layers

```
┌─────────────────────────────────────────┐
│         API Layer (Presentation)        │
│         RealEstate.API                  │
│    Controllers, Middleware, Program.cs  │
└──────────────────┬──────────────────────┘
                   │ depends on
                   ▼
┌─────────────────────────────────────────┐
│       Application Layer (Use Cases)     │
│       RealEstate.Application            │
│    Services, DTOs, Interfaces, CQRS     │
└──────────────────┬──────────────────────┘
                   │ depends on
                   ▼
┌─────────────────────────────────────────┐
│      Domain Layer (Business Logic)      │
│         RealEstate.Domain               │
│      Entities, Interfaces, Rules        │
└─────────────────────────────────────────┘
                   ▲
                   │ implements
┌──────────────────┴──────────────────────┐
│    Infrastructure Layer (Data Access)   │
│      RealEstate.Infrastructure          │
│  Repositories, MongoDB, Persistence     │
└─────────────────────────────────────────┘
```

### Dependency Rule

Dependencies flow **inward**:
- API → Application → Domain ← Infrastructure
- Domain has no dependencies
- Infrastructure implements Domain interfaces
- Application orchestrates use cases

## Project Structure

```
backend/
├── RealEstate.API/                    # Presentation Layer
│   ├── Controllers/
│   │   └── PropertiesController.cs   # API endpoints
│   ├── Middleware/
│   │   └── GlobalExceptionHandlerMiddleware.cs
│   ├── Program.cs                     # Application entry point
│   ├── appsettings.json              # Configuration
│   └── Dockerfile.prod               # Production container
│
├── RealEstate.Application/           # Application Layer
│   ├── Services/
│   │   └── PropertyService.cs       # Business logic
│   ├── Interfaces/
│   │   └── IPropertyService.cs      # Service contracts
│   ├── DTOs/
│   │   ├── PropertyDto.cs          # Data transfer objects
│   │   ├── PropertyFilterDto.cs
│   │   └── PaginatedResultDto.cs
│   ├── Common/
│   │   └── Mappings/
│   │       └── MappingProfile.cs   # AutoMapper profiles
│   └── DependencyInjection.cs      # Service registration
│
├── RealEstate.Domain/                # Domain Layer
│   ├── Entities/
│   │   └── Property.cs              # Domain entities
│   └── Interfaces/
│       └── IPropertyRepository.cs   # Repository contracts
│
├── RealEstate.Infrastructure/        # Infrastructure Layer
│   ├── Repositories/
│   │   └── PropertyRepository.cs   # MongoDB implementation
│   ├── Configuration/
│   │   └── MongoDbSettings.cs     # DB configuration
│   ├── Data/
│   │   └── PropertySeeder.cs      # Database seeding
│   ├── Persistence/
│   │   └── MongoDbClassMapper.cs  # MongoDB mappings
│   └── DependencyInjection.cs     # Infrastructure services
│
└── RealEstate.Tests/                # Test Project
    ├── Application/
    ├── Controllers/
    └── RealEstate.Tests.csproj
```

## Getting Started

### Prerequisites

- .NET 8 SDK
- MongoDB 7.x (or Docker)

### Running Locally

```bash
# Navigate to API project
cd backend/RealEstate.API

# Restore dependencies
dotnet restore

# Update appsettings.json with MongoDB connection
# Then run the application
dotnet run

# API available at: http://localhost:5000
# Swagger UI: http://localhost:5000/swagger
```

### Running with Docker

```bash
# From the backend directory
docker build -t realestate-api -f RealEstate.API/Dockerfile.prod .

# Run container
docker run -p 8080:80 \
  -e MongoDbSettings:ConnectionString=mongodb://mongodb:27017 \
  realestate-api
```

### Using Docker Compose (Recommended)

```bash
# From project root
docker-compose up

# API available at: http://localhost:8080
# Swagger: http://localhost:8080/swagger
```

## Clean Architecture Implementation

### Domain Layer (Core Business Logic)

**RealEstate.Domain** - The heart of the application

```csharp
// Entities/Property.cs
public class Property
{
    public string Id { get; set; }
    public string IdOwner { get; set; }
    public string Name { get; set; }
    public string Address { get; set; }
    public decimal Price { get; set; }
    public string ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; }
}

// Interfaces/IPropertyRepository.cs
public interface IPropertyRepository
{
    Task<(long totalCount, IReadOnlyList<Property> items)> GetPropertiesAsync(...);
    Task<Property> GetPropertyByIdAsync(string id);
}
```

**Characteristics:**
- No dependencies on other projects
- Contains business entities
- Defines repository contracts
- Framework-agnostic
- Highly testable

### Application Layer (Use Cases)

**RealEstate.Application** - Business logic orchestration

```csharp
// Services/PropertyService.cs
public class PropertyService : IPropertyService
{
    private readonly IPropertyRepository _repository;
    private readonly IMapper _mapper;
    
    public async Task<PaginatedResultDto<PropertyDto>> GetPropertiesAsync(PropertyFilterDto filter)
    {
        var (totalCount, properties) = await _repository.GetPropertiesAsync(...);
        var dtos = _mapper.Map<List<PropertyDto>>(properties);
        return new PaginatedResultDto<PropertyDto>(dtos, totalCount, ...);
    }
}
```

**Characteristics:**
- Depends only on Domain layer
- Uses DTOs for data transfer
- Implements AutoMapper for object mapping
- Contains no infrastructure details

### Infrastructure Layer (Data Access)

**RealEstate.Infrastructure** - External concerns implementation

```csharp
// Repositories/PropertyRepository.cs
public class PropertyRepository : IPropertyRepository
{
    private readonly IMongoCollection<Property> _collection;
    
    public async Task<(long, IReadOnlyList<Property>)> GetPropertiesAsync(...)
    {
        var filter = BuildMongoFilter(name, address, minPrice, maxPrice);
        var totalCount = await _collection.CountDocumentsAsync(filter);
        var items = await _collection.Find(filter)
            .Sort(Builders<Property>.Sort.Descending(p => p.CreatedAt))
            .Skip((pageNumber - 1) * pageSize)
            .Limit(pageSize)
            .ToListAsync();
        
        return (totalCount, items);
    }
}
```

**Characteristics:**
- Implements Domain interfaces
- MongoDB-specific code isolated here
- Index creation for performance
- Pagination and filtering logic

### API Layer (Presentation)

**RealEstate.API** - HTTP API endpoints

```csharp
// Controllers/PropertiesController.cs
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class PropertiesController : ControllerBase
{
    private readonly IPropertyService _service;
    
    [HttpGet]
    [OutputCache]
    public async Task<IActionResult> GetProperties([FromQuery] PropertyFilterDto filter)
    {
        var result = await _service.GetPropertiesAsync(filter);
        return Ok(result);
    }
}
```

**Characteristics:**
- Thin controllers (delegates to service)
- API versioning enabled
- Output caching configured
- Swagger documentation

## Best Practices

### 1. Dependency Injection

**Service Registration Pattern**

Each layer registers its own dependencies:

```csharp
// Application/DependencyInjection.cs
public static IServiceCollection AddApplicationServices(this IServiceCollection services)
{
    services.AddAutoMapper(Assembly.GetExecutingAssembly());
    services.AddScoped<IPropertyService, PropertyService>();
    return services;
}

// Infrastructure/DependencyInjection.cs
public static IServiceCollection AddInfrastructureServices(
    this IServiceCollection services, 
    IConfiguration configuration)
{
    services.Configure<MongoDbSettings>(configuration.GetSection("MongoDbSettings"));
    services.AddScoped<IPropertyRepository, PropertyRepository>();
    return services;
}
```

**Benefits:**
- Clear service boundaries
- Easy to swap implementations
- Testable with mocks

### 2. Repository Pattern

**Interface Definition (Domain Layer)**
```csharp
public interface IPropertyRepository
{
    Task<Property> GetPropertyByIdAsync(string id);
    Task<(long totalCount, IReadOnlyList<Property>)> GetPropertiesAsync(...);
}
```

**Implementation (Infrastructure Layer)**
```csharp
public class PropertyRepository : IPropertyRepository
{
    // MongoDB-specific implementation
}
```

**Benefits:**
- Database abstraction
- Easy to switch to SQL Server, PostgreSQL, etc.
- Testable without database

### 3. DTO Pattern

**Separation of Concerns**

```csharp
// Domain Entity (Database)
public class Property { ... }  // Internal representation

// DTO (API Response)
public class PropertyDto { ... }  // External representation

// AutoMapper
CreateMap<Property, PropertyDto>();
```

**Benefits:**
- API contract independent from database schema
- Can add/remove fields without breaking database
- Security (don't expose internal IDs, etc.)

### 4. Global Exception Handling

**Middleware Pattern**

```csharp
public class GlobalExceptionHandlerMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception");
            await HandleExceptionAsync(context, ex);
        }
    }
}
```

**Benefits:**
- Centralized error handling
- Consistent error responses
- Proper logging
- No try-catch in every controller

### 5. Configuration Pattern

**Strongly Typed Configuration**

```csharp
// Configuration/MongoDbSettings.cs
public class MongoDbSettings
{
    public string ConnectionString { get; set; }
    public string DatabaseName { get; set; }
    public string CollectionName { get; set; }
}

// Registration
services.Configure<MongoDbSettings>(configuration.GetSection("MongoDbSettings"));

// Usage
public PropertyRepository(IOptions<MongoDbSettings> settings)
{
    var mongoClient = new MongoClient(settings.Value.ConnectionString);
}
```

**Benefits:**
- Type-safe configuration
- IntelliSense support
- Compile-time validation

### 6. Database Indexing

**Performance-Critical Indexes**

```csharp
private void CreateIndexes()
{
    // Text search on Name and Address
    var textIndex = Builders<Property>.IndexKeys
        .Text(p => p.Name)
        .Text(p => p.Address);
    
    // Range queries on Price
    var priceIndex = Builders<Property>.IndexKeys
        .Ascending(p => p.Price);
    
    // Filter by Owner
    var ownerIndex = Builders<Property>.IndexKeys
        .Ascending(p => p.IdOwner);
    
    _collection.Indexes.CreateMany(new[] { textIndex, priceIndex, ownerIndex });
}
```

**Benefits:**
- Fast text search
- Efficient price range queries
- Optimized pagination

## API Documentation

### Endpoints

#### GET `/api/v1/Properties`

Get paginated list of properties with optional filters.

**Query Parameters:**
- `PageNumber` (int, optional): Page number (default: 1)
- `PageSize` (int, optional): Items per page (default: 10)
- `Name` (string, optional): Filter by property name
- `Address` (string, optional): Filter by address/location
- `MinPrice` (decimal, optional): Minimum price
- `MaxPrice` (decimal, optional): Maximum price

**Response:**
```json
{
  "items": [
    {
      "id": "string",
      "idOwner": "string",
      "name": "string",
      "address": "string",
      "price": 0,
      "imageUrl": "string"
    }
  ],
  "pageNumber": 1,
  "pageSize": 10,
  "totalCount": 50,
  "totalPages": 5,
  "hasPreviousPage": false,
  "hasNextPage": true
}
```

#### GET `/api/v1/Properties/{id}`

Get a specific property by ID.

**Response:**
```json
{
  "id": "670b8f...",
  "idOwner": "owner-123",
  "name": "Luxury Villa",
  "address": "123 Main St, New York",
  "price": 850000,
  "imageUrl": "/images/properties/property-1.jpg"
}
```

#### GET `/health`

Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "Healthy",
  "checks": {
    "mongodb-check": "Healthy"
  }
}
```

### Swagger Documentation

Access interactive API documentation at:
```
http://localhost:8080/swagger
```

## Clean Architecture Implementation

### Dependency Inversion Principle

**High-level modules don't depend on low-level modules:**

```csharp
// ✓ CORRECT: Controller depends on interface (Application layer)
public class PropertiesController : ControllerBase
{
    private readonly IPropertyService _service;  // Interface dependency
}

// ✗ INCORRECT: Controller depends on concrete implementation
public class PropertiesController : ControllerBase
{
    private readonly PropertyRepository _repository;  // Concrete dependency
}
```

### Separation of Concerns

**Each layer has a single responsibility:**

1. **Domain**: Business rules and entities
2. **Application**: Use case orchestration
3. **Infrastructure**: External services (DB, file system, etc.)
4. **API**: HTTP concerns (routing, serialization, etc.)

### Example: Get Properties Flow

```
1. HTTP Request → PropertiesController
   ↓
2. Controller → IPropertyService (Application)
   ↓
3. PropertyService → IPropertyRepository (Domain interface)
   ↓
4. PropertyRepository → MongoDB (Infrastructure implementation)
   ↓
5. Results mapped → PropertyDto (Application)
   ↓
6. Response → Client
```

**Benefits:**
- Easy to test each layer
- Easy to swap implementations (MongoDB → SQL Server)
- Business logic independent of framework
- Clear boundaries and responsibilities

## Best Practices

### 1. SOLID Principles

#### Single Responsibility Principle
```csharp
// PropertyService: Only business logic
// PropertyRepository: Only data access
// PropertiesController: Only HTTP handling
```

#### Open/Closed Principle
```csharp
// Easy to extend without modifying:
public interface IPropertyRepository
{
    Task<Property> GetPropertyByIdAsync(string id);
}

// Add new methods without breaking existing code
public interface IPropertyRepository
{
    Task<Property> GetPropertyByIdAsync(string id);
    Task<List<Property>> GetPropertiesByOwnerAsync(string ownerId);  // New
}
```

#### Dependency Inversion Principle
```csharp
// High-level module (Service)
public class PropertyService
{
    private readonly IPropertyRepository _repository;  // Depends on abstraction
}

// Low-level module (Repository)
public class PropertyRepository : IPropertyRepository  // Implements abstraction
{
    // MongoDB details here
}
```

### 2. Repository Pattern

**Abstraction Over Data Access**

```csharp
// Interface in Domain (no MongoDB references)
public interface IPropertyRepository
{
    Task<Property> GetPropertyByIdAsync(string id);
}

// Implementation in Infrastructure (MongoDB-specific)
public class PropertyRepository : IPropertyRepository
{
    private readonly IMongoCollection<Property> _collection;
    
    public async Task<Property> GetPropertyByIdAsync(string id)
    {
        return await _collection.Find(p => p.Id == id).FirstOrDefaultAsync();
    }
}
```

**Benefits:**
- Database technology can change without affecting business logic
- Easy to create in-memory repository for testing
- Clean separation of data access concerns

### 3. DTO Pattern

**Why DTOs?**

```csharp
// Domain Entity (internal)
public class Property
{
    public string Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    // ... internal fields
}

// DTO (external API contract)
public class PropertyDto
{
    public string Id { get; set; }
    // Only expose what API clients need
}
```

**Benefits:**
- API contract independent from database schema
- Can modify internal structure without breaking API
- Security (hide sensitive fields)
- Flexibility (combine multiple entities)

### 4. Middleware Pipeline

**Correct Order Matters**

```csharp
// Program.cs - Middleware pipeline order
app.UseMiddleware<GlobalExceptionHandlerMiddleware>();  // First: catch all errors

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
}

app.UseCors(MyAllowSpecificOrigins);  // Early: handle CORS
app.UseResponseCompression();
app.UseRateLimiter();
app.UseSerilogRequestLogging();
app.UseOutputCache();
app.UseAuthorization();

app.MapControllers();  // Last: routing
```

**Key Points:**
- Exception handler first to catch all errors
- CORS before other middleware to handle preflight requests
- Authentication/Authorization before controllers
- Order affects request processing

### 5. Database Seeding

**Production-Safe Seeding**

```csharp
public static class PropertySeeder
{
    public static async Task SeedAsync(IMongoCollection<Property> collection)
    {
        // Only seed if collection is empty
        if (await collection.CountDocumentsAsync(FilterDefinition<Property>.Empty) > 0)
        {
            return;
        }
        
        // Generate realistic data with Bogus
        var propertyFaker = new Faker<Property>()
            .RuleFor(p => p.Name, f => f.Address.City() + " Heights")
            .RuleFor(p => p.Price, f => f.Finance.Amount(150000, 2000000));
        
        var properties = propertyFaker.Generate(50);
        await collection.InsertManyAsync(properties);
    }
}
```

**Benefits:**
- Idempotent (safe to run multiple times)
- Realistic test data
- Fast development setup

### 6. API Versioning

**Version Management**

```csharp
// Configuration
builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true;
});

// Controller
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class PropertiesController : ControllerBase
```

**Benefits:**
- Backward compatibility
- Gradual migration paths
- Multiple API versions can coexist

### 7. Health Checks

**Production Monitoring**

```csharp
builder.Services.AddHealthChecks()
    .AddMongoDb(
        sp => new MongoClient(connectionString),
        name: "mongodb-check",
        failureStatus: HealthStatus.Unhealthy
    );

app.MapHealthChecks("/health");
```

**Usage:**
```bash
curl http://localhost:8080/health

# Response
{
  "status": "Healthy",
  "checks": { "mongodb-check": "Healthy" }
}
```

## Performance Optimizations

### 1. Output Caching

**Controller-Level Caching**

```csharp
[HttpGet]
[OutputCache]  // 5-minute cache by default
public async Task<IActionResult> GetProperties([FromQuery] PropertyFilterDto filter)
{
    var result = await _service.GetPropertiesAsync(filter);
    return Ok(result);
}
```

**Configuration**
```csharp
builder.Services.AddOutputCache(options =>
{
    options.AddBasePolicy(builder => builder.Expire(TimeSpan.FromMinutes(5)));
});
```

### 2. Response Compression

**Automatic Compression**

```csharp
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<BrotliCompressionProvider>();
    options.Providers.Add<GzipCompressionProvider>();
});
```

**Results:**
- 70-80% reduction in response size
- Faster data transfer
- Reduced bandwidth costs

### 3. Rate Limiting

**Fixed Window Rate Limiter**

```csharp
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("fixed", limiterOptions =>
    {
        limiterOptions.PermitLimit = 100;
        limiterOptions.Window = TimeSpan.FromMinutes(1);
        limiterOptions.QueueLimit = 0;
    });
});
```

**Protection:**
- 100 requests per minute per client
- Prevents API abuse
- Returns 429 Too Many Requests when exceeded

### 4. MongoDB Indexing

**Strategic Index Creation**

```csharp
// Text index for search
var textIndex = Builders<Property>.IndexKeys
    .Text(p => p.Name)
    .Text(p => p.Address);

// Range index for price queries
var priceIndex = Builders<Property>.IndexKeys
    .Ascending(p => p.Price);
```

**Query Performance:**
- Text search: O(log n) instead of O(n)
- Price range queries: Index scan instead of collection scan
- Pagination: Skip/Limit optimized with indexes

### 5. Filtering with MongoDB Expressions

**Efficient Query Building**

```csharp
var builder = Builders<Property>.Filter;
var filter = builder.Empty;

if (!string.IsNullOrEmpty(name))
{
    filter &= builder.Regex(p => p.Name, new BsonRegularExpression(name, "i"));
}

if (minPrice.HasValue)
{
    filter &= builder.Gte(p => p.Price, minPrice.Value);
}
```

**Benefits:**
- Only queries with applied filters are executed
- MongoDB native expressions (not LINQ)
- Case-insensitive regex search
- Combines multiple filters efficiently

## Testing

### Unit Tests

```csharp
// RealEstate.Tests/Services/PropertyServiceTests.cs
public class PropertyServiceTests
{
    [Fact]
    public async Task GetPropertiesAsync_ReturnsPagedResults()
    {
        // Arrange
        var mockRepo = new Mock<IPropertyRepository>();
        var service = new PropertyService(mockRepo.Object, mapper);
        
        // Act
        var result = await service.GetPropertiesAsync(filter);
        
        // Assert
        Assert.NotNull(result);
        Assert.Equal(10, result.Items.Count);
    }
}
```

### Integration Tests

```csharp
public class PropertiesControllerTests
{
    [Fact]
    public async Task GetProperties_ReturnsOkResult()
    {
        // Arrange
        var client = _factory.CreateClient();
        
        // Act
        var response = await client.GetAsync("/api/v1/properties");
        
        // Assert
        response.EnsureSuccessStatusCode();
    }
}
```

## Security Best Practices

### 1. CORS Configuration

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
```

Production: Configure with specific allowed origins only.

### 2. Input Validation

```csharp
public class PropertyFilterDto
{
    [Range(1, int.MaxValue)]
    public int PageNumber { get; set; } = 1;
    
    [Range(1, 100)]
    public int PageSize { get; set; } = 10;
    
    [StringLength(100)]
    public string? Name { get; set; }
}
```

### 3. Error Information Disclosure

```csharp
// Development: Detailed errors
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
}

// Production: Generic error messages
// GlobalExceptionHandlerMiddleware returns safe messages
```

## Deployment

### Docker Production Build

```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 80
ENTRYPOINT ["dotnet", "RealEstate.API.dll"]
```

### Environment Variables

```bash
# MongoDB Connection
MongoDbSettings:ConnectionString=mongodb://mongodb:27017
MongoDbSettings:DatabaseName=RealEstateDb
MongoDbSettings:CollectionName=properties

# ASP.NET Configuration
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://+:80
```

## Project Highlights

### Technical Excellence

- **Clean Architecture**: Proper layer separation with dependency inversion
- **SOLID Principles**: Applied throughout the codebase
- **Repository Pattern**: Database abstraction layer
- **DTO Pattern**: API contract separation
- **Dependency Injection**: Built-in IoC container usage
- **Global Exception Handling**: Centralized error management
- **Structured Logging**: Serilog with request logging
- **API Versioning**: Future-proof API design

### Performance Features

- **Output Caching**: 5-minute cache for GET requests
- **Response Compression**: Brotli/Gzip (70-80% reduction)
- **Rate Limiting**: 100 requests/minute protection
- **MongoDB Indexing**: Optimized queries
- **Async/Await**: Non-blocking I/O throughout

### Production Ready

- **Health Checks**: MongoDB connectivity monitoring
- **Docker Support**: Multi-stage containerization
- **Configuration Management**: Strongly-typed settings
- **Error Handling**: Comprehensive error boundaries
- **Logging**: Structured logging with Serilog
- **CORS Configuration**: Proper cross-origin setup

### Code Quality

- **Type Safety**: C# strict null checking
- **XML Documentation**: All public APIs documented
- **Consistent Naming**: Follows C# conventions
- **No Code Smells**: Clean, maintainable code
- **Test Coverage**: Unit and integration tests

## Additional Resources

### Useful Commands

```bash
# Restore packages
dotnet restore

# Build solution
dotnet build

# Run tests
dotnet test

# Create migration (if using EF Core)
dotnet ef migrations add InitialCreate

# Publish for deployment
dotnet publish -c Release -o ./publish
```

### MongoDB Queries

```javascript
// Connect to MongoDB
docker exec -it realestate-mongo mongosh

// Use database
use RealEstateDb

// View properties
db.properties.find().pretty()

// Count documents
db.properties.countDocuments()

// View indexes
db.properties.getIndexes()
```

---

**Developed by**: Mateo Avila - Multimedia Engineer  
**Portfolio**: [mateoavila.co](https://mateoavila.co)  
**Contact**: contacto@mateoavila.co  
**Purpose**: Technical assessment demonstrating .NET backend development expertise with Clean Architecture and modern best practices

