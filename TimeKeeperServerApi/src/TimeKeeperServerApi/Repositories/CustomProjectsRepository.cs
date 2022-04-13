using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TimeKeeperServerApi.Interfaces;
using TimeKeeperServerApi.Models;

namespace TimeKeeperServerApi.Repositories
{
    public class CustomProjectsRepository : ICustomProjectsRepository
    {
        private static readonly List<CustomTimeProject> _projects = new List<CustomTimeProject>
        {
            new CustomTimeProject
            {
                CustomTimeProjectId = "07db390368cf4fc29a197da098663953",
                UserId = "2568a55ee3fb4829a800c5b832ddb6af",
                Name = "G19"
            }
        };

        public async Task<List<CustomTimeProject>> LoadAllByUserIdAsync(string userId)
        {
            var projects = _projects.Where(p => p.UserId == userId);

            return projects.ToList();
        }
    }
}
