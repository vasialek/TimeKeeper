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
        private readonly IProjectsRepository _projectsRepository = Substitute.For<IProjectsRepository>();

        public ProjectsControllerTests()
        {
            _controller = new ProjectsController(_projectsRepository);
        }

        [Fact]
        public async Task CanGetCustomByUserAsync()
        {
            var expected = new List<CustomProject>
            {
                new CustomProject {Name = "Name"}
            };
            _projectsRepository.LoadAllByUserIdAsync(UserId).Returns(expected);
            
            var actual = await _controller.GetCustomByUserAsync(UserId);

            var actualResult = actual as OkObjectResult;
            ((List<CustomProject>) actualResult.Value).Should().BeEquivalentTo(expected);
        }

        [Fact]
        public async Task GetCustomByUserAsync_Limit_WhenTooManyCustomProjects()
        {
            _projectsRepository.LoadAllByUserIdAsync(UserId).Returns(new List<CustomProject>
            {
                new CustomProject(), new CustomProject(), new CustomProject(), 
                new CustomProject(), new CustomProject(), new CustomProject()
            });
            
            var actual = await _controller.GetCustomByUserAsync(UserId);
            
            var actualResult = actual as OkObjectResult;
            ((List<CustomProject>) actualResult.Value).Should().HaveCount(5);
        }
    }
}
