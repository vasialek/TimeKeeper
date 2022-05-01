using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using NSubstitute;
using TimeKeeperServerApi.Interfaces;
using TimeKeeperServerApi.Models;
using TimeKeeperServerApi.Repositories;
using Xunit;

namespace TimeKeeperServerApi.Tests.Repositories
{
    // todo: replace when real DB is ready
    public class TimeEntryRepositoryTests
    {
        private const string TimeEntryId = "TimeEntryId";
        private const string UserId = "UserId";
        private readonly TimeEntryRepository _repository;
        private readonly IUniqueIdGenerator _uniqueIdGenerator = Substitute.For<IUniqueIdGenerator>();

        public TimeEntryRepositoryTests()
        {
            _uniqueIdGenerator.GetUid().Returns(TimeEntryId);
            
            _repository = new TimeEntryRepository(_uniqueIdGenerator);
        }

        [Fact]
        public async Task CanSaveAsync()
        {
            var timeEntry = new TimeEntryDto
            {
                UserId = UserId,
                ProjectId = "ProjectId",
                Date = "Date",
                Remarks = "Remarks",
                IsPaid = true,
                PriceMinor = 12345,
                ProjectName = "ProjectName"
            };

            await _repository.SaveAsync(timeEntry);

            var actual = (await _repository.LoadTimeEntriesAsync(UserId)).Single();
            actual.TimeEntryId.Should().Be(TimeEntryId);
            actual.Should().BeEquivalentTo(timeEntry);
        }
    }
}
