using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TimeKeeperServerApi.Exceptions;
using TimeKeeperServerApi.Interfaces;
using TimeKeeperServerApi.Models;

namespace TimeKeeperServerApi.Services
{
    public class TimeEntryValidationService : ITimeEntryValidationService
    {
        private readonly IUniqueIdGenerator _uniqueIdGenerator;

        public TimeEntryValidationService(IUniqueIdGenerator uniqueIdGenerator)
        {
            _uniqueIdGenerator = uniqueIdGenerator;
        }


        public async Task ValidateSaveAsync(TimeEntryDto timeEntry)
        {
            var errors = new List<string>();

            if (_uniqueIdGenerator.IsValidUid(timeEntry.ProjectId) == false)
            {
                errors.Add("Project is not specified, please choose any.");
            }

            ThrowIfErrors(errors);
        }

        private static void ThrowIfErrors(List<string> errors)
        {
            if (errors.Any())
            {
                throw new InvalidObjectException("Can't save entry, because it is not valid.", errors);
            }
        }

        public async Task ValidateUpdateAsync(TimeEntryDto timeEntry)
        {
            throw new System.NotImplementedException();
        }
    }
}
