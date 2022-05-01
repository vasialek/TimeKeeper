using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TimeKeeperServerApi.Interfaces;
using TimeKeeperServerApi.Models;

namespace TimeKeeperServerApi.Repositories
{
    public class TimeEntryRepository : ITimeEntryRepository
    {
        private static readonly List<TimeEntryDto> _timeEntries = new List<TimeEntryDto>
        {
            new TimeEntryDto
            {
                TimeEntryId = "9a4a714db16e47b28a1a07d938f37578",
                UserId = UserRepository.UserId1,
                ProjectId = ProjectsRepository.CustomProjectId1,
                Date = "2022-04-10",
                PriceMinor = 50
            },
            new TimeEntryDto
            {
                TimeEntryId = "6bff5e5eaf794574ac5dbc1d1e9948e0",
                UserId = UserRepository.UserId1,
                ProjectId = ProjectsRepository.CustomProjectId1,
                Date = "2022-04-10",
                PriceMinor = 50
            },
        };

        public async Task<IEnumerable<TimeEntryDto>> LoadTimeEntriesAsync(string userId)
        {
            return _timeEntries
                .Where(t => t.UserId == userId)
                .ToList();
        }

        public async Task<TimeEntryDto> UpdateAsync(TimeEntryDto timeEntry)
        {
            var exisiting = _timeEntries.First(t => t.TimeEntryId == timeEntry.TimeEntryId);

            return exisiting;
        }
    }
}
