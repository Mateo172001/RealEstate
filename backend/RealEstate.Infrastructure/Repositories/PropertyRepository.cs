using Microsoft.Extensions.Options;
using MongoDB.Driver;
using RealEstate.Domain.Entities;
using RealEstate.Domain.Interfaces;
using RealEstate.Infrastructure.Configuration;
using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Bson;

namespace RealEstate.Infrastructure.Persistence.Repositories
{
    public class PropertyRepository : IPropertyRepository
    {
        private readonly IMongoCollection<Property> _propertiesCollection;

        // Injection of the configuration (IOptions) to obtain the details of the connection.
        public PropertyRepository(IOptions<MongoDbSettings> settings)
        {
            var mongoClient = new MongoClient(settings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(settings.Value.DatabaseName);
            _propertiesCollection = mongoDatabase.GetCollection<Property>(settings.Value.CollectionName);

            CreateIndexes();
        }

        private void CreateIndexes()
        {
            var textIndex = new CreateIndexModel<Property>(
                Builders<Property>.IndexKeys.Text(p => p.Name).Text(p => p.Address),
                new CreateIndexOptions { Name = "TextSearchIndex" });

            var priceIndex = new CreateIndexModel<Property>(
                Builders<Property>.IndexKeys.Ascending(p => p.Price),
                new CreateIndexOptions { Name = "PriceIndex" });

            var ownerIndex = new CreateIndexModel<Property>(
                Builders<Property>.IndexKeys.Ascending(p => p.IdOwner),
                new CreateIndexOptions { Name = "OwnerIndex" });

            _propertiesCollection.Indexes.CreateMany(new[] { textIndex, priceIndex, ownerIndex });
        }

        public async Task CreatePropertyAsync(Property property)
        {
            property.CreatedAt = DateTime.UtcNow;
            await _propertiesCollection.InsertOneAsync(property);
        }

        public async Task<Property> GetPropertyByIdAsync(string id)
        {
            return await _propertiesCollection.Find(p => p.Id == id).FirstOrDefaultAsync();
        }

        public async Task<(long totalCount, IReadOnlyList<Property> items)> GetPropertiesAsync(
            int pageNumber,
            int pageSize,
            string? name,
            string? address,
            decimal? minPrice,
            decimal? maxPrice)
        {
            var builder = Builders<Property>.Filter;
            var filter = builder.Empty;

            // Text filter for Name and Address
            if (!string.IsNullOrEmpty(name))
            {
                filter &= builder.Regex(p => p.Name, new BsonRegularExpression(name, "i"));
            }

            if (!string.IsNullOrEmpty(address))
            {
                filter &= builder.Regex(p => p.Address, new BsonRegularExpression(address, "i"));
            }

            // Price range filter
            if (minPrice.HasValue)
            {
                filter &= builder.Gte(p => p.Price, minPrice.Value);
            }

            if (maxPrice.HasValue)
            {
                filter &= builder.Lte(p => p.Price, maxPrice.Value);
            }


            var totalCount = await _propertiesCollection.CountDocumentsAsync(filter);

            var items = await _propertiesCollection.Find(filter)
                .Sort(Builders<Property>.Sort.Descending(p => p.CreatedAt)) 
                .Skip((pageNumber - 1) * pageSize)
                .Limit(pageSize)
                .ToListAsync();

            return (totalCount, items);
        }
    }
}