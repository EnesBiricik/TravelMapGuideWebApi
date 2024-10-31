using Microsoft.AspNetCore.Diagnostics;
using NLog;
using static NLog.LogLevel;

namespace TravelMapGuide.Server.Utilities.Extensions
{
    public static class CustomExceptionMiddleware
    {
        public static IApplicationBuilder UseGlobalExceptionHandling(this IApplicationBuilder app, Logger logger)
        {
            app.UseExceptionHandler(errorApp =>
            {
                errorApp.Run(async context =>
                {
                    context.Response.StatusCode = 500;
                    context.Response.ContentType = "application/json";

                    var exceptionHandlerPathFeature = context.Features.Get<IExceptionHandlerPathFeature>();
                    if (exceptionHandlerPathFeature?.Error is Exception ex)
                    {
                        logger.Log(Error, "Stopped program because of exception");

                        await context.Response.WriteAsJsonAsync(new
                        {
                            error = "An error occurred.",
                            details = ex.Message,
                            statusCode = context.Response.StatusCode,
                            errorPage = "/error"
                        });
                    }
                });
            });
            return app;
        }
    }
}
