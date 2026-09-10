import api from "./api";
import type { Todo } from "../types/Todo";
import type { Apiresponse } from "../types/Apiresponse";
import type { Loginresponse } from "../types/Loginresponse";
import type { Registerresponse } from "../types/Registerresponse";
import type { PaginatedResult } from "../types/PaginatedResult";
import type { CheckAuthResponse } from "../types/CheckAuthResponse";
import type { Taskbyprojectstats } from "../types/Dashboard/TaskbyProjectstats";
import type { TaskPriority } from "../features/Dashboard/TaskPriority";
import { toast } from "react-toastify";
import type { Priority } from "../types/Priority";
import type { PriorityInput } from "../types/PriorityInput";
import type { Project } from "../types/Project/Project";
import type { DateWiseTodo } from "../types/DateWiseTodo";
import type { DashboardStats } from "../types/Dashboard/DashboardStats";
import type { ProjectWithTask } from "../types/Task/ProjectWithTask";
import type { Users } from "../types/Users/Users";


//Todos
export const getTodos = async () => {
  const response = await api.get<Apiresponse<Todo[]>>("/Todo/GetAll");
  return response.data.result;
};

export const getTodoById = async (id: string) => {
  const response = await api.get<Apiresponse<Todo>>(`/Todo/GetbyId/${id}`);
  return response.data.result;
};

export const getTodoByPage = async (page: number, pagesize: number, projectId: string, month?: number,year?: number, date?: string | null) => {
  console.log("The project date is ", date)
  const response = await api.get<Apiresponse<PaginatedResult<Todo>>>(`/Todo/GetByPage`, { params: { page, pagesize, projectId, month, year, date}, });
  return response.data.result;
}

export const getTodoByDatewise = async (page:number,pagesize:number,projectId:string,month? : number,year?: number,date?: string) => 
{
  const response = await api.get<Apiresponse<DateWiseTodo[]>>(`Todo/GetDateWiseTasks`,{ params: { page, pagesize, projectId, month, year, date}, });
  return response.data.result;
}

export const getTodoByPageWithDate = async (page:number,pageSize:number,projectId:string,date:Date) =>
{
  const response = await api.get<Apiresponse<PaginatedResult<Todo>>>(`/Todo/GetByPageWithDate`,{ params: {page,pageSize,projectId,date},});
  return response.data.result;

}

export const getTodoByStatus = async (status: boolean | null) => {
  const response = await api.get<Apiresponse<Todo[]>>(`/Todo/Getbystatus`, { params: { status, }, });
  return response.data.result;
}

export const getTodoByPriority = async (priority: PriorityInput) => {
  const response = await api.get<Apiresponse<Todo[]>>(`/Todo/GetbyPriority`, { params: { priority, }, });
  return response.data.result;
}


export const getTodoByStatusAndPriority = async (
  status: boolean | null,
  priority: Priority | null,
  projectId: string
) => {

  const response = await api.get<Apiresponse<Todo[]>>(
    "/Todo/Filter",
    {
      params: {
        status: status,
        priority: priority,
        projectId
      }
    }
  );

  return response.data.result;
};


export const getTodoByTitle = async (title: string) => {
  const response = await api.get<Apiresponse<Todo>>(`/Todo/GetbyTitle`, { params: { title, }, });
  return response.data.result;
}

export const createTodo = async (todo: Omit<Todo, "id">, projectId: string) => {
  const response = await api.post<Apiresponse<Todo>>("/Todo/Add", todo, { params: { projectId, }, });
  return response.data.result;
};

export const updateTodo = async (todo: Todo) => {
  const response = await api.put<Apiresponse<Todo>>(`/Todo/UpdatebyId/${todo.id}`, todo);
  return response.data.result;
};

export const updateStatus = async (id: string) => {
  const response = await api.patch<Apiresponse<Todo>>(`/Todo/ChangeStatus/${id}`);
  return response.data.result;
};

export const deleteTodo = async (id: string) => {
  await api.delete(`/Todo/Delete/${id}`);
};

export const getTodosbyname = async (taskname:string) =>
{
  const response = await api.get<Apiresponse<ProjectWithTask>>("/Todo/Gettasksbyname", { params: { taskname, }, });
  return response.data.result;
}


// Auth 
export const checkAuth = async () => {
  const response = await api.get<CheckAuthResponse>(`/Auth/CheckAuth`,
    {
      withCredentials: true
    }
  );
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await api.post<Apiresponse<Loginresponse>>(`/Auth/Login`, { userName: email, password: password },
    {
      withCredentials: true
    }
  );
  return response.data.result
}

export const register = async (email: string, password: string, fullname:string) => {
  const response = await api.post<Apiresponse<Registerresponse>>(`/Auth/Register`, { Email: email, Password: password, FullName: fullname });
  toast.dismiss()
  return response.data.result
}


export const logout = async () => {
  const response = await api.post("/Auth/Logout",
    {},
    {
      withCredentials: true
    }
  );

  console.log("the logout is ", response.data)
  return response.data;
};

export const deleteuser = async () =>
{
  const response = await api.post("/Auth/Deleteuser");
  console.log("the delete account data is ",response.data)
  return response.data
}

// Refresh token 
export const refresh = async () => {
  console.log("Calling refresh token")
  const response = await api.post(`/Auth/Refresh`,
    {},
    {
      withCredentials: true
    }
  );
  console.log("Refreshing token ", response.data)
  return response.data
}


// Project

export const getProjects = async () => {
  const response = await api.get<Apiresponse<Project>>(`/Project/GetAll`)
  console.log("the loaded project data is", response.data.result)
  return response.data.result;
}

export const getProjectById = async (id: string) => {
  const response = await api.get<Apiresponse<Project>>(`/Project/GetbyId/${id}`);
  return response.data.result;
};

export const getProjectByName = async (name: string) => {
  const response = await api.get<Apiresponse<Project>>(`/Project/name/${encodeURIComponent(name)}`);
  return response.data.result;
};

export const getProjectsByPage = async (page: number, pageSize: number, year?: number, month?: number) => {
  const response = await api.get<Apiresponse<PaginatedResult<Project>>>("/Project/GetbyPage",
    {
      params: {
        page,
        pageSize,
        year,
        month
      },
    }
  );
  return response.data.result;
};

export const createProject = async (project: Omit<Project, "id" | "userid" | "createdAt" | "UpdatedAt">) => {
  const response = await api.post<Apiresponse<Project>>("/Project/Create", project);
  return response.data.result;
};

export const updateProject = async (project: Project) => {
  const response = await api.put<Apiresponse<Project>>(`/Project/UpdatebyId/${project.id}`, project);
  return response.data.result;
};

export const deleteProject = async (id: string) => {
  const response = await api.delete<Apiresponse<string>>(`/Project/DeletebyId/${id}`);
  return response.data.result;
};

export const gettaskswithprojectname = async (page: number,pageSize: number) =>
{
  const response = await api.get<Apiresponse<ProjectWithTask>>("/Project/Gettaskswithprojectname",{
    params:
    {
      page,
      pageSize
    }
  });
  return response.data.result;
}


// Dashboard

export const getdashboardStats = async () =>
{
  const response = await api.get<Apiresponse<DashboardStats>>("/Project/GetDasboardStats");
  return response.data.result;
}

export const gettaskbyProjectStats = async () =>
{
  const response = await api.get<Apiresponse<Taskbyprojectstats[]>>("/Project/GetTaskbyProjectStats");
  return response.data.result;
}

export const getalltaskcountbyPriority = async () =>
{
  const response = await api.get<Apiresponse<TaskPriority>>("/Project/GetAllTaskCountbyPriorityStats");
  return response.data.result;
}


// Users

export const getAllUsers = async () =>
{
  const response = await api.get<Apiresponse<Users>>("/Auth/GetAllUsers");
  return response.data.result;
}