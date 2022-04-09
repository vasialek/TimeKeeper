using System.Collections.Generic;
using TimeKeeperServerApi.Controllers;
using Xunit;
using NSubstitute;
using TimeKeeperServerApi.Interfaces;
using TimeKeeperServerApi.Models;
using FluentAssertions;

namespace TimeKeeperServerApi.Tests
{
    public class TimeEntriesControllerTests
    {
        private const string UserId = "3aa3a10661984167b88b1cf8ad76c555";

        private readonly TimeEntriesController _controller;
        private readonly ITimeEntryRepository _repository = Substitute.For<ITimeEntryRepository>();

        public TimeEntriesControllerTests()
        {
            _controller = new TimeEntriesController(_repository);
        }

        [Fact]
        public async void CanGetAll()
        {
            var expected = new List<TimeEntryDto>
            {
                new TimeEntryDto { TimeEntryId = "TimeEntryId" }
            };
            _repository.LoadTimeEntiresAsync().Returns(expected);

            var actual = await _controller.GetAllByUserId(UserId);

            actual.Should().BeEquivalentTo(expected);
        }
    }
}
