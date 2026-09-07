import { Body1, Spinner, Title3 } from "@fluentui/react-components";
import type { Project } from "../../types/Project/Project";
import ProjectCard from "./ProjectCard";

interface ProjectListProps {
  projects: Project[];
  loading: boolean;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

const ProjectList = ({ projects, loading, onEdit, onDelete }: ProjectListProps) => {
  return (
    <div className="w-full gap-2">
      {loading && projects.length === 0 ? (
        <Spinner label="Loading projects..." />
      ) : projects.length === 0 ? (
        <Body1 className="!flex !items-center !justify-center">No projects found. Create your first project.</Body1>
      ) : (
        <div className="mt-4 mb-10 w-full">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList; 