using Capsitech;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Projects.Dtos.Common;
using Projects.Models;
using Projects.Services.ProjectService;
using System.Security.Claims;

namespace Projects.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProjectController : ControllerBase
{
    private readonly IProjectService _projectService;

    public ProjectController(IProjectService projectService)
    {
        _projectService = projectService;
    }

    [HttpGet("GetAll")]
    public async Task<ApiResponse<List<Project>>> GetAll(CancellationToken cancellation)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var projects = await _projectService.GetAllAsync(userId,cancellation);

        return new ApiResponse<List<Project>>
        {
            Status = true,
            Message = "Projects fetched successfully",
            Result = projects
        };
    }

    [HttpGet("GetbyId/{id}")]
    public async Task<ApiResponse<Project?>> GetById(string id,CancellationToken cancellation)
    {
        var project = await _projectService.GetByIdAsync(id, cancellation);

        if (project == null)
        {
            return new ApiResponse<Project?>
            {
                Status = false,
                Message = "Project not found",
                Result = null
            };
        }

        return new ApiResponse<Project?>
        {
            Status = true,
            Message = "Project fetched successfully",
            Result = project
        };
    }

    [HttpGet("GetbyPage")]
    public async Task<ApiResponse<PaginatedResultDto<Project>>> GetbyPage(int page, int pageSize, int? year, int? month,CancellationToken cancellation)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var res = new ApiResponse<PaginatedResultDto<Project>>();
        try
        {
            if(userId == null)
            {
                res.Message = "User is not logged in";
                res.Status = false;
                res.Result = null;
                return res;
            }
            if(page <=0 || pageSize <= 0)
            {
                res.Message = "Please enter the page no or page size";
                res.Status = false;
                res.Result = null;
            }

            year ??= DateTime.UtcNow.Year;
            month ??= DateTime.UtcNow.Month;

            if (month < 1 || month > 12)
            {
                res.Message = "Invalid month";
                res.Status = false;
                res.Result = null;
            }

            var data = await _projectService.GetByPage(page, pageSize,userId,year.Value,month.Value,cancellation);
            if(data == null)
            {
                res.Message = "Data not found";
                res.Status = false;
                res.Result = null;
            }
            res.Message = "Project found sucessfully";
            res.Status = true;
            res.Result = data;
        }
        catch(Exception ex)
        {
            res.Message = "Error :" + ex.Message;
            res.Status = false;
            res.Result = null;
        }
        return res;
    }

    [HttpGet("name/{name}")]
    public async Task<ApiResponse<Project?>> GetByName(string name, CancellationToken cancellation)
    {
        var project = await _projectService.GetByNameAsync(name, cancellation);

        if (project == null)
        {
            return new ApiResponse<Project?>
            {
                Status = false,
                Message = "Project not found",
                Result = null
            };
        }

        return new ApiResponse<Project?>
        {
            Status = true,
            Message = "Project fetched successfully",
            Result = project
        };
    }

    [HttpPost("Create")]
    public async Task<ApiResponse<Project>> Create(Project project)
    {
        var response = new ApiResponse<Project>();
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null)
        {
            response.Message = "userid did not found for the logged in user";
            response.Status = false;
            response.Result = null;
            return response;
        }
        project.UserId = userId;
        await _projectService.CreateAsync(project);

        return new ApiResponse<Project>
        {
            Status = true,
            Message = "Project created successfully",
            Result = project
        };
    }

    [HttpPut("UpdatebyId/{id}")]
    public async Task<ApiResponse<Project>> Update(
        string id,
        Project project,CancellationToken cancellation)
    {
        var response = new ApiResponse<Project>();
        var existingProject = await _projectService.GetByIdAsync(id, cancellation);

        if (existingProject == null)
        {
            return new ApiResponse<Project>
            {
                Status = false,
                Message = "Project not found",
                Result = null
            };
        }

        var now = DateTime.UtcNow;
        project.UpdatedAt = now;

        await _projectService.UpdateAsync(id, project);

        return new ApiResponse<Project>
        {
            Status = true,
            Message = "Project updated successfully",
            Result = project
        };
    }

    [HttpDelete("DeletebyId/{id}")]
    public async Task<ApiResponse<string>> Delete(string id, CancellationToken cancellation)
    {
        var existingProject = await _projectService.GetByIdAsync(id, cancellation);

        if (existingProject == null)
        {
            return new ApiResponse<string>
            {
                Status = false,
                Message = "Project not found",
                Result = null
            };
        }

        await _projectService.DeleteAsync(id, cancellation);

        return new ApiResponse<string>
        {
            Status = true,
            Message = "Project deleted successfully",
            Result = id
        };
    }

    [HttpGet("GetDasboardStats")]
    public async Task<ApiResponse<DashboardStatsDto>> GetDashboardStats(CancellationToken cancellation)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var res = new ApiResponse<DashboardStatsDto>();
        try
        {
            if(userId == null)
            {
                res.Message = "User is not logged in.";
                res.Status = false;
                res.Result = null;
                return res;
                
            }
            var data = await _projectService.GetDashboardStatsAsync(userId, cancellation);
            if (data == null)
            {
                res.Message = "Data not found";
                res.Status = false;
                res.Result = null;
                return res;
            }

            res.Message = "Data found sucessfully";
            res.Status = true;
            res.Result = data;
        }

        catch (Exception ex)
        {
            res.Message = "Error :" + ex.Message;
            res.Status = false;
            res.Result = null;
        }

        return res;
    }

    [HttpGet("GetTaskbyProjectStats")]
    public async Task<ApiResponse<List<TaskbyProjectsStats>>> GetTaskByProjectStats(CancellationToken cancellation)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var res = new ApiResponse<List<TaskbyProjectsStats>>();

        try
        {
            if (userId == null)
            {
                res.Message = "User is not logged in.";
                res.Status = false;
                res.Result = null;
                return res;

            }

            var data = await _projectService.GetTaskbyProjectStats(userId, cancellation);
            if (data == null)
            {
                res.Message = "Data not found";
                res.Status = false;
                res.Result = null;
                return res;
            }

            res.Message = "Data found sucessfully";
            res.Status = true;
            res.Result = data;

        }
        catch (Exception ex)
        {
            res.Message = "Error :" + ex.Message;
            res.Status = false;
            res.Result = null;
        }

        return res;
    }



    [HttpGet("GetAllTaskCountbyPriorityStats")]
    public async Task<ApiResponse<TaskPriority>> GetAllTaskCountByPriorityStats(CancellationToken cancellation)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var res = new ApiResponse<TaskPriority>();

        try
        {
            if (userId == null)
            {
                res.Message = "User is not logged in.";
                res.Status = false;
                res.Result = null;
                return res;

            }

            var data = await _projectService.GetTotalTaskCountbyPriority(userId, cancellation);
            if (data == null)
            {
                res.Message = "Data not found";
                res.Status = false;
                res.Result = null;
                return res;
            }

            res.Message = "Data found sucessfully";
            res.Status = true;
            res.Result = data;

        }
        catch (Exception ex)
        {
            res.Message = "Error :" + ex.Message;
            res.Status = false;
            res.Result = null;
        }

        return res;
    }


    [HttpGet("Gettaskswithprojectname")]
    public async Task<ApiResponse<projectwithtask>> GetTaskswithprojectname(int page, int pageSize, CancellationToken cancellation)
    {
        var res = new ApiResponse<projectwithtask>();
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if(userId == null)
        {
            res.Message = "User is not logged in";
            res.Status = false;
            res.Result = null;
            return res;
        }

        try
        {
            var data = await _projectService.GetAllTasksByUserIdWithProjectname(page,pageSize,userId,cancellation);
            if (data == null)
            {
                res.Message = "No data found for the user";
                res.Status = false;
                res.Result = data;
                return res;
            }

            res.Message = "Data found sucessfully";
            res.Status = true;
            res.Result = data;
            return res;
        }

        catch(Exception ex)
        {
            res.Message = "Error :" + ex.Message;
            res.Status = false;
            res.Result = null;
        }
        return res;
    }
}