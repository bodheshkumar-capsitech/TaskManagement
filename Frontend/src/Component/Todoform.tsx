import { useState } from "react";
import { Button, Input, Dropdown, Option, Field, Popover, PopoverTrigger, PopoverSurface, Dialog, DialogTrigger, DialogSurface, DialogTitle, DialogContent, DialogBody, DialogActions } from "@fluentui/react-components";
import { DatePicker } from "@fluentui/react-datepicker-compat";
import type { TodoFormProps } from "../types/TodoFormProps";
import { PriorityValues, type Priority } from "../types/Priority";
import { todoSchema } from "../Validation/todoSchema";

const TodoForm = ({ onAdd }: TodoFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<Priority>("Medium")
  const [selectedDate, setSelectdate] = useState<Date>(new Date())
  const [errorinput, setErrorinput] = useState<string | undefined>(undefined)
  const [projectId, setProjectid] = useState("")
  const [validationErrors, setValidationErrors] = useState<{ title?: string; description?: string; }>({});
  const [open, setOpen] = useState(false);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // if (!title.trim())
    // {
    //   setErrorinput("title field is required...")
    //   return;
    // }

    setErrorinput(undefined)
    onAdd(title, description, priority, selectedDate, projectId);

    setTitle("");
    setDescription("");
    setPriority("Medium");
    setSelectdate(new Date());
    setOpen(false);
  };


  const validateForm = () => {
    const result = todoSchema.safeParse({
      title,
      description
    });

    if (!result.success) {
      const errors: typeof validationErrors = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof typeof errors;

        errors[field] = issue.message;
      });

      setValidationErrors(errors);

      return false;
    }

    setValidationErrors({});
    return true;
  };

  return (
    <div>
    <Dialog
      open={open}
      onOpenChange={(_, data) => setOpen(data.open)}
    >
      <DialogTrigger disableButtonEnhancement>
        <Button appearance="primary" className="!bg-[#4F46E5] !rounded-xl !px-2">
          + Add Todo
        </Button>
      </DialogTrigger>

      <DialogSurface className="!mx-2 sm:!mx-auto">
        <form
          onSubmit={(e) => {
            if (validateForm()) {
              handleSubmit(e);
            } else {
              e.preventDefault();
            }
          }}
        >
          <DialogBody>

            <DialogTitle>
              Add Todo
            </DialogTitle>

            <DialogContent>
              <div className="flex flex-col gap-4 mt-4">
                <Field
                  label="Title"
                  validationState={
                    validationErrors.title
                      ? "error"
                      : "none"
                  }
                  validationMessage={
                    validationErrors.title
                  }
                >
                  <Input
                    type="text"
                    placeholder="Enter Todo..."
                    value={title}
                    maxLength={40}
                    onChange={(_, data) => {
                      setTitle(data.value);
                      if (data.value.trim()) {
                        setErrorinput(undefined)
                      }
                    }}
                    className="border p-3 rounded w-full"
                  />
                </Field>

                <Field label="Description">
                  <Input
                    type="text"
                    placeholder="Enter description..."
                    value={description}
                    maxLength={100}
                    onChange={(_, data) => setDescription(data.value)}
                    className="border p-3 rounded w-full"
                  />
                </Field>

                <Field label="Priority">
                  <Dropdown placeholder="Select Priority" value={priority} onOptionSelect={(_, data) => { setPriority(data.optionValue as Priority) }}>
                    {PriorityValues.map((option) => (
                      <Option key={option} value={option}>
                        {option}
                      </Option>
                    ))}
                  </Dropdown>
                </Field>

                <Field label="Due Date">
                  <DatePicker
                    placeholder="Select a date..."
                    value={selectedDate}
                    minDate={new Date()}
                    onSelectDate={(data) => setSelectdate(data ?? new Date())}
                  />
                </Field>

              </div>
            </DialogContent>

            <DialogActions>

              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary" className="!rounded-xl">
                  Cancel
                </Button>
              </DialogTrigger>

              <Button
                appearance="primary"
                type="submit"
                className="!bg-[#4F46E5] !rounded-xl"
              >
                Add
              </Button>

            </DialogActions>

          </DialogBody>
        </form>
      </DialogSurface>
    </Dialog>
    </div>
  );
};

export default TodoForm;