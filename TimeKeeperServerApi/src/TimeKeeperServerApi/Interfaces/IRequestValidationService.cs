using System.Collections.Generic;
using TimeKeeperServerApi.Models.Requests;

namespace TimeKeeperServerApi.Interfaces
{
    public interface IRequestValidationService
    {
        IEnumerable<string> Validate(AuthRequest request);
    }
}