using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using HammerProjectWebAPP.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System.Security.Claims;
using HammerProjectWebAPP.Services;

namespace HammerProjectWebAPP.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class LoginController : Controller
  {
    private readonly IConfiguration _configuration;
    private readonly HammerProjectDbContext _dbContext;
    private readonly ITokenService _tokenService;
   
    public LoginController(IConfiguration configuration, HammerProjectDbContext dbContext, ITokenService tokenService)
    {
      _configuration = configuration;
      _dbContext = dbContext;
      _tokenService = tokenService;
    }
    [HttpGet]
    public JsonResult GetLoggedIn()
    {
      string query = @"select *
      FROM login;";
      DataTable table = new DataTable();
      string sqlDataSource = _configuration.GetConnectionString("WebApiDatabase");
      MySqlDataReader myReader;
      using (MySqlConnection mycon = new MySqlConnection(sqlDataSource))
      {
        mycon.Open();
        using (MySqlCommand myCommand = new MySqlCommand(query, mycon))
        {
          myReader = myCommand.ExecuteReader();
          table.Load(myReader);

          myReader.Close();
          mycon.Close();
        }
      }
      return new JsonResult(table);
    }

    [HttpPost]
    public IActionResult Post(login request)
    {
      if (request == null)
      {
        return BadRequest("Invalid client request");
      }

      var username = request.loginUserName;
      username.TrimStart('"');


      var user = _dbContext.login.FirstOrDefault(x => x.loginUserName == username);

      if (user == null)
      {
        return StatusCode(404, "User not found");
      }
      else if (user.loginPassword == request.loginPassword)
      {
        var claims = new List<Claim>
             {
                new Claim(ClaimTypes.Name, user.loginUserName),
                new Claim("name", user.loginUserName)
            };

        var accessToken = _tokenService.GenerateAccessToken(claims);
        var refreshToken = _tokenService.GenerateRefreshToken();

        user.refreshToken = refreshToken;
        user.refreshTokenExpiryTime = DateTime.Now.AddDays(1);

        _dbContext.SaveChanges();

        return Ok(new AuthenticatedResponse { accessToken = accessToken, refreshToken = refreshToken });
      }
      else
      {
        return StatusCode(403, "Wrong password");
      }
    }
    }
}

