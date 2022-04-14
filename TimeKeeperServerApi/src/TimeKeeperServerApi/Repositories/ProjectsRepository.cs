using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TimeKeeperServerApi.Interfaces;
using TimeKeeperServerApi.Models;

namespace TimeKeeperServerApi.Repositories
{
    public class ProjectsRepository : IProjectsRepository
    {
        public const string CustomProjectId1 = "07db390368cf4fc29a197da098663953";
        public const string CustomProjectId2 = "23472adc7abd4687bd993565d6d16665";

        private static readonly List<CustomProject> _projects = new List<CustomProject>
        {
            new CustomProject
            {
                CustomProjectId = CustomProjectId1,
                UserId = UserRepository.UserId1,
                Name = "G19"
            },
            new CustomProject
            {
                CustomProjectId = CustomProjectId2,
                UserId = UserRepository.UserId1,
                Name = "Hw5"
            }
        };

        public async Task<List<CustomProject>> LoadAllByUserIdAsync(string userId)
        {
            var projects = _projects.Where(p => p.UserId == userId);

            return projects.ToList();
        }
    }
}
