namespace Projects.Models
{
    public class DashboardStatsDto
    {
            public int TotalProjects { get; set; }
            public int ActiveProjects { get; set; }
            public int TotalTasks { get; set; }
            public int CompletedTasks { get; set; }
            public int PendingTasks { get; set; }
    }
}
