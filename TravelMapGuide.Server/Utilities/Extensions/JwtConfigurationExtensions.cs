﻿using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using TravelMapGuide.Server.Services;
using TravelMapGuide.Server.Configuration;

public static class JwtConfigurationExtensions
{
    public static IServiceCollection AddJwtConfiguration(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<JwtConfiguration>(configuration.GetSection("Jwt"));
        services.AddSingleton<JwtTokenGenerator>(sp =>
        {
            var jwtConfig = sp.GetRequiredService<IOptions<JwtConfiguration>>().Value;
            return new JwtTokenGenerator(jwtConfig);
        });

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            var jwtSettings = configuration.GetSection("Jwt").Get<JwtConfiguration>();

            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtSettings.Issuer,
                ValidAudience = jwtSettings.Audience,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.SecretKey))
            };

            // Blacklist kontrolü
            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = async context =>
                {
                    var token = context.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

                    var blacklistService = context.HttpContext.RequestServices.GetRequiredService<IBlacklistService>();
                    var isBlacklisted = await blacklistService.IsTokenBlacklistedAsync(token);

                    if (isBlacklisted)
                    {
                        context.Fail("This token has been blacklisted.");
                    }
                }
            };
        });

        return services;
    }
}

