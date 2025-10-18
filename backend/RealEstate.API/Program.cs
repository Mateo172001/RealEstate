using Asp.Versioning;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using MongoDB.Driver;
using RealEstate.API.Middleware;
using RealEstate.Application;
using RealEstate.Infrastructure;
using Serilog;

var builder = WebApplication.CreateBuilder(args);



// --- LOGGING IN SERVER ---
builder.Host.UseSerilog((context, config) =>
    config.ReadFrom.Configuration(context.Configuration));

// --- SERVICE REGISTRATION ---

// Application & Infrastructure
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);

builder.Services.AddControllers();

// Response Compression Settings
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<BrotliCompressionProvider>();
    options.Providers.Add<GzipCompressionProvider>();
});

// Rate Limiting Configuration
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter(policyName: "fixed", limiterOptions =>
    {
        limiterOptions.PermitLimit = 100;
        limiterOptions.Window = TimeSpan.FromMinutes(1);
        limiterOptions.QueueLimit = 0;
    });

    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
});

// Output Caching Configuration
builder.Services.AddOutputCache(options =>
{
    options.AddBasePolicy(builder => builder.Expire(TimeSpan.FromMinutes(5)));
});

// CORS Configuration
const string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var allowedOrigins = builder.Configuration["AllowedOrigins"]?.Split(',') ??
                     new[] { "http://localhost:3000", "http://frontend:3000" };

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy =>
        {
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

// API Versioning Configuration
builder.Services.AddApiVersioning(options =>
{
    options.ReportApiVersions = true;
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.DefaultApiVersion = new ApiVersion(1, 0);
}).AddApiExplorer(options =>
{
    options.GroupNameFormat = "'v'VVV";
    options.SubstituteApiVersionInUrl = true;
});

// Swagger/OpenAPI configuration for versioning
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "RealEstate API", Version = "v1" });
});


// Health Checks configuration
var mongoConnectionString = builder.Configuration["MongoDbSettings:ConnectionString"];

if (string.IsNullOrEmpty(mongoConnectionString))
{
    throw new InvalidOperationException("La cadena de conexi�n de MongoDB no est� configurada.");
}

builder.Services.AddHealthChecks()
    .AddMongoDb(
        sp => new MongoClient(mongoConnectionString),
        name: "mongodb-check",
        failureStatus: HealthStatus.Unhealthy,
        tags: new[] { "db", "mongodb" });


// --- APP BUILD ---
var app = builder.Build();

// --- HTTP MIDDLEWARE PIPELINE CONFIGURATION ---

// Global exception handling middleware
app.UseMiddleware<GlobalExceptionHandlerMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "RealEstate API v1");
    });
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors(MyAllowSpecificOrigins);

app.UseResponseCompression();
app.UseRateLimiter();

app.UseSerilogRequestLogging();

app.UseOutputCache();
app.UseAuthorization();

app.MapControllers();
app.MapHealthChecks("/health");

// --- INITIAL SEEDING OF THE DATABASE ---
// temporary scope of services to gain access to facilities
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var dbSettings = services.GetRequiredService<Microsoft.Extensions.Options.IOptions<RealEstate.Infrastructure.Configuration.MongoDbSettings>>().Value;

        var mongoClient = new MongoClient(dbSettings.ConnectionString);
        var database = mongoClient.GetDatabase(dbSettings.DatabaseName);
        var collection = database.GetCollection<RealEstate.Domain.Entities.Property>(dbSettings.CollectionName);

        Console.WriteLine("Intentando sembrar la base de datos...");
        await RealEstate.Infrastructure.Data.PropertySeeder.SeedAsync(collection);
        Console.WriteLine("Sembrado completado con �xito (o la base de datos ya ten�a datos).");
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Ocurri� un error durante el sembrado de la base de datos.");
    }
}


app.Run();