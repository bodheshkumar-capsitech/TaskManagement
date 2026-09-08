using Capsitech;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Projects.Dtos.Common;
using Projects.Models;
using Projects.Services.TodoService;
using System.Collections.Generic;
using System.Security.Claims;

namespace Projects.Controllers;

[Authorize(AuthenticationSchemes = "Bearer")]
[ApiController]
[Route("api/[controller]")]
public class TodoController : ControllerBase
{
    private readonly ITodoService _todoService;

    public TodoController(ITodoService todoService)
    {
        _todoService = todoService;
    }

    [HttpGet("GetAll")]
    public async Task<ApiResponse<List<Todo>>> GetAll()
    {
        var res = new ApiResponse<List<Todo>>();
        try
        {
            var data = await _todoService.GetAllAsync();
            if (data != null)
            {
                res.Message = "data fetched sucessfully";
                res.Status = true;
                res.Result = data;
            }
            else
            {
                res.Message = "Data is empty";
                res.Status = false;
                res.Result = null;
            }

        }
        catch (Exception ex)
        {
            res.Message = "Error :" + ex.Message;
            res.Status = false;
        }
        return res;


    }

    [HttpGet("GetbyProjectId/{id}")]
    public async Task<ApiResponse<List<Todo>>> GetbyProjectid(string id)
    {
        var res = new ApiResponse<List<Todo>>();
        try
        {
            if (id == null)
            {
                res.Message = "Plese give a id";
                res.Status = false;
                res.Result = null;
            }

            var data = await _todoService.GetByProjectId(id);
            if(data == null)
            {
                res.Message = "Todo did not exists for the current project";
                res.Status = false;
                res.Result = null;
            }

            res.Message = "Todo found sucessfully";
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

    [HttpGet("GetbyId/{id}")]
    public async Task<ApiResponse<Todo>> GetById(string id)
    {
        var res = new ApiResponse<Todo>();
        try
        {
            var todo = await _todoService.GetByIdAsync(id);
            if (todo != null)
            {
                res.Message = "data fetched sucessfully";
                res.Status = true;
                res.Result = todo;
            }
            else
            {
                res.Message = "data not found";
                res.Status = false;
                res.Result = null;
            }

        }

        catch (Exception ex)
        {
            res.Message = "Error :" + ex.Message;
            res.Status = false;
            res.Result = null;
        }

        return res;
    }

    [HttpGet("GetByPage")]
    public async Task<ApiResponse<PaginatedResultDto<Todo>>> GetbyPage([FromQuery] PaginatedQueryDto data,string projectId,int? month,int? year,DateTime? date)
    {
        var res = new ApiResponse<PaginatedResultDto<Todo>>();
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        try
        {
            if (userId == null)
            {
                res.Message = "user not found login again";
                res.Status = false;
                res.Result = null;
            }
            if (data.Page <= 0)
            {
                res.Message = "Please enter the page number";
                res.Status = false;
                res.Result = null;
            }

            month ??= DateTime.UtcNow.Month;
            year ??= DateTime.UtcNow.Year;

            if (month < 1 || month > 12)
            {
                res.Message = "Invalid month";
                res.Status = false;
                res.Result = null;
            }
            else
            {
              var content =  await _todoService.GetByPage(data.Page, data.PageSize, projectId,month.Value,year.Value,date);
                if(content != null)
                {
                    res.Message = "Data found sucessfully";
                    res.Status = true;
                    res.Result = content;
                }
            }
        }

        catch(Exception ex)
        {
            res.Message = "Error :" + ex.Message;
            res.Status = false;
            res.Result = null;
        }
        return res;
    }

    [HttpGet("GetDateWiseTasks")]
    public async Task<ApiResponse<List<DateWiseTodoDto>>> GetDateWiseTasks([FromQuery] PaginatedQueryDto data,string projectId,int? month,int? year, DateTime date)
    {
        var res = new ApiResponse<List<DateWiseTodoDto>>();

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        try
        {
            if (userId == null)
            {
                res.Message = "User not found, login again";
                res.Status = false;
                res.Result = null;
                return res;
            }
            if (data.Page <= 0)
            {
                res.Message = "Please enter the page number";
                res.Status = false;
                res.Result = null;
            }


            if (string.IsNullOrEmpty(projectId))
            {
                res.Message = "Project id is required";
                res.Status = false;
                res.Result = null;
                return res;
            }

            // Default to current month/year
            month ??= DateTime.UtcNow.Month;
            year ??= DateTime.UtcNow.Year;

            if (month < 1 || month > 12)
            {
                res.Message = "Invalid month";
                res.Status = false;
                res.Result = null;
                return res;
            }

            var content = await _todoService.GetDateWiseTasks(data.Page,data.PageSize,projectId,month.Value,year.Value,date);

            if (content == null)
            {
                res.Message = "No tasks found";
                res.Status = true;
                res.Result = new List<DateWiseTodoDto>();
                return res;
            }

            res.Message = "Date-wise tasks found successfully";
            res.Status = true;
            res.Result = content;
        }
        catch (Exception ex)
        {
            res.Message = "Error: " + ex.Message;
            res.Status = false;
            res.Result = null;
        }

        return res;
    }

    [HttpGet("GetByPageWithDate")]
    public async Task<ApiResponse<PaginatedResultDto<Todo>>> GetByPageWithDate([FromQuery] PaginatedQueryDto data,string projectId,DateTime? date)
    {
        var res = new ApiResponse<PaginatedResultDto<Todo>>();
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        try
        {
            if (userId == null)
            {
                res.Message = "User not found. Login again";
                res.Status = false;
                res.Result = null;
                return res;
            }

            if (string.IsNullOrEmpty(projectId))
            {
                res.Message = "Project ID is required";
                res.Status = false;
                res.Result = null;
                return res;
            }

            if (data.Page <= 0)
            {
                res.Message = "Please enter a valid page number";
                res.Status = false;
                res.Result = null;
                return res;
            }

            if (date == default)
            {
                res.Message = "Please enter a valid date";
                res.Status = false;
                res.Result = null;
                return res;
            }

            var content = await _todoService.GetByPageWithDate(
                data.Page,
                data.PageSize,
                projectId,
                date.Value
            );

            if (content != null)
            {
                res.Message = "Todo data found successfully";
                res.Status = true;
                res.Result = content;
            }
            else
            {
                res.Message = "No todo data found";
                res.Status = false;
                res.Result = null;
            }
        }
        catch (Exception ex)
        {
            res.Message = "Error: " + ex.Message;
            res.Status = false;
            res.Result = null;
        }

        return res;
    }

    //[HttpGet("Getbystatus")]
    //public async Task<ApiResponse<List<Todo>>> GetbyStatus([FromQuery]bool status)
    //{
    //    var res = new ApiResponse<List<Todo>>();

    //    try
    //    {
    //        if(status == null)
    //        {
    //            res.Message = "Please select the status";
    //            res.Status = false;
    //            res.Result = null;
    //        }

    //        else
    //        {
    //            var todos = await _todoService.GetByStatus(status);
    //            if (todos == null)
    //            {
    //                res.Message = "No todo exists";
    //                res.Status = false;
    //                res.Result = null;
    //            }

    //            else
    //            {
    //                res.Message = "Todo found sucessfully";
    //                res.Status = true;
    //                res.Result = todos;
    //            }
    //        }
    //    }

    //    catch(Exception ex)
    //    {
    //        res.Message = "Error :" + ex.Message;
    //        res.Status = false;
    //        res.Result = null;
    //    }

    //    return res;
    //}


    //[HttpGet("GetbyPriority")]
    //public async Task<ApiResponse<List<Todo>>> GetBypriority(Priority priority)
    //{
    //    var res = new ApiResponse<List<Todo>>();

    //    try
    //    {
    //        if(priority == null)
    //        {
    //            res.Message = "Please select any priority option";
    //            res.Status = false;
    //            res.Result = null;
    //        }

    //        var todo = await _todoService.GetByPriority(priority);

    //        if(todo == null)
    //        {
    //            res.Message = "Todo did not exist according to your priority";
    //            res.Status = false;
    //            res.Result = todo;
    //        }

    //        res.Message = "Todo found sucessfully according to the priority";
    //        res.Status = true;
    //        res.Result = todo;
    //    }


    //    catch (Exception ex)
    //    {
    //        res.Message = "Error :" + ex.Message;
    //        res.Status = false;
    //        res.Result = null;
    //    }

    //    return res;
    //}


    [HttpGet("Filter")]
    public async Task<ApiResponse<List<Todo>>> Filter(
    [FromQuery] bool? status,
    [FromQuery] Priority? priority, string projectId)
    {
        var res = new ApiResponse<List<Todo>>();
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        try
        {
            if (userId == null)
            {
                res.Message = "User not found login again";
                res.Status = false;
                res.Result = null;
            }
            if (projectId == null)
            {
                res.Message = "Projectid is null";
                res.Status = false;
                res.Result = null;
            }
            var todos = await _todoService.GetByStatusAndPriority(
                status,
                priority,projectId
            );

            if (todos == null || todos.Count == 0)
            {
                res.Message = "No todo exists";
                res.Status = false;
                res.Result = null;
            }
            else
            {
                res.Message = "Todo found successfully";
                res.Status = true;
                res.Result = todos;
            }
        }
        catch (Exception ex)
        {
            res.Message = "Error: " + ex.Message;
            res.Status = false;
            res.Result = null;
        }

        return res;
    }

    [HttpGet("GetbyTitle")]
    public async Task<ApiResponse<Todo>> Getbytitle(string title)
    {
        var res = new ApiResponse<Todo>();
        try
        {
            if(string.IsNullOrEmpty(title))
            {
                res.Message = "Please enter a title";
                res.Status = false;
                res.Result = null;
            }

           var todo = await _todoService.GetByTitle(title);

            if (todo != null)
            {
                res.Message = "Todo found sucessfully";
                res.Status = true;
                res.Result = todo;
            }
            else
            {
                res.Message = "Todo did not exists";
                res.Status = false;
                res.Result = null;
            }

        }

        catch(Exception ex)
        {
            res.Message = "Error :" + ex.Message;
            res.Status = false;
            res.Result = null;
        }

        return res;
    }

    [HttpPost("Add")]
    public async Task<ApiResponse<Todo>> Create(Todo todo, string projectId)
    {
        var res = new ApiResponse<Todo>();
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        try
        {
            if (userId == null)
            {
                res.Message = "user not found login again";
                res.Status = false;
                res.Result = null;
            }
            await _todoService.CreateAsync(todo,projectId);
            res.Message = "Todo added sucessfully";
            res.Status = true;
            res.Result = todo;

        }
        catch (Exception ex)
        {
            res.Message = "Error :" + ex.Message;
            res.Status = false;
            res.Result = null;
        }
        return res;
    }

    [HttpPut("UpdatebyId/{id}")]
    public async Task<ApiResponse<Todo>> Update(string id, Todo todo)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var res = new ApiResponse<Todo>();
        try
        {
            if (userId == null)
            {
                res.Message = "user not found login again";
                res.Status = false;
                res.Result = null;
            }
            if (todo == null || id == null)
            {
                res.Message = "Please enter the id or todo content:";
                res.Status = false;
                res.Result = null;
            }

            else
            {
                var now = DateTime.Now;
                todo.UpdatedAt = now;
                await _todoService.UpdateAsync(id, todo);
                res.Message = "Todo updated sucessfully:";
                res.Status = true;
                res.Result = todo;

            }

        }
        catch (Exception ex)
        {
            res.Message = "Error :" + ex.Message;
            res.Status = false;
            res.Result = null;
        }
        return res;
    }

    [HttpPatch("ChangeStatus/{id}")]
    public async Task<ApiResponse<Todo>> Updatestatus(string id)
    {
        var res = new ApiResponse<Todo>();
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        try
        {
            if (userId == null)
            {
                res.Message = "user not found login again";
                res.Status = false;
                res.Result = null;
            }
            var data = await GetById(id);
            if (data == null)
            {
                res.Message = "No todo exists for the current id";
                res.Status = false;
                res.Result = null;
            }
            else
            {
                await _todoService.UpdateTodoCompleted(id);
                res.Message = "todo status changed sucessfully";
                res.Status = true;
            }
        }
        catch (Exception ex)
        {
            res.Message = "Error :" + ex.Message;
            res.Status = false;
            res.Result = null;
        }
        return res;
    }

    [HttpDelete("Delete/{id}")]
    public async Task<ApiResponse<Todo>> Delete(string id)
    {
        var res = new ApiResponse<Todo>();
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        try
        {
            if (userId == null)
            {
                res.Message = "user not found login again";
                res.Status = false;
                res.Result = null;
            }
            if (id == null)
            {
                res.Message = "Please enter the todo id";
                res.Status = false;
                res.Result = null;
            }
            else
            {
                await _todoService.DeleteAsync(id);
                res.Message = "Todo deleted sucesfully";
                res.Status = true;
            }
        }
        catch (Exception ex)
        {
            res.Message = "Error :" + ex.Message;
            res.Status = false;
            res.Result = null;
        }
        return res;
    }

    [HttpGet("Gettasksbyname")]
    public async Task<ApiResponse<projectwithtask>> GetTasksbyname(string taskname, CancellationToken cancellation)
    {
        var res = new ApiResponse<projectwithtask>();
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null)
        {
            res.Message = "User is not logged in";
            res.Status = false;
            res.Result = null;
            return res;
        }

        if (string.IsNullOrEmpty(taskname))
        {
            res.Message = "task name is empty";
            res.Status = false;
            res.Result = null;
            return res;
        }

        try
        {
            var data = await _todoService.GetTaskbyname(userId, taskname, cancellation);
            if (data == null)
            {
                res.Message = "No task is found for the user";
                res.Status = false;
                res.Result = data;
                return res;
            }

            res.Message = "Task found sucessfully";
            res.Status = true;
            res.Result = data;
            return res;
        }

        catch (Exception ex)
        {
            res.Message = "Error :" + ex.Message;
            res.Status = false;
            res.Result = null;
        }
        return res;
    }

}