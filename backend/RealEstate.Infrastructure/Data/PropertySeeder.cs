using Bogus;
using MongoDB.Bson;
using MongoDB.Driver;
using RealEstate.Domain.Entities;

namespace RealEstate.Infrastructure.Data
{
    public static class PropertySeeder
    {
        public static async Task SeedAsync(IMongoCollection<Property> propertyCollection)
        {
            if (await propertyCollection.CountDocumentsAsync(FilterDefinition<Property>.Empty) > 0)
            {
                return;
            }

            var ownerIds = new[] { "owner-123", "owner-456", "owner-789" };

            var propertyFaker = new Faker<Property>("en")
                .RuleFor(p => p.IdOwner, f => f.PickRandom(ownerIds))
                .RuleFor(p => p.Name, f => f.Address.City() + " Heights")
                .RuleFor(p => p.Address, f => f.Address.FullAddress())
                .RuleFor(p => p.Price, f => Math.Round(f.Finance.Amount(150000, 2000000), 2))
                .RuleFor(p => p.ImageUrl, f => f.Image.PicsumUrl())
                .RuleFor(p => p.CreatedAt, f => f.Date.Past(2))

                .RuleFor(p => p.Id, _ => ObjectId.GenerateNewId().ToString());

            var properties = propertyFaker.Generate(50);
            await propertyCollection.InsertManyAsync(properties);
        }
    }
}