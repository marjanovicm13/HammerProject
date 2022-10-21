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

namespace HammerProjectWebAPP.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class DepartmentController : ControllerBase
  {
    private readonly IConfiguration _configuration;
    public DepartmentController(IConfiguration configuration)
    {
      _configuration = configuration;
    }
    [HttpGet]
    public JsonResult Get()
    {
      string query = @"select * FROM department;";
      DataTable table = new DataTable();
      string sqlDataSource = _configuration.GetConnectionString("DefaultConnection");
      MySqlDataReader myReader;
      using(MySqlConnection mycon = new MySqlConnection(sqlDataSource))
      {
        mycon.Open();
        using(MySqlCommand myCommand = new MySqlCommand(query, mycon))
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
    public JsonResult Post(Department dep)
    {
      string query = @"insert into department (departmentName, departmentLocation) values
      (@departmentName, @departmentLocation);";
      DataTable table = new DataTable();
      string sqlDataSource = _configuration.GetConnectionString("DefaultConnection");
      MySqlDataReader myReader;
      using (MySqlConnection mycon = new MySqlConnection(sqlDataSource))
      {
        mycon.Open();
        using (MySqlCommand myCommand = new MySqlCommand(query, mycon))
        {
          myCommand.Parameters.AddWithValue("@departmentName", dep.departmentName);
          myCommand.Parameters.AddWithValue("@departmentLocation", dep.departmentLocation);
          myReader = myCommand.ExecuteReader();
          table.Load(myReader);

          myReader.Close();
          mycon.Close();
        }
      }
      return new JsonResult("Added successfully");
    }

    [HttpPut]
    public JsonResult Put(Department dep)
    {
      string query = @"update department set
      departmentName = @departmentName, departmentLocation = @departmentLocation
      where departmentNo = @departmentNo;";
      DataTable table = new DataTable();
      string sqlDataSource = _configuration.GetConnectionString("DefaultConnection");
      MySqlDataReader myReader;
      using (MySqlConnection mycon = new MySqlConnection(sqlDataSource))
      {
        mycon.Open();
        using (MySqlCommand myCommand = new MySqlCommand(query, mycon))
        {
          myCommand.Parameters.AddWithValue("@departmentNo", dep.departmentNo);
          myCommand.Parameters.AddWithValue("@departmentName", dep.departmentName);
          myCommand.Parameters.AddWithValue("@departmentLocation", dep.departmentLocation);
          myReader = myCommand.ExecuteReader();
          table.Load(myReader);

          myReader.Close();
          mycon.Close();
        }
      }
      return new JsonResult("Updated successfully");
    }

    [HttpDelete("{id}")]
    public JsonResult Delete(int id)
    {
      string query = @"delete from Department
      where departmentNo = @departmentNo;";
      DataTable table = new DataTable();
      string sqlDataSource = _configuration.GetConnectionString("DefaultConnection");
      MySqlDataReader myReader;
      using (MySqlConnection mycon = new MySqlConnection(sqlDataSource))
      {
        mycon.Open();
        using (MySqlCommand myCommand = new MySqlCommand(query, mycon))
        {
          myCommand.Parameters.AddWithValue("@departmentNo", id);
          myReader = myCommand.ExecuteReader();
          table.Load(myReader);

          myReader.Close();
          mycon.Close();
        }
      }
      return new JsonResult("Deleted successfully");
    }
  }
}
