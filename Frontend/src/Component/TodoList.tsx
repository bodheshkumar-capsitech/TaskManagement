import TodoItem from "./Todoitem";
import type { TodoListProps } from "../types/TodoListProps";
import type { TodoStatusProps } from "../types/TodoStatusProps";
import { Input, Button, Dropdown, Option } from "@fluentui/react-components";
import { useState } from "react";
import type { Priority } from "../types/Priority";
import { PriorityValues } from "../types/Priority";
import { setDate } from "../features/Todo/todoSlice";
import { useDispatch } from "react-redux";

const TodoList = ({
  todos,
  onDelete,
  onToggle,
  onUpdate,
  onSearch,
  onSearchFilter,
}: TodoListProps) => {

  const dispatch = useDispatch();
  const [searchtodo, setSearchtodo] = useState("")
  const [seartodobydate, setSearchtodobydate] = useState<Date>()
  const [searchtodopriority, setSearchtodopriority] = useState<Priority>();
  const [selectedStatus, setSelectedStatus] =
    useState<boolean | null>(null);

  const [selectedPriority, setSelectedPriority] =
    useState<Priority | null>(null);
  const input = <div className="flex flex-col sm:flex-row gap-2">
    <Input placeholder="enter the title to search" value={searchtodo} onChange={(_, data) => { setSearchtodo(data.value); onSearch(data.value) }} className="w-60"></Input>
  </div>

  const options = ["All", "Completed", "Pending"]

  const handleStatusChange = (value: string) => {

    let status: boolean | null = null;

    switch (value) {
      case "Completed":
        status = true;
        break;

      case "Pending":
        status = false;
        break;

      case "All":
      default:
        status = null;
        break;
    }

    setSelectedStatus(status);
    onSearchFilter(status, selectedPriority);
    dispatch(setDate(null))
  };

  const handlePriorityChange = (value: string) => {

    const priority =
      value === "All"
        ? null
        : value as Priority;

    setSelectedPriority(priority);
    onSearchFilter(selectedStatus, priority);
    dispatch(setDate(null))
  };

  const handleDateChange = (date: Date) => {
    setSearchtodobydate(date)
  }

  return (
    <div className="flex flex-col gap-4 mb-10 h-full overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:items-center sm:justify-between shrink-0">
        <div>{input}</div>
        <Dropdown
          placeholder="Select status"
          defaultValue="All"
          className="w-60"
          onOptionSelect={(_, data) => {
            handleStatusChange(data.optionValue ?? "All");
          }}
        >
          {options.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Dropdown>

        <Dropdown
          placeholder="Select Priority"
          defaultValue="All"
          className="w-60"
          onOptionSelect={(_, data) => {
            handlePriorityChange(data.optionValue ?? "All");
          }}
        >
          <Option value="All">
            All
          </Option>

          {PriorityValues.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Dropdown>


      </div>
      <div className="flex-1 overflow-y-auto hide-scrollbar min-h-0">

        {todos.length === 0 ? (
          <h2>No Todos Found</h2>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onDelete={onDelete}
                onToggle={onToggle}
                onUpdate={onUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList;