using System.Data;
using HammerProjectWebAPP.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;

namespace HammerProjectWebAPP.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class EmployeeController : ControllerBase
  {
    private readonly IConfiguration _configuration;
    public EmployeeController(IConfiguration configuration)
    {
      _configuration = configuration;
    }
    [HttpGet]
    public JsonResult Get()
    {
      string query = @"select employeeNo, employeeName, salary, departmentNo,
      DATE_FORMAT(lastModifyDate, '%d-%m-%Y %H:%i:%s') as lastModifyDate
      FROM employee;";
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

    [HttpGet]
    [Route("updateEmployees")]
    public JsonResult GetUpdateEmployees()
    {
      string query = @"select employeeNo, employeeName, salary, departmentNo
      FROM employee;";
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

    [Authorize]
    [HttpPost]
    public ActionResult<string> Post(Employee emp)
    {
      string query = @"insert into employee (employeeName, salary, departmentNo, lastModifyDate) values
      (@employeeName, @salary, @departmentNo, @lastModifyDate);";
      DataTable table = new DataTable();
      string sqlDataSource = _configuration.GetConnectionString("DefaultConnection");
      MySqlDataReader myReader;
      using (MySqlConnection mycon = new MySqlConnection(sqlDataSource))
      {
        mycon.Open();
        using (MySqlCommand myCommand = new MySqlCommand(query, mycon))
        {
          myCommand.Parameters.AddWithValue("@employeeName", emp.employeeName);
          myCommand.Parameters.AddWithValue("@salary", emp.salary);
          myCommand.Parameters.AddWithValue("@departmentNo", emp.departmentNo);
          myCommand.Parameters.AddWithValue("@lastModifyDate", emp.lastModifyDate);
          myReader = myCommand.ExecuteReader();
          table.Load(myReader);

          myReader.Close();
          mycon.Close();
        }
      }
      return Ok(new { str = "success" });
        }

    [Authorize]
    [HttpPut]
    public JsonResult Put(Employee emp)
    {
      string query = @"update employee set
      employeeName = @employeeName, salary = @salary, departmentNo = @departmentNo, lastModifyDate = @lastModifyDate 
      where employeeNo = @employeeNo;";
      DataTable table = new DataTable();
      string sqlDataSource = _configuration.GetConnectionString("DefaultConnection");
      MySqlDataReader myReader;
      using (MySqlConnection mycon = new MySqlConnection(sqlDataSource))
      {
        mycon.Open();
        using (MySqlCommand myCommand = new MySqlCommand(query, mycon))
        {
          myCommand.Parameters.AddWithValue("@employeeNo", emp.employeeNo);
          myCommand.Parameters.AddWithValue("@employeeName", emp.employeeName);
          myCommand.Parameters.AddWithValue("@salary", emp.salary);
          myCommand.Parameters.AddWithValue("@departmentNo", emp.departmentNo);
          myCommand.Parameters.AddWithValue("@lastModifyDate", emp.lastModifyDate);
          myReader = myCommand.ExecuteReader();
          table.Load(myReader);

          myReader.Close();
          mycon.Close();
        }
      }
      return new JsonResult("Updated successfully");
    }

    [Authorize]
    [HttpDelete("{id}")]
    public JsonResult Delete(int id)
    {
      string query = @"delete from employee
      where employeeNo = @employeeNo;";
      DataTable table = new DataTable();
      string sqlDataSource = _configuration.GetConnectionString("DefaultConnection");
      MySqlDataReader myReader;
      using (MySqlConnection mycon = new MySqlConnection(sqlDataSource))
      {
        mycon.Open();
        using (MySqlCommand myCommand = new MySqlCommand(query, mycon))
        {
          myCommand.Parameters.AddWithValue("@employeeNo", id);
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
