using Projects.Dtos.Common;
using Projects.Models;

namespace Projects.Services.ProjectService;

public interface IProjectService
{
    Task<List<Project>> GetAllAsync(string id,CancellationToken cancellation);
    Task<Project?> GetByIdAsync(string id,CancellationToken cancellation);
    Task<PaginatedResultDto<Project>> GetByPage(int page, int pageSize ,string userId, int year, int month, CancellationToken cancellation);
    Task<Project?> GetByNameAsync(string name, CancellationToken cancellation);
    Task CreateAsync(Project project);
    Task UpdateAsync(string id, Project project);
    Task DeleteAsync(string id,CancellationToken cancellation);
    Task DeleteAllByUserAsync(string userid, CancellationToken cancellation);
    Task<DashboardStatsDto?> GetDashboardStatsAsync(string userId, CancellationToken cancellationToken);
    Task<List<TaskbyProjectsStats>> GetTaskbyProjectStats(string userid, CancellationToken cancellation);

    Task<TaskPriority> GetTotalTaskCountbyPriority(string userid, CancellationToken cancellation);
    Task<projectwithtask> GetAllTasksByUserIdWithProjectname(int page, int pageSize, string userId, CancellationToken cancellationToken);
}