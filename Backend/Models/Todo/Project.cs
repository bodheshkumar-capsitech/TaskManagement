using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Projects.Models;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

public class Project
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    public string UserId { get; set; } = string.Empty;

    [Required]
    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    [BsonRepresentation(BsonType.String)]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public Priority priority { get; set; } = Priority.Medium;

    [BsonRepresentation(BsonType.String)]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public TaskStatus Status { get; set; } = TaskStatus.InProgress;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set;}
}


public enum TaskStatus
{
    Pending,
    InProgress,
    Completed
}