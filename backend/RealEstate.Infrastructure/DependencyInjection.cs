using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using RealEstate.Domain.Interfaces;
using RealEstate.Infrastructure.Configuration;
using RealEstate.Infrastructure.Persistence;
using RealEstate.Infrastructure.Persistence.Repositories;

namespace RealEstate.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            MongoDbClassMapper.RegisterClassMaps();

            services.Configure<MongoDbSettings>(configuration.GetSection("MongoDbSettings"));

            services.AddScoped<IPropertyRepository, PropertyRepository>();

            return services;
        }
    }
}