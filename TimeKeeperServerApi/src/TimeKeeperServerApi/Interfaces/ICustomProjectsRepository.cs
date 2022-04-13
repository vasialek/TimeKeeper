using System.Collections.Generic;
using System.Threading.Tasks;
using TimeKeeperServerApi.Models;

namespace TimeKeeperServerApi.Interfaces
{
    public interface ICustomProjectsRepository
    {
        Task<List<CustomTimeProject>> LoadAllByUserIdAsync(string userId);
    }
}
