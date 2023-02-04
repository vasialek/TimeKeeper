using System;
using TimeKeeperServerApi.Interfaces;

namespace TimeKeeperServerApi.Builders
{
    public class UniqueIdBuilder : IUniqueIdBuilder
    {
        public string GetUid()
        {
            return Guid.NewGuid().ToString("N");
        }

        public bool IsValidUid(string uid)
        {
            if (uid.Length != 32)
            {
                return false;
            }

            return true;
        }
    }
}
