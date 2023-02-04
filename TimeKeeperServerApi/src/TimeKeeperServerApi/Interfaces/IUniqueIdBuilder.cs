namespace TimeKeeperServerApi.Interfaces
{
    public interface IUniqueIdBuilder
    {
        string GetUid();

        bool IsValidUid(string uid);
    }
}
