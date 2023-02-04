using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using TimeKeeperServerApi.Controllers;
using TimeKeeperServerApi.Interfaces;
using TimeKeeperServerApi.Models;
using TimeKeeperServerApi.Models.Requests;
using TimeKeeperServerApi.Models.Responses;
using Xunit;

namespace TimeKeeperServerApi.Tests.Controllers
{
    public class AuthControllerTests
    {
        private readonly AuthController _controller;

        private readonly AuthRequest _request = new AuthRequest
        {
            ClientId ="ClientId",
            Email = "Email",
            Password = "Password"
        };

        private readonly IRequestValidationService _requestValidationService = Substitute.For<IRequestValidationService>();

        public AuthControllerTests()
        {
            _requestValidationService.Validate(_request).Returns(Enumerable.Empty<string>());

            _controller = new AuthController(_requestValidationService);
        }

        [Fact]
        public async Task CanLoginAsync()
        {
            var actualResponse = await _controller.LoginAsync(_request);
            var expected = new AuthResponse {Status = RequestStatus.Ok, Jwt = "JWT"};

            var actual = actualResponse as OkObjectResult;

            actual.Should().NotBeNull();
            actual.Value.Should().BeEquivalentTo(expected);
        }

        [Fact]
        public async Task LoginAsync_Error_WhenInvalidRequest()
        {
            var expected = new AuthResponse {Status = RequestStatus.InvalidRequest, Jwt = null};
            _requestValidationService.Validate(_request).Returns(new[] {"Error"});

            var actualResponse = await _controller.LoginAsync(_request);

            var actual = actualResponse as OkObjectResult;
            actual.Should().NotBeNull();
            actual.Value.Should().BeEquivalentTo(expected);
        }
    }
}
