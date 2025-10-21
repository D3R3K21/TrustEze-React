# Use the official .NET 8.0 runtime as the base image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Use the .NET 8.0 SDK for building
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the project file and restore dependencies
COPY ["TrustEze.API.csproj", "."]
RUN dotnet restore "TrustEze.API.csproj"

# Copy the rest of the source code
COPY . .

# Build the application
RUN dotnet build "TrustEze.API.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "TrustEze.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Create the final runtime image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Set environment variables for MongoDB connection
ENV MongoConnectionString="mongodb://mongo:27017"
ENV MongoDatabase="TrustEze"
ENV JwtKey="c174b8980ac99393a1b064e5cf9c3cae"
ENV JwtIssuer="TrustEze"
ENV JwtAudience="TrustEzeUsers"

ENTRYPOINT ["dotnet", "TrustEze.API.dll"]
