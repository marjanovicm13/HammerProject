using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HammerProjectWebAPP.Models
{
  public class Employee
  {
    public int employeeNo { get; set; }
    public string employeeName { get; set; }
    public int salary { get; set; }
    public int departmentNo { get; set; }
    public DateTime? lastModifyDate { get; set; }
  }
}
