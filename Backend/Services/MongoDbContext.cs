using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Projects.Config.Db;
using Projects.Models;

namespace Projects.Services;

public class MongoDbContext
{

    public IMongoClient Client { get; }
    public IMongoCollection<Todo> Todos { get; }
    public IMongoCollection<Project> Projects { get; }

    public MongoDbContext(IOptions<DbSettings> options)
    {
        Client = new MongoClient(options.Value.ConnectionString);
        var client = new MongoClient(options.Value.ConnectionString);

        var database = client.GetDatabase(options.Value.DatabaseName);

        Todos = database.GetCollection<Todo>(options.Value.TodoCollection);

        Projects = database.GetCollection<Project>(options.Value.ProjectCollection);
    }
}