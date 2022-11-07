using HammerProjectWebAPP.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json.Serialization;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Owin;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using HammerProjectWebAPP.Services;

namespace HammerProjectWebAPP
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {

      //Enable CORS
      services.AddCors(options =>
      {
        options.AddPolicy("CorsPolicy",
            builder => builder.AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader()
               );
      });

      //JSON serializer
      services.AddControllersWithViews().AddNewtonsoftJson(options =>
      options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore)
      .AddNewtonsoftJson(options => options.SerializerSettings.ContractResolver = new DefaultContractResolver());

     services.AddAuthentication(opt => {
        opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
      })
    .AddJwtBearer(options =>
    {
      options.TokenValidationParameters = new TokenValidationParameters
      {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = "https://2n4knd3e00.execute-api.eu-central-1.amazonaws.com",
        ValidAudience = "https://2n4knd3e00.execute-api.eu-central-1.amazonaws.com",
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("superSecretKey@345")),
        NameClaimType = "name"
      };
    });

      services.AddTransient<ITokenService, TokenService>();
      services.AddTransient<IAccountService, AccountService>();

      //services.AddAuthentication().AddFacebook(facebookOptions =>
      //{
      //  facebookOptions.AppId = Constants.facebookId;
      //  facebookOptions.AppSecret = Constants.facebookSecret;
      //  facebookOptions.SignInScheme = "Bearer";
      //});

      services.AddControllersWithViews();

      var connectionString = Configuration.GetConnectionString("WebApiDatabase");

      services.AddDbContext<HammerProjectDbContext>(options => options.UseMySQL(connectionString));
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
      app.UseCors("CorsPolicy");

      if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

      app.UseRouting();

      app.UseAuthentication();

      app.UseAuthorization();

      app.UseEndpoints(endpoints =>
      {
          endpoints.MapControllers();
      });
        }
    }
}
