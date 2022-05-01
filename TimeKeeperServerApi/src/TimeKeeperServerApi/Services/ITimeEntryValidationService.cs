using System.Threading.Tasks;
using TimeKeeperServerApi.Models;

namespace TimeKeeperServerApi.Services
{
    public interface ITimeEntryValidationService
    {
        Task ValidateUpdateAsync(TimeEntryDto timeEntry);
    }
}