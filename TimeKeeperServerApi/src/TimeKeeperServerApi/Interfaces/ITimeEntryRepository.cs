using System.Collections.Generic;
using TimeKeeperServerApi.Models;
using System.Threading.Tasks;

namespace TimeKeeperServerApi.Interfaces
{
    public interface ITimeEntryRepository
    {
        Task<IEnumerable<TimeEntryDto>> LoadTimeEntriesAsync(string userId);
    }
}
