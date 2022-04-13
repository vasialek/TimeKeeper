using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TimeKeeperServerApi.Interfaces;

namespace TimeKeeperServerApi.Controllers
{
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly ICustomProjectsRepository _customProjectsRepository;

        public ProjectsController(ICustomProjectsRepository customProjectsRepository)
        {
            _customProjectsRepository = customProjectsRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetCustomByUserAsync(string userId)
        {
            var projects = await _customProjectsRepository.LoadAllByUserIdAsync(userId);

            return Ok(projects);
        }
    }
}
