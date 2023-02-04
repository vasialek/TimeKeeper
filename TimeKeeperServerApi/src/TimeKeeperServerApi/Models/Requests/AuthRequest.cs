namespace TimeKeeperServerApi.Models.Requests
{
    public class AuthRequest
    {
        public string ClientId { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }
    }
}