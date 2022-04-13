using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using TimeKeeperServerApi.Controllers;
using TimeKeeperServerApi.Interfaces;
using TimeKeeperServerApi.Models;
using Xunit;

namespace TimeKeeperServerApi.Tests.Controllers
{
    public class ProjectsControllerTests
    {
        private const string UserId = "UserId";
        private readonly ProjectsController _controller;
        private readonly ICustomProjectsRepository _customProjectsRepository = Substitute.For<ICustomProjectsRepository>();

        public ProjectsControllerTests()
        {
            _controller = new ProjectsController(_customProjectsRepository);
        }

        [Fact]
        public async Task CanGetCustomByUserAsync()
        {
            var expected = new List<CustomTimeProject>
            {
                new CustomTimeProject {Name = "Name"}
            };
            _customProjectsRepository.LoadAllByUserIdAsync(UserId).Returns(expected);
            
            var actual = await _controller.GetCustomByUserAsync(UserId);

            var actualResult = actual as OkObjectResult;
            ((List<CustomTimeProject>) actualResult.Value).Should().BeEquivalentTo(expected);
        }
    }
}
