using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TimeKeeperServerApi.Interfaces;
using TimeKeeperServerApi.Models;
using TimeKeeperServerApi.Models.Requests;
using TimeKeeperServerApi.Models.Responses;

namespace TimeKeeperServerApi.Controllers
{
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IRequestValidationService _validationService;

        public AuthController(IRequestValidationService validationService)
        {
            _validationService = validationService;
        }
        
        public async Task<IActionResult> LoginAsync(AuthRequest request)
        {
            var errors = _validationService.Validate(request).ToList();
            if (errors.Any())
            {
                return Ok(new AuthResponse {Status = RequestStatus.InvalidRequest});
            }

            return Ok(new AuthResponse
            {
                Status = RequestStatus.Ok, Jwt = "JWT"
            });
        }
    }
}
