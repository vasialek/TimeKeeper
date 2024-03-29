﻿using System;

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

using Amazon;
using Amazon.DynamoDBv2;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using TimeKeeperServerApi.Builders;
using TimeKeeperServerApi.Interfaces;
using TimeKeeperServerApi.Repositories;
using TimeKeeperServerApi.Services;

namespace TimeKeeperServerApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public static IConfiguration Configuration { get; private set; }

        // This method gets called by the runtime. Use this method to add services to the container
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers()
                    .AddNewtonsoftJson();

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
            })
                .AddCookie()
                .AddOpenIdConnect(options =>
                {
                    
                });
            // string region = Environment.GetEnvironmentVariable("AWS_REGION") ?? RegionEndpoint.USEast1.SystemName;
            // services.AddSingleton<IAmazonDynamoDB>(new AmazonDynamoDBClient(RegionEndpoint.GetBySystemName(region)) );

            services.AddSingleton<ITimeEntryValidationService, TimeEntryValidationService>();
            services.AddSingleton<IUniqueIdBuilder, UniqueIdBuilder>();
            services.AddScoped<ITimeEntryRepository, TimeEntryRepository>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            // app.UseHttpsRedirection();

            app.UseRouting();

            // app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapGet("/", async context =>
                {
                    await context.Response.WriteAsync("Welcome to running ASP.NET Core on AWS Lambda");
                });
            });
        }
    }
}
