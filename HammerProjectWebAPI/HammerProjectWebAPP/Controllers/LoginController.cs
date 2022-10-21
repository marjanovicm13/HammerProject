using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using HammerProjectWebAPP.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using Microsoft.EntityFrameworkCore;

namespace HammerProjectWebAPP.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class LoginController : Controller
  {
    private readonly IConfiguration _configuration;
    private HammerProjectDbContext _dbContext;
    public LoginController(IConfiguration configuration, HammerProjectDbContext dbContext)
    {
      _configuration = configuration;
      _dbContext = dbContext;
    }
    [HttpGet]
    public JsonResult GetLoggedIn()
    {
      string query = @"select *
      FROM login;";
      DataTable table = new DataTable();
      string sqlDataSource = _configuration.GetConnectionString("DefaultConnection");
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
    public IActionResult Post(Login request)
    {
      try { 
          var username = request.loginUserName;
          username.TrimStart('"');

          var user = _dbContext.Login.FirstOrDefault(x => x.loginUserName == username);

          if (user == null)
          {
            return StatusCode(404, "User not found");
          }
          else if(user.loginPassword == request.loginPassword)
          {
            return Ok(user);
          }
          else
          {
           return StatusCode(403, "Wrong password");
          }
      }
      catch(Exception)
      {
        return StatusCode(500, "An error has occured");
      }
    }

    //public IActionResult Index()
    //{
    //  return View();
    //}

    //public IActionResult Authenticate()
    //{
    //  return RedirectToAction("Index");
    //}

    
  }
}

