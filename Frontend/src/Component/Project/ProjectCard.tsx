import { Button, Card, Text, Title3, Body1, Dialog, DialogTrigger, DialogSurface, DialogBody, DialogTitle, DialogContent, DialogActions, Caption1, Badge, Menu, MenuTrigger, MenuPopover, MenuList, MenuItem } from "@fluentui/react-components";
import type { Project } from "../../types/Project/Project";
import { useNavigate } from "react-router-dom";
import { Delete20Regular, Edit20Regular, EyeRegular, MoreHorizontal24Regular } from "@fluentui/react-icons";
import { useState } from "react";
import { Task, type Taskvalues } from "../../types/Project/Taskvalues";

interface ProjectCardProps {
    project: Project;
    onEdit: (project: Project) => void;
    onDelete: (id: string) => void;
}

const priorityColor: Record<string, "informative" | "success" | "warning" | "danger"> = {
    low: "success",
    medium: "warning",
    high: "danger",
};


const statusColor: Record<string, "informative" | "success" | "warning" | "danger"> = {
    Pending: "warning",
    InProgress: "informative",
    Completed: "success",
};


const ProjectCard = ({ project, onEdit, onDelete }: ProjectCardProps) => {

    const navigate = useNavigate();
    const gototodopage = () => {
        navigate(`/home/${project.id}`)
    }
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    // return (
    //     <Card className="p-5">
    //         <div className="flex flex-col gap-3">
    //             <div className="flex flex-col gap-2">
    //                 <Title3>{project.name}</Title3>
    //                 <Body1>
    //                     <span className="font-semibold">Description:</span>{" "}
    //                     {project.description || "No description"}
    //                 </Body1>

    //                 <Body1>
    //                     <span className="font-semibold">Priority:</span>{" "}
    //                     {project.priority}
    //                 </Body1>

    //                 <Body1>
    //                     <span className="font-semibold">Status:</span>{" "}
    //                     {project.status}
    //                 </Body1>
    //             </div>

    //             <div className="text-sm text-gray-500">
    //                 Created: {new Date(project.createdAt).toLocaleDateString()}
    //             </div>

    //             <div className="mt-2 flex gap-2 justify-between">
    //                 <div className="flex gap-2 flex-col sm:flex-row">
    //                     <Button appearance="secondary" onClick={() => onEdit(project)}>
    //                         Edit
    //                     </Button>
    // <Dialog>
    //     <DialogTrigger disableButtonEnhancement>
    //         <Button appearance="primary" className="!bg-indigo-500">
    //             Delete
    //         </Button>
    //     </DialogTrigger>

    //     <DialogSurface>
    //         <DialogBody>
    //             <DialogTitle>Delete</DialogTitle>

    //             <DialogContent>
    //                 Are you sure you want to delete?
    //             </DialogContent>

    //             <DialogActions>
    //                 <DialogTrigger disableButtonEnhancement>
    //                     <Button appearance="secondary">
    //                         Cancel
    //                     </Button>
    //                 </DialogTrigger>

    //                 <Button appearance="primary" onClick={() => onDelete(project.id)} className="!bg-indigo-500">
    //                     Delete
    //                 </Button>
    //             </DialogActions>
    //         </DialogBody>
    //     </DialogSurface>
    // </Dialog>
    //                 </div>
    //                 <Button appearance="secondary" className="flex max-h-8" onClick={gototodopage}>
    //                     View
    //                 </Button>
    //             </div>
    //         </div>
    //     </Card>
    // );

    return (
        <Card className="p-4 !rounded-none">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0 gap-4">
                    <div>
                        <Text weight="semibold" className="!text-black cursor-pointer hover:underline !font-medium" onClick={gototodopage}>
                            {project.name}
                        </Text>
                    </div>
                    <div>
                        <Caption1 className="text-gray-500 block truncate">
                            {project.description || "No description"}
                        </Caption1>
                    </div>
                </div>

                <div className="sm:w-24 shrink-0">
                    <Badge appearance="tint" color={priorityColor[project.priority.toLowerCase()] ?? "informative"}>
                        {project.priority}
                    </Badge>
                </div>

                <div className="sm:w-32 shrink-0">
                    <Badge
                        appearance="tint"
                        color={statusColor[project.status] ?? "informative"}
                        shape="rounded"
                    >
                        {project.status}
                    </Badge>
                </div>

                <Caption1 className="sm:w-28 shrink-0 text-gray-500">
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                </Caption1>

                <div className="sm:ml-auto flex justify-end">
                    <Menu>
                        <MenuTrigger disableButtonEnhancement>
                            <Button appearance="subtle" icon={<MoreHorizontal24Regular />} />
                        </MenuTrigger>
                        <MenuPopover>
                            <MenuList>
                                <MenuItem icon={<Edit20Regular />} onClick={() => onEdit(project)}>
                                    Edit
                                </MenuItem>
                                <MenuItem icon={<EyeRegular />} onClick={gototodopage}>
                                    View
                                </MenuItem>
                                <MenuItem icon={<Delete20Regular />} onClick={() => setIsDeleteDialogOpen(true)}>
                                    Delete
                                </MenuItem>
                            </MenuList>
                        </MenuPopover>
                    </Menu>
                    <Dialog open={isDeleteDialogOpen} onOpenChange={(_, data) => setIsDeleteDialogOpen(data.open)}>
                        <DialogSurface className="!rounded-2xl !max-w-[384px] !sm:max-h-[223px]">
                            <DialogBody>
                                <DialogTitle>Delete</DialogTitle>
                                <DialogContent>
                                    Are you sure you want to delete this project? All associated tasks will be permanently removed. This action cannot be undone.
                                </DialogContent>
                                <DialogActions>
                                    <DialogTrigger disableButtonEnhancement>
                                        <Button appearance="secondary" className="!rounded-xl">
                                            Cancel
                                        </Button>
                                    </DialogTrigger>
                                    <Button appearance="primary" onClick={() => onDelete(project.id)} className=" !bg-[#E7000B] !rounded-xl">
                                        Delete
                                    </Button>
                                </DialogActions>
                            </DialogBody>
                        </DialogSurface>
                    </Dialog>

                </div>
            </div>
        </Card>
    );
};

export default ProjectCard;