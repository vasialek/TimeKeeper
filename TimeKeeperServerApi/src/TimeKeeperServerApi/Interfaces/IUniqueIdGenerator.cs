namespace TimeKeeperServerApi.Interfaces
{
    public interface IUniqueIdGenerator
    {
        string GetUid();

        bool IsValidUid(string uid);
    }
}
