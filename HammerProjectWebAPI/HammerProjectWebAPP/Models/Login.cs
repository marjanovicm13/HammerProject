using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace HammerProjectWebAPP.Models
{
  public class Login
  {
    [Key]
    public int loginNo { get; set; }
    public string loginUserName { get; set; }
    public string loginPassword { get; set; }
  }
}
