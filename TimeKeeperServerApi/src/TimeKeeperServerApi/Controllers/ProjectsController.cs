using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TimeKeeperServerApi.Interfaces;

namespace TimeKeeperServerApi.Controllers
{
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        public static readonly int MaxCustomProjects = 5;
        
        private readonly IProjectsRepository _projectsRepository;

        public ProjectsController(IProjectsRepository projectsRepository)
        {
            _projectsRepository = projectsRepository;
        }

        [HttpGet("getcustomebyuser")]
        public async Task<IActionResult> GetCustomByUserAsync(string userId)
        {
            var projects = (await _projectsRepository.LoadAllByUserIdAsync(userId))
                .OrderBy(p => p.Name)
                .Take(MaxCustomProjects)
                .ToList();
             
            return Ok(projects);
        }
    }
}
