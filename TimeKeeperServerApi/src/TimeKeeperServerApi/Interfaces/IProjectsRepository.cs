using System.Collections.Generic;
using System.Threading.Tasks;
using TimeKeeperServerApi.Models;

namespace TimeKeeperServerApi.Interfaces
{
    public interface IProjectsRepository
    {
        Task<List<CustomProject>> LoadAllByUserIdAsync(string userId);
    }
}
