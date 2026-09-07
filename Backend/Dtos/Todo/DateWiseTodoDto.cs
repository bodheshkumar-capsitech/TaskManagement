using Projects.Models;
    public class DateWiseTodoDto
    {
        public DateTime Date { get; set; }

        public List<Todo> Tasks { get; set; } = new();
    }
