namespace TimeKeeperServerApi.Models
{
    public class TimeEntryDto
    {
        public string TimeEntryId { get; set; }

        public string ProjectId { get; set; }

        public string UserId { get; set; }

        public string ProjectName { get; set; }

        public string Date { get; set; }

        public int PriceMinor { get; set; }

        public string Remarks { get; set; }

        public bool IsPaid { get; set; }
    }
}