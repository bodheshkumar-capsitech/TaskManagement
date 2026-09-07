using Capsitech.Data.MongoDB.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Projects.Config.Auth;
using Projects.Config.Db;
using Projects.Identity;
using Projects.Models;
using Projects.Services;
using Projects.Services.Auth;
using Projects.Services.ProjectService;
using Projects.Services.TodoService;
using Swashbuckle.AspNetCore.SwaggerUI;
using System.Text;
using System.Text.Json;


using IdentityRole = Capsitech.Data.MongoDB.Identity.IdentityRole;


namespace Projects
{
    public class Startup
    {
        private readonly IConfiguration _configuration;
        private readonly IHostEnvironment _environment;

        public Startup(IConfiguration configuration, IHostEnvironment environment)
        {
            _configuration = configuration;
            _environment = environment;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddIdentity<ApplicationUser, IdentityRole>(io =>
            {
                io.Password.RequireDigit = false;
                io.Password.RequiredLength = 6;
                io.Password.RequiredUniqueChars = 0;
                io.Password.RequireLowercase = false;
                io.Password.RequireNonAlphanumeric = false;
                io.Password.RequireUppercase = false;
            })
               .AddDefaultTokenProviders()
               .AddSignInManager<ApplicationSignInManager>()
               .RegisterMongoStores<ApplicationUser, IdentityRole>(_configuration["MongoDbSettings:ConnectionString"]);
            //.RegisterMongoStores<ApplicationUser, IdentityRole>(_configuration["DBConfiguration:ConnectionString"]);
            services.Configure<DbSettings>(_configuration.GetSection("Database"));
            services.Configure<JwtSettings>(_configuration.GetSection("JwtSettings"));
            services.Configure<DbSettings>(_configuration.GetSection("MongoDbSettings"));
            //services.AddCors();
            AppConfig.Init(_configuration);

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
 .AddJwtBearer(cfg =>
 {
     cfg.SaveToken = true;

     cfg.TokenValidationParameters = new TokenValidationParameters
     {
         ValidIssuer = _configuration["Jwt:Issuer"],

         IssuerSigningKey = new SymmetricSecurityKey(
             Encoding.UTF8.GetBytes(
                 _configuration["Jwt:Key"]!
             )
         ),

         ValidateIssuerSigningKey = true,
         ValidateIssuer = true,
         ValidateAudience = false,
         ValidateLifetime = true,

         ClockSkew = TimeSpan.Zero
     };

     cfg.Events = new JwtBearerEvents
     {
         OnMessageReceived = context =>
         {
             var token = context.Request.Cookies["AuthToken"];

             Console.WriteLine("===== JWT COOKIE =====");

             if (string.IsNullOrEmpty(token))
             {
                 Console.WriteLine("AuthToken NOT FOUND");
             }
             else
             {
                 Console.WriteLine("AuthToken FOUND");
                 context.Token = token;
             }

             return Task.CompletedTask;
         },

         OnAuthenticationFailed = context =>
         {
             Console.WriteLine("===== JWT AUTHENTICATION FAILED =====");
             Console.WriteLine(context.Exception.Message);

             return Task.CompletedTask;
         },

         OnTokenValidated = context =>
         {
             Console.WriteLine("===== JWT TOKEN VALIDATED =====");
             Console.WriteLine(
                 $"User: {context.Principal?.Identity?.Name}"
             );

             return Task.CompletedTask;
         }
     };
 });
            services.AddTransient<IEmailSender, EmailSender>();
            EmailSender.Init(_configuration);
            //services.Configure<StorageConfiguration>(_configuration.GetSection("StorageConfiguration"));
            DbConventions.RegisterCamelCaseConvention();

            //services.AddSingleton<BookService>();
            services.AddSingleton<AuthorService>();
            //services.AddSingleton<GenreService>();
            services.AddSingleton<AccountService>();
            //services.AddSingleton<PasswordService>();
            //services.AddSingleton<TokenService>();
            //services.AddSingleton<BookShelfService>();
            services.AddSingleton<MongoDbContext>();
            services.AddScoped<ITodoService, TodoService>();
            services.AddScoped<IProjectService, ProjectService>();

            //services.AddCors(options =>
            //{
            //    options.AddPolicy("ReactApp", policy =>
            //    {
            //        policy
            //            .WithOrigins("http://localhost:5173") // React Vite URL
            //            .AllowAnyHeader()
            //            .AllowAnyMethod()
            //            .AllowCredentials();
                       
            //    });
            //});


            services.AddControllers().AddJsonOptions(options =>
                options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            );


            services.AddEndpointsApiExplorer();
            services.AddSwaggerGenNewtonsoftSupport();

            services.AddSwaggerGen(c =>
            {
                c.EnableAnnotations();
                //c.UseInlineDefinitionsForEnums();
                c.SchemaFilter<XEnumNamesSchemaFilter>();

                // add JWT Authentication
                var securityScheme = new OpenApiSecurityScheme
                {
                    Name = "JWT Authentication",
                    Description = "Enter JWT Bearer token **_only_**",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer", // must be lower case
                    BearerFormat = "JWT",
                    Reference = new OpenApiReference
                    {
                        Id = JwtBearerDefaults.AuthenticationScheme,
                        Type = ReferenceType.SecurityScheme
                    }
                };
                c.AddSecurityDefinition(securityScheme.Reference.Id, securityScheme);
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {securityScheme, Array.Empty<string>()}
                });
            });
            //services.AddCronJob<DailyElevenPmJobScheduler>(c =>
            //{
            //    c.TimeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById("India Standard Time");
            //    c.CronExpression = @"0 23 * * *"; //every day 11pm
            //});
            services.AddHttpContextAccessor();
        }

        public void Configure(WebApplication app, IHostEnvironment env)
        {
            //if (env.IsDevelopment())
            //{
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.DocExpansion(DocExpansion.None); // set default close all the tabs and sections
                });
            //}

            app.Use(async (context, next) =>
            {
                context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
                context.Response.Headers.Append("X-Frame-Options", "DENY");
                context.Response.Headers.Append("X-XSS-Protection", "0");
                context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
                //context.Response.Headers.Add("Content-Security-Policy", "self");
                await next();
            });
            //app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseCors(p => p
                .AllowAnyMethod()
                .AllowAnyHeader()
                .SetIsOriginAllowed(_ => true) // allow any origin
                .AllowCredentials()
                .SetPreflightMaxAge(TimeSpan.FromSeconds(600))
                .WithExposedHeaders("Content-Disposition"));

            app.UseRouting();

            //app.UseCors("ReactApp");
            app.UseAuthentication();
            app.UseAuthorization();

            //app.UseHttpsRedirection();


            app.MapControllers();
        }
    }
}
