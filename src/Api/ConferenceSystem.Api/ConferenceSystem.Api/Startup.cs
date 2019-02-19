using ConferenceSystem.Api.Hubs;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ConferenceSystem.Api
{
	public class Startup
	{
		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		public IConfiguration Configuration { get; }

		public void ConfigureServices(IServiceCollection services)
		{
			services.AddMvc();

			services.AddCors(options => options.AddPolicy("CorsPolicy",
				builder =>
				{
					builder.AllowAnyMethod()
						.AllowAnyHeader()
						.WithOrigins("http://localhost:4200")
						.AllowCredentials();
				}));

			services.AddSignalR();
		}

		public void Configure(IApplicationBuilder app, IHostingEnvironment env)
		{
			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
			}

			app.UseCors("CorsPolicy");
			app.UseSignalR(routes =>
			{
				routes.MapHub<ConferenceHub>("/conference");
			});
			app.UseMvc();
		}
	}
}
