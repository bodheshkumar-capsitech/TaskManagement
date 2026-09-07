namespace Projects.Models
{
    public class ProjectTaskDto
    {
        public string name { get; set; } = string.Empty;
        public Todo task { get; set; } = new Todo();
    }

    public class projectwithtask
    {
        public int totalcount { get; set; }
        public List<ProjectTaskDto> taskList { get; set; }
    }
}
