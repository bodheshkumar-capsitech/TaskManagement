namespace Projects.Config.Db
{
    public class DbSettings
    {
        public string ConnectionString { get; set; } = null!;

        public string DatabaseName { get; set; } = null!;
        public string TodoCollection { get; set; } = null!;
        public string ProjectCollection { get; set; } = null!;

        public string AuthCollection { get; set; } = null!;


        public string BooksCollectionName { get; set; } = null!;

        public string AuthorsCollectionName { get; set; } = null!;

        public string GenresCollectionName { get; set; } = null!;

        public string BookShelfsCollectionName { get; set; } = null!;
    }
}
