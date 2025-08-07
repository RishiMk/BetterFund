using CommentsAndFeedback_Service.Models;
using Microsoft.EntityFrameworkCore;
using Steeltoe.Discovery.Client;

namespace CommentsAndFeedback_Service
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Enable Eureka Discovery Client
            builder.Services.AddDiscoveryClient(builder.Configuration);

            // Enable CORS for React frontend
            //builder.Services.AddCors(options =>
            //{
            //    options.AddPolicy("AllowReactApp", policy =>
            //    {
            //        policy.WithOrigins("http://localhost:3000")
            //              .AllowAnyHeader()
            //              .AllowAnyMethod();
            //    });
            //});

            // Register Controllers
            builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
                });

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Register MySQL DbContext
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
            builder.Services.AddDbContext<P13CrowdfundingDbContext>(options =>
            {
                options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 30)));
            });

            var app = builder.Build();

            // Enable Eureka Discovery Client
            app.UseDiscoveryClient();

            // Enable Swagger only in Development
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }


            // Enable CORS
            //app.UseCors("AllowReactApp");

            app.UseAuthorization();

            // Map controller routes
            app.MapControllers();

            app.Run();
        }
    }
}
