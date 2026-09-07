using Capsitech.Dates;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using Projects.Dtos.Common;
using Projects.Models;

namespace Projects.Services.TodoService;

public class TodoService : ITodoService
{
    private readonly MongoDbContext _context;

    public TodoService(MongoDbContext context)
    {
        _context = context;
    }

    public async Task<List<Todo>> GetAllAsync()
    {
        return await _context.Todos
            .Find(_ => true)
            .SortByDescending(x => x.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<Todo>> GetByProjectId(string projectId)
    {
        return await _context.Todos.Find(x => x.Projectid == projectId)
            .SortByDescending(x => x.CreatedAt)
            .ToListAsync();
    }

    public async Task<Todo?> GetByIdAsync(string id)
    {
        return await _context.Todos
            .Find(x => x.Id == id)
            .FirstOrDefaultAsync();
    }

    public async Task<PaginatedResultDto<Todo>> GetByPage(int pagenumber, int pagesize, string projectId, int month, int year ,DateTime? date)
    {
        if (pagenumber <= 0)
        {
            pagenumber = 1;
        }

        if (pagesize <= 0)
        {
            pagesize = 10;
        }

        DateTime startDate;
        DateTime endDate;

        if (date == null)
        {

            if (month < 1 || month > 12)
            {
                month = 1;
            }

            startDate = new DateTime(year, month, 1);
            endDate = startDate.AddMonths(1);
        }

        else
        {
            startDate = date.Value.Date;
            endDate = startDate.AddDays(1);
        }


        var filter = Builders<Todo>.Filter.Eq(X => X.Projectid, projectId) &
                     Builders<Todo>.Filter.Gte(x => x.Duedate, startDate) &
                     Builders<Todo>.Filter.Lt(x => x.Duedate, endDate);

        var totalcount = await _context.Todos.CountDocumentsAsync(filter);
        var data = await _context.Todos
            .Find(filter)
            .SortByDescending(x => x.CreatedAt)
            .Skip((pagenumber - 1) * pagesize)
            .Limit(pagesize)
            .ToListAsync();

        return new PaginatedResultDto<Todo>
        {
            Results = data,
            Total = totalcount,
            Page = pagenumber,
            PageSize = pagesize

        };

    }


    public async Task<List<DateWiseTodoDto>> GetDateWiseTasks(int pagenumber, int pagesize, string projectId,int month,int year,DateTime date)
    {
        if (pagenumber <= 0)
        {
            pagenumber = 1;
        }

        if (pagesize <= 0)
        {
            pagesize = 10;
        }

        if (month < 1 || month > 12)
        {
            month = 1;
        }

        //var startDate = new DateTime(year, month, 1);
        //var endDate = startDate.AddMonths(1);
       var startDate = date;
       var endDate = startDate.AddDays(1);

        var filter =
            Builders<Todo>.Filter.Eq(x => x.Projectid, projectId) &
            Builders<Todo>.Filter.Gte(x => x.Duedate, startDate) &
            Builders<Todo>.Filter.Lt(x => x.Duedate, endDate);

        // Aggregation pipeline
        var data = await _context.Todos
            .Aggregate()
            .Match(filter)
            .Group(new BsonDocument
            {
            {
                "_id",
                new BsonDocument
                {
                    {
                        "$dateToString",
                        new BsonDocument
                        {
                            { "format", "%Y-%m-%d" },
                            { "date", "$duedate" }
                        }
                    }
                }
            },
            {
                "tasks",
                new BsonDocument
                {
                    {
                        "$push",
                        "$$ROOT"
                    }
                }
            }
            })
            .Sort(new BsonDocument("_id", 1))
            .Skip((pagenumber-1) * pagesize)
            .Limit(pagesize)
            .ToListAsync();

        return data.Select(x => new DateWiseTodoDto
        {
            Date = DateTime.Parse(x["_id"].AsString),

            Tasks = x["tasks"]
                .AsBsonArray
                .Select(task =>
                    BsonSerializer.Deserialize<Todo>(
                        task.AsBsonDocument))
                .ToList()

        }).ToList();
    }
    public async Task<PaginatedResultDto<Todo>> GetByPageWithDate(int pagenumber ,int pagesize,string projectId, DateTime date)
    {
        if (pagesize <= 0)
        {
            pagesize = 10;
        }

        var startDate = date.Date;
        var endDate = startDate.AddDays(1);

        var filter = Builders<Todo>.Filter.Eq(x => x.Projectid, projectId) &
            Builders<Todo>.Filter.Gte(x => x.Duedate, startDate) &
            Builders<Todo>.Filter.Lt(x => x.Duedate,endDate);

        var totalcount = await _context.Todos.CountDocumentsAsync(filter);
        var data = await _context.Todos.Find(filter)
            .SortByDescending(x => x.CreatedAt)
            .Limit(pagesize)
            .ToListAsync();

        return new PaginatedResultDto<Todo>
        {
            Results = data,
            Total = totalcount,
            Page = pagenumber,
            PageSize = pagesize
        };

    }

    //public async Task<List<Todo>> GetByStatus(bool completd)
    //{
    //    var filter = Builders<Todo>.Filter.Eq(x => x.Completed, completd);

    //    var todo = await _context.Todos
    //        .Find(filter)
    //        .SortByDescending(x => x.CreatedAt)
    //        .ToListAsync();
    //    return todo;

    //}
  
    //public async Task<List<Todo>> GetByPriority(Priority priority)
    //{
    //    var filter = Builders<Todo>.Filter.Eq(x => x.priority, priority);

    //    var todo = await _context.Todos
    //        .Find(filter)
    //        .SortByDescending(x => x.CreatedAt)
    //        .ToListAsync();

    //    return todo;

    //}


    public async Task<List<Todo>> GetByStatusAndPriority(
    bool? completed,
    Priority? priority,string projectId)
    {
        var filter = Builders<Todo>.Filter.Empty;
        filter &= Builders<Todo>.Filter.Eq(x => x.Projectid, projectId);

        if (completed.HasValue)
        {
            filter &= Builders<Todo>.Filter.Eq(
                x => x.Completed,
                completed.Value
            );
        }

        if (priority.HasValue)
        {
            filter &= Builders<Todo>.Filter.Eq(
                x => x.priority,
                priority.Value
            );
        }

        var todos = await _context.Todos
            .Find(filter)
            .SortByDescending(x => x.CreatedAt)
            .ToListAsync();

        return todos;
    }

    public async Task<Todo> GetByTitle(string title)
    {
        return await _context.Todos.Find(x => x.Title == title).FirstOrDefaultAsync();
    }

    public async Task CreateAsync(Todo todo,string projectId)
    {
        if(projectId == null)
        {
            return;
        }
        await _context.Todos.InsertOneAsync(todo);
    }

    public async Task UpdateAsync(string id, Todo todo)
    {
        todo.Id = id;

        await _context.Todos.ReplaceOneAsync(
            x => x.Id == id,
            todo
        );
    }

    public async Task UpdateTodoCompleted(string id)
    {
        var todo = await _context.Todos.Find(x => x.Id == id).FirstOrDefaultAsync();

        if (todo == null)
        {
            return;
        }

        var update = Builders<Todo>.Update.Set(x => x.Completed, !todo.Completed);

        await _context.Todos.UpdateOneAsync(x => x.Id == id, update);
    }

    public async Task DeleteAsync(string id)
    {
        await _context.Todos.DeleteOneAsync(
            x => x.Id == id
        );
    }
}