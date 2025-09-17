using Microsoft.Extensions.Configuration;

namespace TrustEze.API
{
  public class EnvironmentVariables
  {
    private IConfiguration _config;
    public EnvironmentVariables(IConfiguration config)
    {
      _config = config;
      // Add JWT Authentication

      this.Jwt = new JwtConfig(config);
      this.Mongo = new MongoConfig(config);



    }
    public JwtConfig Jwt { get; set; }
    public MongoConfig Mongo { get; set; }

  }

  public class JwtConfig 
  {
    public JwtConfig(string jwtKey, string issuer, string audience) 
    {
      JwtKey = jwtKey;
      Issuer = issuer;
      Audience = audience;
    }
    public JwtConfig(IConfiguration config)
    {
      JwtKey = config["Jwt:Key"] ?? "YourSuperSecretKeyThatIsAtLeast32CharactersLong!";
      Issuer = config["Jwt:Issuer"] ?? "TrustEze";
      Audience = config["Jwt:Audience"] ?? "TrustEzeUsers";
    }
    public string JwtKey { get; set; }
    public string Issuer { get; set; }
    public string Audience { get; set; }
  }
  public class MongoConfig 
  {
    public MongoConfig(string connectionString, string database, bool seedData) 
    {
      ConnectionString = connectionString;
      Database = database;
      SeedData = seedData;
    }
    public MongoConfig(IConfiguration config) 
    {
      ConnectionString = config.GetConnectionString("MongoDB") ?? "mongodb://localhost:27017";
      Database = config["MongoDB:DatabaseName"] ?? "TrustEzeDb";
      SeedData = bool.Parse(config["ENABLE_SEED_DATA"] ?? "false");
    }
    public string ConnectionString { get; set; }
    public string Database { get; set; }
    public bool SeedData { get; set; }
  }
}
