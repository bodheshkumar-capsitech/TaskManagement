import { useState } from "react";
import { Input, Button, Card, Switch, Dropdown, Option, Text, Dialog, DialogActions, DialogTrigger, DialogSurface, DialogBody, DialogTitle, DialogContent, Caption1, Badge } from "@fluentui/react-components";
import type { TodoItemProps } from "../types/TodoItemProps";
import { formatDate } from "../Pages/Home";
import type { Priority } from "../types/Priority";
import { PriorityValues } from "../types/Priority";
import Home from "../Pages/Home";


const TodoItem = ({
  todo,
  onDelete,
  onToggle,
  onUpdate,
}: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description);
  const [editPriority, setEditPriority] = useState<Priority>(todo.priority)

  const handleSave = () => {
    if (editedTitle.trim() === "")
      return;

    if (todo.completed)
      return;

    onUpdate(todo.id, editedTitle, editDescription, editPriority);
    setIsEditing(false);
  };

  const priorityColor: Record<string, "informative" | "success" | "warning" | "danger"> = {
    low: "success",
    medium: "warning",
    high: "danger",
  };

  // return (
  //   <div className="flex sm:flex-row bg-white items-center justify-center border p-3 rounded-2xl">
  //     <div className="flex flex-col items-start gap-3 flex-1 sm:flex-row md:items-center md:justify-between">

  //       <Switch
  //         checked={todo.completed}
  //         onChange={() => onToggle(todo.id)}
  //         />

  //       {isEditing ? (
  //           <div className="flex flex-col w-full">
  //         <Input
  //           type="text"
  //           value={editedTitle}
  //           onChange={(_,data) => setEditedTitle(data.value)}
  //           className="border rounded px-2 py-1 flex-1"
  //           />
  //           <Input
  //           type="text"
  //           value={editDescription}
  //           onChange={(_,data) => setEditDescription(data.value)}
  //           className="border rounded px-2 py-1 flex-1"
  //           />
  //           <Dropdown placeholder="Select Priority" value={editPriority} onOptionSelect={(_ ,data) => {setEditPriority(data.optionValue as Priority)}}>
  //           {PriorityValues.map((option) => (
  //           <Option key={option} value={option}>
  //             {option}
  //             </Option>
  //      ))}
  //     </Dropdown>
  //           </div>
  //       ) : (
  //           <span
  //           className={`flex-1 flex-col ${
  //               todo.completed ? "line-through text-gray-500" : ""
  //           }`}
  //           >
  //           <div>Title : {todo.title}</div>
  //           <div>Description : {todo.description}</div>
  //           <div>Priority : {todo.priority}</div>
  //          <div>Due Date: {formatDate(todo.duedate)}</div>
  //         </span>

  //       )}
  //     </div>

  //     <div className="flex gap-2 ml-4 flex-col sm:flex-row sm:justify-between sm:items-center">
  //       {isEditing ? (
  //           <Button
  //           onClick={handleSave}
  //           appearance="primary"
  //           className="!bg-indigo-500"
  //           >
  //           Save
  //         </Button>
  //       ) : (
  //           <Button
  //           onClick={() => setIsEditing(true)}
  //           appearance="primary"
  //           className="!bg-indigo-500"
  //           >
  //           Edit
  //         </Button>
  //       )}

  //       <Dialog>
  //         <DialogTrigger disableButtonEnhancement>
  //           <Button appearance="outline">
  //             Delete
  //           </Button>
  //         </DialogTrigger>

  //         <DialogSurface>
  //           <DialogBody>
  //             <DialogTitle>Delete</DialogTitle>

  //             <DialogContent>
  //               Are you sure you want to delete?
  //             </DialogContent>

  //             <DialogActions>
  //               <DialogTrigger disableButtonEnhancement>
  //                 <Button appearance="secondary">
  //                   Cancel
  //                 </Button>
  //               </DialogTrigger>

  //               <Button
  //                 appearance="primary"
  //                 onClick={() => onDelete(todo.id)}
  //                 className="!bg-indigo-500"
  //                 >
  //                 Delete
  //               </Button>
  //             </DialogActions>
  //           </DialogBody>
  //         </DialogSurface>
  //       </Dialog>
  //     </div>

  //   </div>
  // );


  return (
    <Card className="!rounded-xl border border-[#746fdb] flex flex-col h-full">
      {isEditing ? (
        <div className="flex flex-col w-full gap-2">
          <Input
            type="text"
            value={editedTitle}
            onChange={(_, data) => setEditedTitle(data.value)}
            className="border rounded px-2 py-1 flex-1"
          />
          <Input
            type="text"
            value={editDescription}
            maxLength={200}
            onChange={(_, data) => setEditDescription(data.value)}
            className="border rounded px-2 py-1 flex-1"
          />
          <Dropdown
            placeholder="Select Priority"
            value={editPriority}
            onOptionSelect={(_, data) => { setEditPriority(data.optionValue as Priority) }}
          >
            {PriorityValues.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Dropdown>
          <Button onClick={handleSave} appearance="primary" className="!bg-indigo-500 !rounded-xl self-start">
            Save
          </Button>
        </div>
      ) : (
        <>
          <div className={`flex flex-col ${todo.completed ? "opacity-60" : ""}`}>
            <div className="flex flex-row items-center justify-between">
              <Text weight="semibold" className={todo.completed ? "line-through text-gray-500" : ""}>
                {todo.title}
              </Text>
              <Switch
                checked={todo.completed}
                onChange={() => onToggle(todo.id)}
              />
            </div>

            <Caption1 className="text-gray-500">
              {!todo.description ? "No describtion" : todo.description}
            </Caption1>
          </div>

          <div className="mt-auto pt-4">
            <div className="flex flex-row items-center justify-between flex-wrap gap-2">
              <div className="flex flex-row items-center gap-3 shrink-0">
                <Caption1 className="text-gray-600 whitespace-nowrap">
                  Due {formatDate(todo.duedate)}
                </Caption1>

                <Badge appearance="tint" color={priorityColor[todo.priority.toLowerCase()] ?? "informative"}>
                  {todo.priority}
                </Badge>

                <Badge appearance="tint" color={todo.completed ? "success" : "brand"} shape="rounded">
                  {todo.completed ? "Completed" : "Pending"}
                </Badge>
              </div>

              <div className="flex flex-row items-center gap-2 shrink-0">
                <Button
                  onClick={() => setIsEditing(true)}
                  appearance="outline"
                  className="!rounded-xl"
                  disabled={todo.completed}
                >
                  Edit
                </Button>

                <Dialog>
                  <DialogTrigger disableButtonEnhancement>
                    <Button appearance="primary" className="!bg-[#E7000B] !rounded-xl">
                      Delete
                    </Button>
                  </DialogTrigger>

                  <DialogSurface>
                    <DialogBody>
                      <DialogTitle>Delete</DialogTitle>
                      <DialogContent>
                        Are you sure you want to delete?
                      </DialogContent>
                      <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                          <Button appearance="secondary" className="!rounded-xl">
                            Cancel
                          </Button>
                        </DialogTrigger>
                        <Button
                          appearance="primary"
                          onClick={() => onDelete(todo.id)}
                          className="!bg-[#E7000B] !rounded-xl"
                        >
                          Delete
                        </Button>
                      </DialogActions>
                    </DialogBody>
                  </DialogSurface>
                </Dialog>
              </div>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default TodoItem;