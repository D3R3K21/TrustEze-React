namespace TrustEze.API
{
    public class EnvironmentVariables
    {
        private IConfiguration _config;
        public EnvironmentVariables(IConfiguration config)
        {
            _config = config;
            this.Jwt = new JwtConfig(config);
            this.Mongo = new MongoConfig(config);
            this.HasData = new HasDataApiConfig(config);
            this.DefaultUserPassword = config["DEFAULT_USER_PASSWORD"] ?? Guid.NewGuid().ToString();//should never be null

        }
        public JwtConfig Jwt { get; set; }
        public MongoConfig Mongo { get; set; }
        public HasDataApiConfig HasData { get; set; }
        public string DefaultUserPassword { get; set; }
    }

    public class HasDataApiConfig
    {
        public HasDataApiConfig(IConfiguration config) 
        {
            BaseUrl = config["HASDATA_BASE_URL"] ?? "https://api.hasdata.com/scrape/zillow/listing";
            ApiKey = config["HASDATA_API_KEY"] ?? string.Empty;
        }
        public string BaseUrl { get; set; }
        public string ApiKey { get; set; }
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
            JwtKey = config["JWT_KEY"] ?? "YourSuperSecretKeyThatIsAtLeast32CharactersLong!";
            Issuer = config["JWT_ISSUER"] ?? "TrustEze";
            Audience = config["JWT_AUDIENCE"] ?? "TrustEzeUsers";
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
            EnableSeedData = seedData;
        }
        public MongoConfig(IConfiguration config)
        {
            ConnectionString = config["MONGO_CONNECTION_STRING"] ?? "mongodb://localhost:27017";
            Database = config["MONGO_DATABASE_NAME"] ?? "TrustEzeDb";
            EnableSeedData = bool.TryParse(config["ENABLE_SEED_DATA"], out var enableSeedData) ? enableSeedData : false;
        }
        public string ConnectionString { get; set; }
        public string Database { get; set; }
        public bool EnableSeedData { get; set; }
    }
}
