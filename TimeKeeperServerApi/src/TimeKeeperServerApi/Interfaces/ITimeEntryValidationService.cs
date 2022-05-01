using System.Threading.Tasks;
using TimeKeeperServerApi.Models;

namespace TimeKeeperServerApi.Interfaces
{
    public interface ITimeEntryValidationService
    {
        Task ValidateSaveAsync(TimeEntryDto timeEntry);
        
        Task ValidateUpdateAsync(TimeEntryDto timeEntry);
    }
}
