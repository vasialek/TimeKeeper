using FluentAssertions;
using TimeKeeperServerApi.Builders;
using Xunit;

namespace TimeKeeperServerApi.Tests.Builders
{
    public class UniqueIdBuilderTests
    {
        private readonly UniqueIdBuilder _builder = new UniqueIdBuilder();

        [Fact]
        public void CanGetUid()
        {
            var actual = _builder.GetUid();

            actual.Length.Should().Be(32);
        }

        [Theory]
        [InlineData("12345678901234567890123456789012", true)]
        [InlineData("123456789012345678901234567890123", false)]
        [InlineData("1234567890123456789012345678901", false)]
        public void CanIsValidUid(string uid, bool expected)
        {
            var actual = _builder.IsValidUid(uid);

            actual.Should().Be(expected);
        }
    }
}
