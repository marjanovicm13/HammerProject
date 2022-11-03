using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace HammerProjectWebAPP.Models
{
  public class facebookaccounts
  {
    [Key]
    public string email { get; set; }
    public string firstName { get; set; }
    public string lastName { get; set; }
    public string? refreshToken { get; set; }
    public DateTime? refreshTokenExpiryTime { get; set; }
  }
}
