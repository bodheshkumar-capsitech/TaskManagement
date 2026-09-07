import { useEffect } from "react";
import { Title3, Button, Dialog, DialogTrigger, DialogSurface, DialogTitle, DialogBody, DialogActions, DialogContent } from "@fluentui/react-components";
import { getProjects, getProjectsByPage, createProject, updateProject, deleteProject } from "../api/todoApi";
import type { Project } from "../types/Project/Project";
import ProjectForm from "../Component/Project/ProjectForm";
import ProjectList from "../Component/Project/ProjectList";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setProjects, addProject, updateProjectRedux, deleteProjectRedux, setName, setDescription, setPriority, setStatus, setLoading, setError, setPage, setPageSize, setTotal, setYear, setMonth, clearForm, editProject, } from "../features/Projects/projectSlice"
import type { RootState } from "../app/store";
import { logout } from "../api/todoApi";
import { logoutredux } from "../features/Auth/authSlice";
import { useNavigate } from "react-router-dom";
import Projectpage from "../Component/Project/Projectpage";
import { ArrowExitRegular } from "@fluentui/react-icons";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import NavSidebar from "../Component/Home/NavSidebar";


const ProjectPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { projects, name, description, priority, status, editingId, loading, error, page, pageSize, total, year, month } = useSelector((state: RootState) => state.project)

  // const {isAuthenticated, logoutUser} = useAuth()
  const context = useContext(AuthContext)

  const loadProjects = async (selectedPage = page, selectedPageSize = pageSize, selectedYear = year, selectedMonth = month) => {
    try {
      dispatch(setLoading(true))
      dispatch(setError(""))
      const data = await getProjectsByPage(selectedPage, selectedPageSize, selectedYear, selectedMonth);
      dispatch(setProjects(data.results))
      dispatch(setTotal(data.total))
    }
    catch (err) {
      console.error(err);
    }
    finally {
      dispatch(setLoading(false))
    }
  };

  const onLogout = async () => {
    // try {
    //   setTimeout(async () => {
    //     await logout()
    //     // dispatch(logoutredux())
    //     context?.logoutUser()
    //     navigate("/")
    //     toast.dismiss();
    //     toast.success("Logged out sucessfully");
    //   }, 1000)
    // }
    // catch {
    //   toast.dismiss();
    //   toast.error("Failed to logout")
    // }
    logoutMutation.mutate();
  }

  const logoutMutation = useMutation(
    {
      mutationFn: async () => {
        return await logout();
      },

      onSuccess: () => {

        setTimeout(() => {
          context?.logoutUser();
          navigate("/");
          toast.dismiss();
          toast.success("Logged out sucessfully");
        }, 1000)
      },

      onError: () => {
        toast.dismiss();
        toast.error("failed to logout");
      }
    }
  );

  useEffect(() => {
    loadProjects(page, pageSize, year, month);
  }, [page, pageSize, year, month]);

  const clearform = () => {
    dispatch(clearForm())
  };

  const handleSubmit = async () => {
    dispatch(setError(""));

    // if (!name.trim()) {
    //   dispatch(setError("Project name is required"));
    //   return;
    // }

    try {
      dispatch(setLoading(true));

      if (editingId) {
        const existingProject = projects.find((project) => project.id === editingId);
        if (!existingProject) return;

        const updatedProject: Project = {
          ...existingProject,
          name: name.trim(),
          description: description.trim(),
          priority: priority,
          status: status,
          UpdatedAt: new Date().toISOString(),
        };

        const result = await updateProject(updatedProject);
        dispatch(updateProjectRedux(result))
        toast.success("project updated sucessfully")
      }
      else {
        const result = await createProject({ name: name.trim(), description: description.trim(), priority: priority, status: status });
        dispatch(addProject(result))
        toast.success("project created sucessfully")

      }

      clearform();
    }
    catch (err) {
      console.error(err);
      dispatch(setError(editingId ? "Failed to update project" : "Failed to create project"));
      toast.error(editingId ? "Failed to update project" : "Failed to create project");

    }
    finally {
      dispatch(setLoading(false));
    }
  };

  const handleEdit = (project: Project) => {
    dispatch(editProject(project))
    document.getElementById("project-form")?.scrollIntoView(
      {
        behavior: "smooth",
        block: "start",
      }
    )
  };

  const handleDelete = async (id: string) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(""));
      await deleteProject(id);
      toast.dismiss();
      toast.success("Task deleted sucessfully")
      dispatch(deleteProjectRedux(id))
    } catch (err) {
      console.error(err);
      dispatch(setError("Failed to delete project"));
      toast.dismiss();
      toast.error("Failed to delete project");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="relative z-50 flex mb-4 items-center justify-between">
        {/* <div>
          <Title3>My Projects</Title3>
        </div> */}
        <div>
          <Projectpage page={page} pageSize={pageSize} total={total} onPage={(newPage, newPageSize) => {
            dispatch(setPage(newPage));
            dispatch(setPageSize(newPageSize));
          }} year={year} month={month} onYearChange={(newyear) => {
            dispatch(setYear(newyear))
          }
          }
            onMonthChange={(newmonth) => {
              dispatch(setMonth(newmonth))
            }
            } />
        </div>
        <div className="flex flex-col gap-6">
          <ProjectForm
            name={name}
            description={description}
            priority={priority}
            status={status}
            editingId={editingId}
            loading={loading}
            error={error}
            onNameChange={(value) => {
              dispatch(setName(value))
            }
            }
            onDescriptionChange={(value) => {
              dispatch(setDescription(value))
            }
            }
            onPriorityChange={(value) => {
              dispatch(setPriority(value))
            }
            }
            onStatusChange={(value) => {
              dispatch(setStatus(value))
            }
            }
            onSubmit={handleSubmit}
            onCancel={clearform}
          />
        </div>
        
      </div>

      <div className="relative z-0 flex overflow-y-auto hide-scrollbar">
        <ProjectList projects={projects} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default ProjectPage;