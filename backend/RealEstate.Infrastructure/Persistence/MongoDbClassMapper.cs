using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;
using RealEstate.Domain.Entities;

namespace RealEstate.Infrastructure.Persistence
{
    public static class MongoDbClassMapper
    {
        public static void RegisterClassMaps()
        {
            if (!BsonClassMap.IsClassMapRegistered(typeof(Property)))
            {
                BsonClassMap.RegisterClassMap<Property>(cm =>
                {
                    cm.AutoMap();

                    // Mapped the 'Id' property to '_id' in MongoDB and treat it as an ObjectId.
                    cm.MapIdProperty(p => p.Id)
                      .SetSerializer(new StringSerializer(BsonType.ObjectId));

                    cm.MapProperty(p => p.Price)
                      .SetSerializer(new DecimalSerializer(BsonType.Decimal128));

                    cm.SetIgnoreExtraElements(true);
                });
            }
        }
    }
}