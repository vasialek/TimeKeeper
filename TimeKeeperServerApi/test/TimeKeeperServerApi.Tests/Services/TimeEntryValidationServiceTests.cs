using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using NSubstitute;
using TimeKeeperServerApi.Exceptions;
using TimeKeeperServerApi.Interfaces;
using TimeKeeperServerApi.Models;
using TimeKeeperServerApi.Services;
using Xunit;

namespace TimeKeeperServerApi.Tests.Services
{
    public class TimeEntryValidationServiceTests
    {
        private const string ProjectId = "ProjectId";
        private readonly TimeEntryValidationService _validationService;
        private readonly TimeEntryDto _timeEntry;
        private readonly IUniqueIdBuilder _uniqueIdBuilder = Substitute.For<IUniqueIdBuilder>();

        public TimeEntryValidationServiceTests()
        {
            _validationService = new TimeEntryValidationService(_uniqueIdBuilder);
            _timeEntry = new TimeEntryDto
            {
                ProjectId = ProjectId 
            };
            _uniqueIdBuilder.IsValidUid(ProjectId).Returns(true);
        }

        [Fact]
        public async Task CanValidateSaveAsync()
        {
            await _validationService.ValidateSaveAsync(_timeEntry);
        }

        [Fact]
        public async Task ValidateSaveAsync_Exception_WhenNoProjectId()
        {
            _timeEntry.ProjectId = "";
            
            var exception = await Assert.ThrowsAsync<InvalidObjectException>(() => _validationService.ValidateSaveAsync(_timeEntry));

            var actual = exception.Errors.Single();
            actual.Should().Contain("Project is not specified");
        }
    }
}
