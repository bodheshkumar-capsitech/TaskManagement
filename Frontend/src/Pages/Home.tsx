import { useEffect, useState } from "react";
import TodoForm from "../Component/Todoform";
import TodoList from "../Component/TodoList";
import TodoPage from "../Component/TodoPage";
import type { Todo } from "../types/Todo";
import { createTodo, deleteTodo, getTodoById, getTodoByPage, getTodoByDatewise, updateStatus, updateTodo, getTodoByStatus, getTodoByPriority, getTodoByStatusAndPriority, logout } from "../api/todoApi";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { setTodos, deleteTodoRedux, toggleTodoRedux, updateTodoRedux, setPage, setTotal, setMonth, setYear, setDate, setLoading, setError } from "../features/Todo/todoSlice";
import { type Priority } from "../types/Priority";
import type { PriorityInput } from "../types/PriorityInput";
import { useParams } from "react-router-dom";
import { Button, Spinner } from "@fluentui/react-components";
import { ArrowLeft24Regular } from "@fluentui/react-icons";
import { useNavigate } from "react-router-dom";
import { getProjectById } from "../api/todoApi";
import { useMemo, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { id } from "zod/v4/locales";
import type { PaginatedResult } from "../types/PaginatedResult";

export const formatDate = (date: string | Date | null) => {
  if (!date) return "Date not found";

  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};

const Home = () => {
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const pageSize = 10;
  const dispatch = useDispatch()
  const { projectId } = useParams()
  const navigate = useNavigate()
  const projectMonth = useSelector((state: RootState) => state.project.month);
  const projectYear = useSelector((state: RootState) => state.project.year);
  // const todos = useSelector((state: RootState) => (state.todo.todos));
  const page = useSelector((state: RootState) => (state.todo.page));
  // const total = useSelector((state: RootState) => (state.todo.total));
  const month = useSelector((state: RootState) => (state.todo.month));
  const year = useSelector((state: RootState) => (state.todo.year));
  const date = useSelector((state: RootState) => (state.todo.date));
  const [search, setSearch] = useState("");
  const [projectname, setProjectname] = useState(String)

  const queryclient = useQueryClient()


  useEffect(() => {
    // loadtodos(),
    getProjectname()
  }, [page, month, year]);


  // const loadtodos = async () => {
  //   try {
  //     if (!projectId) {
  //       return;
  //     }
  //     dispatch(setLoading(true));

  //     console.log("running the gettodo function")
  //     const dateParam = date ? toDateOnlyString(date) : null;
  //     const data = await getTodoByPage(page, pageSize, projectId, month, year, dateParam);

  //     dispatch(setTodos(data.results));
  //     dispatch(setTotal(data.total));
  //     setFilteredTodos(data.results);
  //   }
  //   catch {
  //     dispatch(setError("Failed to load todos"));
  //     toast.error("Failed to load todos");
  //   }
  //   finally {
  //     dispatch(setLoading(false));
  //   }
  // };

  const dateParam = date ? toDateOnlyString(date) : null;

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "todos",
      projectId,
      page,
      pageSize,
      month,
      year,
      dateParam,
    ],

    queryFn: async () => {
      if (!projectId) {
        throw new Error("Project ID is missing");
      }

      console.log("running the gettodo function");

      return await getTodoByPage(
        page,
        pageSize,
        projectId,
        month,
        year,
        dateParam
      );
    },

    enabled: !!projectId,
  });

  const todos = data?.results ?? [];
  const total = data?.total ?? 0;


  const createTodoMutation = useMutation({
    mutationFn: (todoData: {
      title: string;
      description: string;
      priority: Priority;
      completed: boolean;
      duedate: Date | null;
      projectId: string;
    }) => {
      return createTodo(todoData, projectId!);
    },

    onSuccess: () => {
      toast.dismiss();
      toast.success("Todo added successfully");

      queryclient.invalidateQueries({
        queryKey: ["todos", projectId],
      });
    },

    onError: () => {
      toast.dismiss();
      toast.error("Failed to add todo");
    },
  });


  const addTodo = async (title: string, description: string, priority: Priority, duedate: Date | null) => {
    try {
      if (!projectId) {
        return;
      }
      if (!title.trim()) {
        toast.dismiss();
        toast.info("Please eneter title")
      }
      // await createTodo({ title, description, priority, completed: false, duedate, projectId }, projectId);
      createTodoMutation.mutate({
        title,
        description,
        priority,
        completed: false,
        duedate,
        projectId,
      });
      toast.dismiss();
      toast.success("Todo added sucessfully")
      // loadtodos()
    }
    catch {
      toast.dismiss();
      toast.error("Failed to add todo")
    }
  };



  const getTodosBySelectedDate = async (selectedDate: Date) => {
    try {
      if (!projectId) return;

      const dateString = toDateOnlyString(selectedDate);
      const data = await getTodoByDatewise(page, pageSize, projectId, month, year, dateString);

      if (data && data.length > 0) {
        // aggregation returns [{ date, tasks }]
        const tasks = data[0].tasks;

        dispatch(setTodos(tasks));
        dispatch(setTotal(tasks.length));

        setFilteredTodos(tasks);
      } else {
        dispatch(setTodos([]));
        dispatch(setTotal(0));

        setFilteredTodos([]);
      }
    } catch (error) {
      console.error(error);

      dispatch(setError("Failed to load todos by date"));
      toast.error("Failed to load todos by date");
    }
  };


  const deleteTodoMutation = useMutation({
    mutationFn: (id: string) => {
      return deleteTodo(id);
    },

    onSuccess: (_, id) => {
      toast.dismiss();
      toast.success("Todo deleted successfully");

      queryclient.setQueryData(
        ["todos", projectId, page, pageSize, month, year, dateParam],
        (oldData: PaginatedResult<Todo> | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            results: oldData.results.filter(
              (todo) => todo.id !== id
            ),
            total: Math.max(0, oldData.total - 1),
          };
        }
      );
    },

    onError: () => {
      toast.dismiss();
      toast.error("Failed to delete the todo");
    },
  });

  const deletedata = useCallback(async (id: string) => {
    try {
      // await deleteTodo(id);
      deleteTodoMutation.mutate(id);
      dispatch(deleteTodoRedux(id))
      toast.dismiss();
      toast.success("Todo deleted sucessfully")
      setFilteredTodos(prev => prev.filter(t => t.id !== id));
    }
    catch {
      toast.dismiss();
      toast.error("Failed to delete the todo")
    }

  }, [dispatch]);

  const toggleTodo = useCallback(async (id: string) => {
    try {
      await updateStatus(id);
      dispatch(toggleTodoRedux(id));
      toast.dismiss();
      toast.success("Todo staus changed")
      setFilteredTodos(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
    }
    catch {
      toast.dismiss();
      toast.error("Failed to change todo status")
    }

  }, [dispatch]);

  const toggleMutation = useMutation(
    {
      mutationFn: (id: string) => {
        return updateStatus(id);
      },

      // onSuccess: () => {
      //   toast.dismiss();
      //   toast.success("todo status updated sucessfully");

      //   queryclient.invalidateQueries({
      //     queryKey: ["todos", projectId],
      //   });
      // },

      onSuccess: (_, id) => {
        toast.dismiss();
        toast.success("Todo status updated successfully");

        // Update the cached todos directly
        queryclient.setQueryData(
          ["todos", projectId, page, pageSize, month, year, dateParam],
          (oldData: any) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              results: oldData.results.map((todo: Todo) =>
                todo.id === id
                  ? { ...todo, completed: !todo.completed }
                  : todo
              ),
            };
          }
        );
      },

      onError: () => {
        toast.dismiss();
        toast.error("failed to update the todo status");
      }
    }
  );

  // const searchTodo = async (title: string) => {
  //   try {
  //     var data = await getTodoByTitle(title);
  //     console.log("the data is ", data)

  //     if (title.trim() === "") {
  //       setFilteredTodos(todos)
  //       return
  //     }
  //     if (data != null) {
  //       toast.success("Todo found sucessfully")
  //       setIssearching(true)
  //       setFilteredTodos([data])
  //       // loadtodos()
  //     }
  //     else {
  //       toast.error("Todo did not exists")
  //       setFilteredTodos([])
  //     }
  //   }
  //   catch {
  //     toast.error("Failed to found todo")
  //     loadtodos()
  //   }
  // }

  const gettodoBypage = async (page: number, pagesize: number) => {
    if (!projectId) {
      return;
    }
    try {
      var data = await getTodoByPage(page, pagesize, projectId, month, year)
      toast.dismiss();
      toast.success(`Todo data found for page: ${page}`)
      setFilteredTodos(data.results)
      dispatch(setTodos(data.results));
      dispatch(setPage(page));
      dispatch(setTotal(data.total));
    }
    catch {
      toast.dismiss();
      toast.error("page data not found")
    }
  }

  const handleMonth = (month: number) => {
    dispatch(setMonth(month));
  }

  const handleYear = (year: number) => {
    dispatch(setYear(year));
  }

  const handleDate = (date: Date | null) => {
    dispatch(setDate(date));

    if (date) {
      getTodosBySelectedDate(date);
    }
  };

  const searchTodoTitle = useCallback((title: string) => {
    // try {
    //   if (title.trim().toLocaleLowerCase() === null) {
    //     setFilteredTodos(todos);
    //     return;
    //   }

    //   const filtered = todos.filter(todo =>
    //     todo.title.toLowerCase().includes(title.toLowerCase().toLocaleLowerCase())
    //   );
    //   setFilteredTodos(filtered);
    // }
    // catch {
    //   loadtodos()
    // }
    setSearch(title);
  }, [dispatch]);

  const filterTodos = useMemo(() => {

    if (search.trim() === "") {
      return todos;
    }

    return todos.filter(todo =>
      todo.title
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  }, [todos, search]);

  const searchTodobyStatus = async (status: boolean | null) => {
    try {
      const todo = await getTodoByStatus(status);
      if (status == null) {
        // loadtodos();
        return
      }
      toast.dismiss();
      toast.success("todo filtered sucessfully according to the status")
      setFilteredTodos(todo)
    }

    catch {
      toast.dismiss();
      toast.error("Failed to find todo");
    }
  }


  const searchTodobyPriority = async (priority: PriorityInput) => {
    try {
      if (priority === "All") {
        // loadtodos();
        toast.dismiss();
        toast.success("Todo found sucessfully")
      }
      const todo = await getTodoByPriority(priority);
      if (todo === null) {
        toast.dismiss();
        toast.error("Todo did not exist");
        return
      }
      toast.dismiss();
      toast.success("todo found sucessfully");
      setFilteredTodos(todo)
    }
    catch {
      toast.dismiss();
      toast.error("Failed to find todo");
    }

  }


  const searchTodoFilter = useCallback(async (status: boolean | null, priority: Priority | null) => {
    try {
      if (!projectId) {
        return;
      }
      const todo = await getTodoByStatusAndPriority(
        status,
        priority,
        projectId
      );
      console.log("the filtered todos are", todo)

      if (todo == null) {
        setFilteredTodos([]);
        queryclient.setQueryData(
          ["todos", projectId, page, pageSize, month, year, dateParam],
          { results: todo }
        );
        toast.dismiss();
        toast.info("No todos found");
        return;
      }

      toast.dismiss();
      toast.success("Todo filtered successfully");

      dispatch(setTodos(todo))
      setFilteredTodos(todo);

      queryclient.setQueryData(
        ["todos", projectId, page, pageSize, month, year, dateParam],
        { results: todo, total: todo.length }
      );
    }
    catch {
      toast.dismiss();
      toast.error("Failed to filter todo");
      setFilteredTodos([]);
    }
  }, [dispatch]);


  const updatedata = useCallback(async (id: string, title: string, description: string, priority: Priority) => {
    try {
      const todo = await getTodoById(id);
      if (!todo)
        return;

      todo.title = title;
      todo.description = description;
      todo.priority = priority
      console.log("The due date is ", todo.duedate)
      // await updateTodo(todo);
      updateTodoMutation.mutate(todo);
      // toast.dismiss();
      // toast.success("Todo updated sucessfully")
      // dispatch(updateTodoRedux(todo))
      // setFilteredTodos(prev => prev.map(t => (t.id === id ? { ...t, title, description, priority } : t)));
    }

    catch {
      toast.dismiss();
      toast.error("Failed to update the todo")
    }

  }, [dispatch]);

  const updateTodoMutation = useMutation({
    mutationFn: async ({
      id,
      title,
      description,
      priority,
    }: {
      id: string;
      title: string;
      description: string;
      priority: Priority;
    }) => {
      const todo = await getTodoById(id);

      if (!todo) {
        throw new Error("Todo not found");
      }

      todo.title = title;
      todo.description = description;
      todo.priority = priority;

      console.log("The due date is ", todo.duedate);

      return await updateTodo(todo);
    },

    onSuccess: (updatedTodo, variables) => {
      toast.dismiss();
      toast.success("Todo updated successfully");

      queryclient.setQueryData(
        ["todos", projectId, page, pageSize, month, year, dateParam],
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,

            results: oldData.results.map((todo: Todo) =>
              todo.id === variables.id
                ? updatedTodo
                : todo
            ),
          };
        }
      );
    },

    onError: () => {
      toast.dismiss();
      toast.error("Failed to update the todo");
    },
  });


  const getProjectname = async () => {
    try {
      if (!projectId) {
        return;
      }
      var data = await getProjectById(projectId);
      if (data == null) {
        toast.dismiss()
        toast.error("Project data not found")
      }
      setProjectname(data.name)

    }
    catch {
      toast.dismiss();
      toast.error("Project name unable to found");
    }
  }

  return (
    <div className="h-full p-2 flex flex-col overflow-hidden">
      <div className="flex sm:flex-row flex-col justify-between items-center mb-4 gap-2 w-full shrink-0">
        <Button appearance="subtle" shape="circular" aria-label="Go back" icon={<ArrowLeft24Regular />}
          onClick={() => navigate(-1)}>Back</Button>
        <h1 className="text-2xl font-bold">
          {projectname}
        </h1>
        <TodoForm onAdd={addTodo} />
      </div>
      <div className="m-2">
        <TodoPage page={page} pageSize={pageSize} total={total} month={month} year={year} date={date} onMonthChange={handleMonth} onYearChange={handleYear} onDateChange={handleDate} onPage={gettodoBypage}></TodoPage>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar">
        {isLoading ? (
          <Spinner label="Loading todos...." />
        ) : (
          <TodoList
            todos={filterTodos}
            onDelete={deleteTodoMutation.mutate}
            onToggle={toggleMutation.mutate}
            onUpdate={updatedata}
            onSearch={searchTodoTitle}
            onSearchFilter={searchTodoFilter}
          />)}
      </div>
    </div>
  );
};

export default Home;

export const toDateOnlyString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
