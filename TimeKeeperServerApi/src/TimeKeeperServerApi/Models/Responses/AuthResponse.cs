using TimeKeeperServerApi.Controllers;

namespace TimeKeeperServerApi.Models.Responses
{
    public class AuthResponse
    {
        public RequestStatus Status { get; set; }

        public string Jwt { get; set; }
    }
}