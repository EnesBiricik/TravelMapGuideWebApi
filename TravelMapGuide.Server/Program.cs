using AutoMapper;
using FluentValidation.AspNetCore;
using NLog;
using NLog.Web;
using TravelMapGuide.Server.Data.Repositories.Abstract;
using TravelMapGuide.Server.Data.Repositories.Concrete;
using TravelMapGuide.Server.Services;
using TravelMapGuide.Server.Configuration;
using TravelMapGuide.Server.Data.Context;
using TravelMapGuide.Server.Utilities.Extensions;
using TravelMapGuide.Server.Utilities.Helpers;
using TravelMapGuide.Server.Services;
using Microsoft.Extensions.FileProviders;

var logger = NLog.LogManager.Setup().LoadConfigurationFromAppSettings().GetCurrentClassLogger();
logger.Debug("init main");

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();

builder.Services.AddHttpContextAccessor();


// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add services to the container.
builder.Services.Configure<DatabaseConfiguration>(builder.Configuration.GetSection("ConnectionStrings"));

builder.Services.AddSingleton<MongoDbService>();

// Repositories
builder.Services.AddScoped<ITravelRepository, TravelRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<IBlacklistRepository, BlacklistRepository>();
builder.Services.AddSingleton<IBlacklistRepository, BlacklistRepository>();

// Services
builder.Services.AddScoped<ITravelService, TravelService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IBlacklistService, BlacklistService>();

var profiles = ProfileHelper.GetProfiles();

var configuration = new MapperConfiguration(opt =>
{
    opt.AddProfiles(profiles);
});

var mapper = configuration.CreateMapper();
builder.Services.AddSingleton(mapper);

//JWT settings
builder.Services.AddJwtConfiguration(builder.Configuration);

builder.Services.AddAuthorization();

// FluentValidation
#pragma warning disable CS0618 // Tür veya üye artýk kullanýlmýyor
builder.Services.AddControllers()
    .AddFluentValidation(x =>
    { x.RegisterValidatorsFromAssemblies(ValidatorProfileHelper.GetValidatorAssemblies()); });
#pragma warning restore CS0618 // Tür veya üye artýk kullanýlmýyor

// NLog: Setup NLog for Dependency injection
builder.Logging.ClearProviders();
builder.Logging.SetMinimumLevel(Microsoft.Extensions.Logging.LogLevel.Trace);
builder.Host.UseNLog();

var app = builder.Build();

// JwtTokenReader initialize
JwtTokenReader.Initialize(app.Services.GetRequiredService<IHttpContextAccessor>());

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


// Global Exception Handling Middleware -- extension middleware ile kullaným?
app.UseGlobalExceptionHandling(logger);

app.UseCors("AllowAll"); // veya "AllowAllOrigins"


app.UseStaticFiles(); // Bu satýr statik dosyalarýn sunulmasýný saðlar

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();

NLog.LogManager.Shutdown();
