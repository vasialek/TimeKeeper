using System.Collections.Generic;
using System.Linq;
using TimeKeeperServerApi.Exceptions;
using TimeKeeperServerApi.Interfaces;

namespace TimeKeeperServerApi.Repositories
{
    public class UserRepository
    {
        public readonly static string UserId1 = "3c918ce2e5494a42a61aba8a2eef2ea0";
        
        private readonly ICryptoService _cryptoService;
        private static readonly List<UserDto> _users = new List<UserDto>
        {
            new UserDto
            {
                UserId = UserId1,
                Email = "p.roglamer@gmail.com",
                Name = "Aleksej 1",
                PasswordEncoded = "123456"
            }
        };


        public UserRepository(ICryptoService cryptoService)
        {
            _cryptoService = cryptoService;
        }
        
        public UserDto Login(string email, string password)
        {
            var emailUp = email.ToUpperInvariant();
            var user = _users.First(u => u.Email.ToUpperInvariant() == emailUp);

            if (user == null)
            {
                throw new ObjectNotFoundException();
            }

            var passwordEncoded = _cryptoService.Encode(password);
            return user.PasswordEncoded == passwordEncoded
                ? user
                : throw new ObjectNotFoundException();
        }
    }

    public class UserDto
    {
        public string UserId { get; set; }

        public string Name { get; set; }

        public string Email { get; set; }

        public string PasswordEncoded { get; set; }
    }
}
