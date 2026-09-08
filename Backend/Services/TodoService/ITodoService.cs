using Projects.Dtos.Common;
using Projects.Models;

namespace Projects.Services.TodoService;

public interface ITodoService
{
    Task<List<Todo>> GetAllAsync();

    Task<List<Todo>> GetByProjectId(string projectId);

    Task<Todo?> GetByIdAsync(string id);

    Task<PaginatedResultDto<Todo>> GetByPage(int page, int pagesize, string projectId, int month, int year, DateTime? date);

    Task<List<DateWiseTodoDto>> GetDateWiseTasks(int pagenumber, int pagesize, string projectId, int month, int year, DateTime date);

    Task<PaginatedResultDto<Todo>> GetByPageWithDate(int pagenumber, int pagesize, string projectId, DateTime date);

    //Task<List<Todo>> GetByStatus(bool completd);
    //Task<List<Todo>> GetByPriority(Priority priority);

    Task<List<Todo>> GetByStatusAndPriority(
        bool? completed,
        Priority? priority, string projectId);

    Task<Todo?> GetByTitle(string title);

    Task CreateAsync(Todo todo, string projectId);

    Task UpdateAsync(string id, Todo todo);

    Task UpdateTodoCompleted(string id);

    Task DeleteAsync(string id);

    Task<projectwithtask> GetTaskbyname(string userId, string taskname, CancellationToken cancellation);
}