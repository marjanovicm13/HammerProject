using System.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;

namespace HammerProjectWebAPP.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class QueryController : ControllerBase
  {
    private readonly IConfiguration _configuration;
    public QueryController(IConfiguration configuration)
    {
      _configuration = configuration;
    }

    [HttpGet]
    [Route("avgSalary")]
    public JsonResult Get()
    {
      string query = @"SELECT AVG(salary) 'Average salary' 
	                      FROM employee, department 
	                      WHERE employee.departmentNo = department.departmentNo && departmentLocation != 'London';";
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

    [HttpGet]
    [Route("locations")]
    public JsonResult GetLocations()
    {
      string query = @"SELECT departmentLocation, count(employee.departmentNo) as 'Number of employees' 
	                      FROM department, employee
	                      WHERE employee.departmentNo = department.departmentNo 
	                      GROUP BY departmentLocation 
	                      HAVING count(employee.departmentNo)>1;";
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

    [HttpGet]
    [Route("developmentLocations")]
    public JsonResult GetDevelopmentLocations()
    {
      string query = @"SELECT departmentLocation, IF(departmentName = 'development', count(employee.departmentNo), 0) as 'Development employees' 
	                      FROM department, employee
	                      WHERE employee.departmentNo = department.departmentNo 
	                      GROUP BY departmentName, departmentLocation
	                      ;";
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

    [HttpGet]
    [Route("secondHighestSalary")]
    public JsonResult GetSecondHighestSalary()
    {
      string query = @"SELECT DISTINCT salary
                        FROM employee 
                        ORDER BY salary DESC
                        LIMIT 1 , 1
	                    ;";
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

    [HttpGet]
    [Route("departmentView")]
    public JsonResult GetDepartmentView()
    {
      string query = @"SELECT * FROM vwdepartment;";
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
    [Route("increaseSalary")]
    public JsonResult increaseSalary(dynamic recieve)
    {
      string query = @"call spIncreaseSalary(@employeeNo, @increasePercentage);";
      DataTable table = new DataTable();
      string sqlDataSource = _configuration.GetConnectionString("WebApiDatabase");
      MySqlDataReader myReader;
      //JsonConvert.DeserializeObject<dynamic>(recieve);
      using (MySqlConnection mycon = new MySqlConnection(sqlDataSource))
      {
        mycon.Open();
        using (MySqlCommand myCommand = new MySqlCommand(query, mycon))
        {
          myCommand.Parameters.AddWithValue("@employeeNo", recieve.employeeNo);
          myCommand.Parameters.AddWithValue("@increasePercentage", recieve.increasePercentage);
          myReader = myCommand.ExecuteReader();
          table.Load(myReader);

          myReader.Close();
          mycon.Close();
        }
      }
      return new JsonResult("Salary increased successfully");
    }
    [HttpPost]
    [Route("decreaseSalary")]
    public JsonResult decreaseSalary(dynamic recieve)
    {
      string query = @"call spDecreaseSalary(@employeeNo, @increasePercentage);";
      DataTable table = new DataTable();
      string sqlDataSource = _configuration.GetConnectionString("WebApiDatabase");
      MySqlDataReader myReader;
      //JsonConvert.DeserializeObject<dynamic>(recieve);
      using (MySqlConnection mycon = new MySqlConnection(sqlDataSource))
      {
        mycon.Open();
        using (MySqlCommand myCommand = new MySqlCommand(query, mycon))
        {
          myCommand.Parameters.AddWithValue("@employeeNo", recieve.employeeNo);
          myCommand.Parameters.AddWithValue("@increasePercentage", recieve.increasePercentage);
          myReader = myCommand.ExecuteReader();
          table.Load(myReader);

          myReader.Close();
          mycon.Close();
        }
      }
      return new JsonResult("Salary increased successfully");
    }
  }
  
}
