using System;
using System.Collections.Generic;
using TimeKeeperServerApi.Interfaces;
using TimeKeeperServerApi.Models.Requests;

namespace TimeKeeperServerApi.Services
{
    public class RequestValidationService : IRequestValidationService
    {
        public IEnumerable<string> Validate(AuthRequest request)
        {
            throw new NotImplementedException(nameof(Validate));
        }
    }
}