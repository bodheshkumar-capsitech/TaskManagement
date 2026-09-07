import { Button, Card, Field, Input, Textarea, Title3, Body1, Spinner, Dropdown, Option, DialogActions, DialogBody, DialogSurface, Dialog, DialogContent, DialogTitle } from "@fluentui/react-components";
import type { ProjectFormProps } from "../../types/Project/ProjectFormProps";
import type { Priority } from "../../types/Priority";
import { PriorityValues } from "../../types/Priority";
import type { Taskvalues } from "../../types/Project/Taskvalues";
import { Task } from "../../types/Project/Taskvalues";
import { projectSchema } from "../../Validation/projectSchema";
import { useEffect, useState } from "react";
import { AddRegular } from "@fluentui/react-icons";


const ProjectForm = ({
  name,
  description,
  priority,
  status,
  editingId,
  loading,
  error,
  onNameChange,
  onDescriptionChange,
  onPriorityChange,
  onStatusChange,
  onSubmit,
  onCancel,
}: ProjectFormProps) => {

  const [validationErrors, setValidationErrors] = useState<{ name?: string; description?: string; }>({});
  const [open, setOpen] = useState(false);
  const [wasLoading, setWasLoading] = useState(false);

  const validateForm = () => {
    const result = projectSchema.safeParse({
      name,
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

  useEffect(() => {
    if (editingId) setOpen(true);
  }, [editingId]);

  useEffect(() => {
    if (wasLoading && !loading && !error) {
      setOpen(false);
      setValidationErrors({});
    }
    setWasLoading(loading);
  }, [loading]);

  const handleOpenNew = () => {
    onCancel();
    setValidationErrors({});
    setOpen(true);
  };

  const handleCancel = () => {
    onCancel();
    setValidationErrors({});
    setOpen(false);
  };

  
  return (
    <div>
      <Button appearance="primary" icon={<AddRegular />} onClick={handleOpenNew} className="!bg-[#4F46E5] !rounded-xl">
        New Project
      </Button>

      <Dialog
        open={open}
        onOpenChange={(_, data) => {
          setOpen(data.open);
          if (!data.open) {
            onCancel();
            setValidationErrors({});
          }
        }}
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>{editingId ? "Edit Project" : "Create Project"}</DialogTitle>

            <DialogContent>
              <div id="project-form" className="flex flex-col gap-4">
                <Field
                  label="Project Name"
                  required
                  validationState={validationErrors.name ? "error" : "none"}
                  validationMessage={validationErrors.name}
                >
                  <Input
                    value={name}
                    placeholder="Enter project name"
                    onChange={(_, data) => onNameChange(data.value)}
                  />
                </Field>

                <Field label="Description">
                  <Textarea
                    value={description}
                    placeholder="Enter project description"
                    maxLength={200}
                    onChange={(_, data) => onDescriptionChange(data.value)}
                  />
                </Field>

                <Field label="Priority">
                  <Dropdown
                    placeholder="Select Priority"
                    value={priority}
                    onOptionSelect={(_, data) => onPriorityChange(data.optionValue as Priority)}
                  >
                    {PriorityValues.map((option) => (
                      <Option key={option} value={option}>
                        {option}
                      </Option>
                    ))}
                  </Dropdown>
                </Field>

                <Field label="Status">
                  <Dropdown
                    placeholder="Select Status"
                    value={Object.keys(Task).find((key) => Task[key as keyof typeof Task] === status)}
                    onOptionSelect={(_, data) => onStatusChange(Number(data.optionValue) as Taskvalues)}
                  >
                    {Object.entries(Task).map(([label, value]) => (
                      <Option key={value} value={String(value)}>
                        {label}
                      </Option>
                    ))}
                  </Dropdown>
                </Field>

                {error && <Body1 className="text-red-600">{error}</Body1>}
              </div>
            </DialogContent>

            <DialogActions>
              <Button appearance="secondary" onClick={handleCancel} className="!rounded-xl">
                Cancel
              </Button>

              <Button
                appearance="primary"
                onClick={() => {
                  if (validateForm()) {
                    onSubmit();
                  }
                }}
                disabled={loading}
                className="!bg-[#4F46E5] !rounded-xl"
              >
                {loading ? <Spinner size="tiny" /> : editingId ? "Update Project" : "Create Project"}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
};

export default ProjectForm;