using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Text.Json;

namespace RealEstate.API.Middleware
{
    public class GlobalExceptionHandlerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionHandlerMiddleware> _logger;

        public GlobalExceptionHandlerMiddleware(RequestDelegate next, ILogger<GlobalExceptionHandlerMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ha ocurrido un error inesperado: {Message}", ex.Message);

                context.Response.ContentType = "application/problem+json";
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                var problemDetails = new ProblemDetails
                {
                    Status = context.Response.StatusCode,
                    Title = "Error interno del servidor.",
                    Detail = "Se ha producido un error inesperado. Por favor, inténtelo de nuevo más tarde."
                };

                var jsonResponse = JsonSerializer.Serialize(problemDetails);
                await context.Response.WriteAsync(jsonResponse);
            }
        }
    }
}