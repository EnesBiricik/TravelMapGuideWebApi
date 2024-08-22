using AutoMapper;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.IdentityModel.Tokens;
using NLog;
using NLog.Web;
using Portfolio.Business.Business.Helpers;
using System.Text;
using TravelMapGuideWebApi.Server.Configuration;
using TravelMapGuideWebApi.Server.Data.Context;
using TravelMapGuideWebApi.Server.Data.Repositories.Abstract;
using TravelMapGuideWebApi.Server.Data.Repositories.Concrete;
using TravelMapGuideWebApi.Server.Extensions;
using TravelMapGuideWebApi.Server.Helpers;
using TravelMapGuideWebApi.Server.Services;
using TravelMapGuideWebApi.Server.Validators;

var logger = NLog.LogManager.Setup().LoadConfigurationFromAppSettings().GetCurrentClassLogger();
logger.Debug("init main");

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();

builder.Services.AddHttpContextAccessor();


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

// Services
builder.Services.AddScoped<ITravelService, TravelService>();
builder.Services.AddScoped<IUserService, UserService>();

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

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();

NLog.LogManager.Shutdown();
