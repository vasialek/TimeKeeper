namespace TimeKeeperServerApi.Interfaces
{
    public interface ICryptoService
    {
        string Encode(string input);

        string Decode(string encoded);
    }
}
