using AutoMapper;
using FluentValidation.AspNetCore;
using Portfolio.Business.Business.Helpers;
using TravelMapGuideWebApi.Server.Configuration;
using TravelMapGuideWebApi.Server.Data.Context;
using TravelMapGuideWebApi.Server.Data.Repositories.Abstract;
using TravelMapGuideWebApi.Server.Data.Repositories.Concrete;
using TravelMapGuideWebApi.Server.Services;
using TravelMapGuideWebApi.Server.ValidationRules.FluentValidation;
using TravelMapGuideWebApi.Server.Validators;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add services to the container.
builder.Services.Configure<DatabaseConfiguration>(builder.Configuration.GetSection("ConnectionStrings"));

builder.Services.AddSingleton<MongoDbService>();

// Repositories
builder.Services.AddScoped<ITravelRepository, TravelRepository>();

// Services
builder.Services.AddScoped<ITravelService, TravelService>();


var profiles = ProfileHelper.GetProfiles();

var configuration = new MapperConfiguration(opt =>
{
    opt.AddProfiles(profiles);
});

var mapper = configuration.CreateMapper();
builder.Services.AddSingleton(mapper);


//builder.Services.AddTransient<IValidator<CreateTravelModel>, CreateTravelModelValidator>();
//builder.Services.AddTransient<IValidator<UpdateTravelModel>, UpdateTravelModelValidator>();

//FluentValidation
builder.Services.AddControllers()
    .AddFluentValidation(x =>
    {
        x.RegisterValidatorsFromAssembly(typeof(CreateTravelModelValidator).Assembly);
    });

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
