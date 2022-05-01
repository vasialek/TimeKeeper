using System.Collections.Generic;
using System.Threading.Tasks;
using TimeKeeperServerApi.Controllers;
using Xunit;
using NSubstitute;
using TimeKeeperServerApi.Interfaces;
using TimeKeeperServerApi.Models;
using FluentAssertions;
using NSubstitute.ExceptionExtensions;
using TimeKeeperServerApi.Exceptions;
using TimeKeeperServerApi.Services;

namespace TimeKeeperServerApi.Tests
{
    public class TimeEntriesControllerTests
    {
        private const string UserId = "3aa3a10661984167b88b1cf8ad76c555";

        private readonly TimeEntriesController _controller;
        private readonly ITimeEntryRepository _repository = Substitute.For<ITimeEntryRepository>();
        private readonly TimeEntryDto _timeEntry;
        private readonly ITimeEntryValidationService _validationService = Substitute.For<ITimeEntryValidationService>();

        public TimeEntriesControllerTests()
        {
            _controller = new TimeEntriesController(_validationService, _repository);
            _timeEntry = new TimeEntryDto
            {
                TimeEntryId = "TimeEntryId",
                Date = "2020-02-02",
                UserId = "UserId",
                ProjectId = "ProjectId"
            };
        }

        [Fact]
        public async void CanGetAll()
        {
            var expected = new List<TimeEntryDto>
            {
                new TimeEntryDto { TimeEntryId = "TimeEntryId" }
            };
            _repository.LoadTimeEntriesAsync(UserId).Returns(expected);

            var actual = await _controller.GetAllByUserId(UserId);

            actual.Should().BeEquivalentTo(expected);
        }

        [Fact]
        public async Task CanUpdateAsync()
        {
            var expected = new TimeEntryDto();
            _repository.UpdateAsync(_timeEntry).Returns(expected);
            
            var actual = await _controller.UpdateAsync(_timeEntry);

            actual.Should().Be(expected);
        }

        [Fact]
        public async Task UpdateAsync_Exception_WhenInvalidEntry()
        {
            _validationService.ValidateUpdateAsync(_timeEntry).Throws(new InvalidObjectException());

            await Assert.ThrowsAsync<InvalidObjectException>(() => _controller.UpdateAsync(_timeEntry));
        }
    }
}
