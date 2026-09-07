using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Projects.Models
{
    public class Todo
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string Projectid { get; set; } = "";
        [Required]
        [MaxLength(40)]
        public string Title { get; set; } = "";
        [MaxLength(200)]
        public string Description { get; set; } = "";

        public DateTime Duedate { get; set; }

        [BsonRepresentation(BsonType.String)]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public Priority priority { get; set; } = Priority.Medium;

        public bool Completed { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; }
    }

    public enum Priority
    {
        Low,
        Medium,
        High
    }

}
