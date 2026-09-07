using MongoDB.Bson;
using MongoDB.Driver;
using Projects.Dtos.Common;
using Projects.Models;
using System.Linq.Expressions;
using System.Threading;


namespace Projects.Services.ProjectService;

public class ProjectService : IProjectService
{
    private readonly MongoDbContext _context;

    public ProjectService(MongoDbContext context)
    {
        _context = context;
    }

    public async Task<List<Project>> GetAllAsync(string id,CancellationToken cancellation)
    {
        return await _context.Projects
            .Find(x => x.UserId == id)
            .SortByDescending(x => x.CreatedAt)
            .ToListAsync(cancellation);
    }

    public async Task<Project?> GetByIdAsync(string id,CancellationToken cancellation)
    {
        return await _context.Projects
            .Find(x => x.Id == id)
            .FirstOrDefaultAsync(cancellation);
    }

    public async Task<PaginatedResultDto<Project>> GetByPage(int page, int pageSize, string userId, int year, int month,CancellationToken cancellation)
    {
        if (page <= 0)
        {
            page = 1;
        }

        if (pageSize <= 0)
        {
            pageSize = 30;
        }

        if (pageSize > 30)
        {
            pageSize = 30;
        }

        if (month < 1 || month > 12)
        {
           month = 1;
        }

        var startDate = new DateTime(year,month,1,0,0,0,DateTimeKind.Utc);

        // Start of next month
        var endDate = startDate.AddMonths(1);

        var filter = Builders<Project>.Filter.And(
       Builders<Project>.Filter.Eq(
           x => x.UserId,
           userId
       ),

       Builders<Project>.Filter.Gte(
           x => x.CreatedAt,
           startDate
       ),

       Builders<Project>.Filter.Lt(
           x => x.CreatedAt,
           endDate
       )
   );

        var totalCount = await _context.Projects.CountDocumentsAsync(filter);

        var projects = await _context.Projects
            .Aggregate()
            .Match(filter)
            .SortByDescending(x => x.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Limit(pageSize)
            .ToListAsync(cancellation);

        return new PaginatedResultDto<Project>
        {
            Results = projects,
            Total = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<Project?> GetByNameAsync(string name, CancellationToken cancellation)
    {
        return await _context.Projects
            .Find(x => x.Name == name)
            .FirstOrDefaultAsync(cancellation);
    }

    public async Task CreateAsync(Project project)
    {
        await _context.Projects.InsertOneAsync(project);
    }

    public async Task UpdateAsync(string id, Project project)
    {
        project.Id = id;

        await _context.Projects.ReplaceOneAsync(
            x => x.Id == id,
            project
        );
    }

    public async Task DeleteAsync(string id, CancellationToken cancellation)
    {
        using var session = await _context.Client.StartSessionAsync(cancellationToken: cancellation);
        session.StartTransaction();
        try
        {
            var todofilter = Builders<Todo>.Filter.Eq(x => x.Projectid, id);
            await _context.Todos.DeleteManyAsync(session, todofilter, cancellationToken: cancellation);

            var projectfilter = Builders<Project>.Filter.Eq(x => x.Id, id);
            await _context.Projects.DeleteManyAsync(session, projectfilter, cancellationToken: cancellation);

            await session.CommitTransactionAsync(cancellation);
        }

        catch (Exception ex)
        {
            await session.AbortTransactionAsync(cancellation);
            throw new Exception("failed to delete");
        }
    }


    public async Task DeleteAllByUserAsync(string userid,CancellationToken cancellation)
    {
        var filter = Builders<Project>.Filter.Eq(x => x.UserId,userid);

        var projects = await _context.Projects
            .Find(filter)
            .Project(x => x.Id)
            .ToListAsync(cancellation);

        foreach (var projectId in projects)
        {
            await DeleteAsync(projectId, cancellation);
        }
    }


    //    public async Task<DashboardStatsDto?> GetDashboardStatsAsync(string userId,CancellationToken cancellationToken)
    //    {
    //        var pipeline = PipelineDefinition<Project, DashboardStatsDto>.Create(
    //            new[]
    //{
    //    new BsonDocument("$match",
    //    new BsonDocument("userId", userId)),
    //    new BsonDocument("$addFields",
    //    new BsonDocument("pid",
    //    new BsonDocument("$toString", "$_id"))),
    //    new BsonDocument("$lookup",
    //    new BsonDocument
    //        {
    //            { "from", "Todos" },
    //            { "localField", "pid" },
    //            { "foreignField", "projectid" },
    //            { "as", "totaltasks" }
    //        }),
    //    new BsonDocument("$unwind",
    //    new BsonDocument
    //        {
    //            { "path", "$totaltasks" },
    //            { "preserveNullAndEmptyArrays", true }
    //        }),
    //    new BsonDocument("$group",
    //    new BsonDocument
    //        {
    //            { "_id", BsonNull.Value },
    //            { "totalProjects",
    //    new BsonDocument("$addToSet", "$_id") },
    //            { "activeProjects",
    //    new BsonDocument("$addToSet",
    //    new BsonDocument("$cond",
    //    new BsonArray
    //                    {
    //                        new BsonDocument("$eq",
    //                        new BsonArray
    //                            {
    //                                "$status",
    //                                "InProgress"
    //                            }),
    //                        "$_id",
    //                        BsonNull.Value
    //                    })) },
    //            { "totalTasks",
    //    new BsonDocument("$sum",
    //    new BsonDocument("$cond",
    //    new BsonArray
    //                    {
    //                        new BsonDocument("$ne",
    //                        new BsonArray
    //                            {
    //                                "$totaltasks",
    //                                BsonNull.Value
    //                            }),
    //                        1,
    //                        0
    //                    })) },
    //            { "completedTasks",
    //    new BsonDocument("$sum",
    //    new BsonDocument("$cond",
    //    new BsonArray
    //                    {
    //                        new BsonDocument("$eq",
    //                        new BsonArray
    //                            {
    //                                "$totaltasks.completed",
    //                                true
    //                            }),
    //                        1,
    //                        0
    //                    })) },
    //            { "pendingTasks",
    //    new BsonDocument("$sum",
    //    new BsonDocument("$cond",
    //    new BsonArray
    //                    {
    //                        new BsonDocument("$eq",
    //                        new BsonArray
    //                            {
    //                                "$totaltasks.completed",
    //                                false
    //                            }),
    //                        1,
    //                        0
    //                    })) }
    //        }),
    //    new BsonDocument("$project",
    //    new BsonDocument
    //        {
    //            { "_id", 0 },
    //            { "totalProjects",
    //    new BsonDocument("$size", "$totalProjects") },
    //            { "activeProjects",
    //    new BsonDocument("$size",
    //    new BsonDocument("$filter",
    //    new BsonDocument
    //                    {
    //                        { "input", "$activeProjects" },
    //                        { "as", "project" },
    //                        { "cond",
    //    new BsonDocument("$ne",
    //    new BsonArray
    //                            {
    //                                "$$project",
    //                                BsonNull.Value
    //                            }) }
    //                    })) },
    //            { "totalTasks", 1 },
    //            { "completedTasks", 1 },
    //            { "pendingTasks", 1 }
    //        })
    //}
    //        );

    //        var result = await _context.Projects
    //            .Aggregate(pipeline)
    //            .FirstOrDefaultAsync(cancellationToken);

    //        return result;
    //    }

    public async Task<DashboardStatsDto?> GetDashboardStatsAsync(string userId, CancellationToken cancellationToken)
    {
        var projects = await _context.Projects
            .Find(p => p.UserId == userId)
            .Project(p => new { ProjectId = p.Id.ToString(), p.Status })
            .ToListAsync(cancellationToken);

        if (projects.Count == 0)
        {
            return new DashboardStatsDto
            {
                TotalProjects = 0,
                ActiveProjects = 0,
                TotalTasks = 0,
                CompletedTasks = 0,
                PendingTasks = 0
            };
        }

        var totalProjects = projects.Count;
        var activeProjects = projects.Count(p => p.Status == TaskStatus.InProgress);
        var projectIds = projects.Select(p => p.ProjectId).ToList();

        var taskCountsDoc = await _context.Todos
            .Aggregate()
            .Match(t => projectIds.Contains(t.Projectid))
            .Group(new BsonDocument
            {
            { "_id", BsonNull.Value },
            { "totalTasks", new BsonDocument("$sum", 1) },
            { "completedTasks", new BsonDocument("$sum",
                new BsonDocument("$cond", new BsonArray {
                    new BsonDocument("$eq", new BsonArray { "$completed", true }), 1, 0
                })) },
            { "pendingTasks", new BsonDocument("$sum",
                new BsonDocument("$cond", new BsonArray {
                    new BsonDocument("$eq", new BsonArray { "$completed", false }), 1, 0
                })) }
            })
            .FirstOrDefaultAsync(cancellationToken);

        return new DashboardStatsDto
        {
            TotalProjects = totalProjects,
            ActiveProjects = activeProjects,
            TotalTasks = taskCountsDoc?["totalTasks"].AsInt32 ?? 0,
            CompletedTasks = taskCountsDoc?["completedTasks"].AsInt32 ?? 0,
            PendingTasks = taskCountsDoc?["pendingTasks"].AsInt32 ?? 0
        };
    }


    //public async Task<List<TaskbyProjectsStats>> GetTaskbyProjectStats(string userid,CancellationToken cancellation)
    //    {
    //        var filter = Builders<Project>.Filter.Eq(x => x.UserId, userid);
    //        var pipeline = PipelineDefinition<Project, TaskbyProjectsStats>.Create
    //            (
    //               new []
    //{
    //    new BsonDocument("$match",
    //    new BsonDocument("userId", userid)),
    //    new BsonDocument("$sort",
    //    new BsonDocument("createdAt", 1)),
    //    new BsonDocument("$addFields",
    //    new BsonDocument("tid",
    //    new BsonDocument("$toString", "$_id"))),
    //    new BsonDocument("$limit", 6),
    //    new BsonDocument("$project",
    //    new BsonDocument
    //        {
    //            { "_id", 0 },
    //            { "name", 1 },
    //            { "projectid", "$tid" }
    //        }),
    //    new BsonDocument("$lookup",
    //    new BsonDocument
    //        {
    //            { "from", "Todos" },
    //            { "localField", "projectid" },
    //            { "foreignField", "projectid" },
    //            { "as", "tasks" }
    //        }),
    //    new BsonDocument("$addFields",
    //    new BsonDocument
    //        {
    //            { "totaltasks",
    //    new BsonDocument("$size", "$tasks") },
    //            { "completedtasks",
    //    new BsonDocument("$size",
    //    new BsonDocument("$filter",
    //    new BsonDocument
    //                    {
    //                        { "input", "$tasks" },
    //                        { "as", "task" },
    //                        { "cond",
    //    new BsonDocument("$eq",
    //    new BsonArray
    //                            {
    //                                "$$task.completed",
    //                                true
    //                            }) }
    //                    })) }
    //        }),
    //    new BsonDocument("$project",
    //    new BsonDocument
    //        {
    //            { "name", 1 },
    //            { "totaltasks", 1 },
    //            { "completedtasks", 1 }
    //        })
    //}
    //                );

    //        var result = await _context.Projects
    //            .Aggregate(pipeline)
    //            .ToListAsync(cancellation);

    //        return result;
    //    }

    public async Task<List<TaskbyProjectsStats>> GetTaskbyProjectStats(string userId, CancellationToken cancellation)
    {
        var filter = Builders<Project>.Filter.Eq(x => x.UserId,userId);
        var projects = await _context.Projects
            .Find(filter)
            .SortBy(p => p.CreatedAt)
            .Limit(6)
            .Project(p => new { ProjectId = p.Id.ToString(), p.Name })
            .ToListAsync(cancellation);

        if (projects.Count == 0)
        {
            return new List<TaskbyProjectsStats>();
        }

        var projectIds = projects.Select(p => p.ProjectId).ToList();

        var taskCounts = await _context.Todos
            .Aggregate()
            .Match(t => projectIds.Contains(t.Projectid))
            .Group(new BsonDocument
            {
            { "_id", "$projectid" },
            { "totaltasks", new BsonDocument("$sum", 1) },
            { "completedtasks", new BsonDocument("$sum",
                new BsonDocument("$cond", new BsonArray {
                    new BsonDocument("$eq", new BsonArray { "$completed", true }), 1, 0
                })) }
            })
            .ToListAsync(cancellation);

        var countsByProjectId = taskCounts.ToDictionary(
            d => d["_id"].AsString,
            d => (Total: d["totaltasks"].AsInt32, Completed: d["completedtasks"].AsInt32)
        );

        var result = projects.Select(p =>
        {
            countsByProjectId.TryGetValue(p.ProjectId, out var counts);
            return new TaskbyProjectsStats
            {
                name = p.Name,
                totaltasks = counts.Total,
                completedtasks = counts.Completed
            };
        }).ToList();

        return result;
    }


    //public async Task<TaskPriority> GetTotalTaskCountbyPriority(string userid, CancellationToken cancellation)
    //    {
    //        var pipeline = PipelineDefinition<Project, TaskPriority>.Create(
    //            new []
    //{
    //    new BsonDocument("$match",
    //    new BsonDocument("userId", userid)),
    //    new BsonDocument("$addFields",
    //    new BsonDocument("tid",
    //    new BsonDocument("$toString", "$_id"))),
    //    new BsonDocument("$lookup",
    //    new BsonDocument
    //        {
    //            { "from", "Todos" },
    //            { "localField", "tid" },
    //            { "foreignField", "projectid" },
    //            { "as", "todos" }
    //        }),
    //    new BsonDocument("$project",
    //    new BsonDocument("todos", 1)),
    //    new BsonDocument("$unwind",
    //    new BsonDocument
    //        {
    //            { "path", "$todos" },
    //            { "preserveNullAndEmptyArrays", false }
    //        }),
    //    new BsonDocument("$group",
    //    new BsonDocument
    //        {
    //            { "_id", BsonNull.Value },
    //            { "totaltodos",
    //    new BsonDocument("$sum", 1) },
    //            { "high",
    //    new BsonDocument("$sum",
    //    new BsonDocument("$cond",
    //    new BsonArray
    //                    {
    //                        new BsonDocument("$eq",
    //                        new BsonArray
    //                            {
    //                                "$todos.priority",
    //                                "High"
    //                            }),
    //                        1,
    //                        0
    //                    })) },
    //            { "medium",
    //    new BsonDocument("$sum",
    //    new BsonDocument("$cond",
    //    new BsonArray
    //                    {
    //                        new BsonDocument("$eq",
    //                        new BsonArray
    //                            {
    //                                "$todos.priority",
    //                                "Medium"
    //                            }),
    //                        1,
    //                        0
    //                    })) },
    //            { "low",
    //    new BsonDocument("$sum",
    //    new BsonDocument("$cond",
    //    new BsonArray
    //                    {
    //                        new BsonDocument("$eq",
    //                        new BsonArray
    //                            {
    //                                "$todos.priority",
    //                                "Low"
    //                            }),
    //                        1,
    //                        0
    //                    })) }
    //        }),
    //    new BsonDocument("$project",
    //    new BsonDocument
    //        {
    //            { "_id", 0 },
    //            { "high", 1 },
    //            { "medium", 1 },
    //            { "low", 1 }
    //        })
    //}




    //            );

    //        var result = await _context.Projects.Aggregate(pipeline).FirstOrDefaultAsync();

    //        return result;
    //    }

    public async Task<TaskPriority> GetTotalTaskCountbyPriority(string userId, CancellationToken cancellation)
    {
        var filter = Builders<Project>.Filter.Eq(x => x.UserId, userId);
        var result = await _context.Projects
            .Aggregate()
            .Match(filter)
            .AppendStage<Project>(new BsonDocument("$addFields",
                new BsonDocument("tid", new BsonDocument("$toString", "$_id"))))
            .Lookup(
                foreignCollectionName: "Todos",
                localField: "tid",
                foreignField: "projectid",
                @as: "todos")
            .Unwind("todos", new AggregateUnwindOptions<BsonDocument> 
            { PreserveNullAndEmptyArrays = false })
            .Group(new BsonDocument
            {
            { "_id", BsonNull.Value },
            { "total", new BsonDocument("$sum", 1) },
            { "high", new BsonDocument("$sum",
                new BsonDocument("$cond", new BsonArray {
                    new BsonDocument("$eq", new BsonArray { "$todos.priority", "High" }), 1, 0
                })) },
            { "medium", new BsonDocument("$sum",
                new BsonDocument("$cond", new BsonArray {
                    new BsonDocument("$eq", new BsonArray { "$todos.priority", "Medium" }), 1, 0
                })) },
            { "low", new BsonDocument("$sum",
                new BsonDocument("$cond", new BsonArray {
                    new BsonDocument("$eq", new BsonArray { "$todos.priority", "Low" }), 1, 0
                })) }
            })
            .Project<TaskPriority>(Builders<BsonDocument>.Projection
                .Exclude("_id")
                .Include("high")
                .Include("medium")
                .Include("low"))
            .FirstOrDefaultAsync(cancellationToken: cancellation);

        return result ?? new TaskPriority();
    }

    public async Task<projectwithtask> GetAllTasksByUserIdWithProjectname(int page,int pageSize,string userId,CancellationToken cancellationToken)
    {
        if (page <= 0)
            page = 1;

        if (pageSize <= 0)
            pageSize = 30;

        if (pageSize > 30)
            pageSize = 30;

        var filter = Builders<Project>.Filter.Eq(x => x.UserId, userId);

        var result = await _context.Projects
            .Aggregate()
            .Match(filter)
            .AppendStage<Project>(
                new BsonDocument("$addFields",
                    new BsonDocument("projectIdString",
                        new BsonDocument("$toString", "$_id"))))

            .AppendStage<Project>(
                new BsonDocument("$lookup",
                    new BsonDocument
                    {
                    { "from", "Todos" },
                    { "localField", "projectIdString" },
                    { "foreignField", "projectid" },
                    { "as", "tasks" }
                    }))

            .AppendStage<Project>(
                new BsonDocument("$unwind", "$tasks"))

            .AppendStage<Project>(
                new BsonDocument("$facet",
                    new BsonDocument
                    {
                    {
                        "taskDto",
                        new BsonArray
                        {
                            new BsonDocument("$project",
                                new BsonDocument
                                {
                                    { "_id", 0 },
                                    { "name", "$name" },
                                    { "task", "$tasks" }
                                }),

                            new BsonDocument("$skip",
                                (page - 1) * pageSize),

                            new BsonDocument("$limit",
                                pageSize),
                        }
                    },

                    {
                        "total",
                        new BsonArray
                        {
                            new BsonDocument("$count", "totalcount")
                        }
                    }
                    }))

            .AppendStage<projectwithtask>(
                new BsonDocument("$project",
                    new BsonDocument
                    {
                    { "taskList", "$taskDto" },
                    {
                        "totalcount",
                        new BsonDocument("$ifNull",
                            new BsonArray
                            {
                                new BsonDocument("$arrayElemAt",
                                    new BsonArray
                                    {
                                        "$total.totalcount",
                                        0
                                    }),
                                0
                            })
                    }
                    }))

            .As<projectwithtask>()
            .FirstOrDefaultAsync(cancellationToken);

        return result ?? new projectwithtask();
    }
}
