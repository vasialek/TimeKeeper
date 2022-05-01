using System.Collections.Generic;
using TimeKeeperServerApi.Models;
using System.Threading.Tasks;

namespace TimeKeeperServerApi.Interfaces
{
    public interface ITimeEntryRepository
    {
        Task<TimeEntryDto> SaveAsync(TimeEntryDto timeEntry);
        
        Task<IEnumerable<TimeEntryDto>> LoadTimeEntriesAsync(string userId);

        Task<TimeEntryDto> UpdateAsync(TimeEntryDto timeEntry);
    }
}
