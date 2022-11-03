using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace HammerProjectWebAPP.Models
{
  public class login
  {
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int loginNo { get; set; }
    public string loginUserName { get; set; }
    public string loginPassword { get; set; }
    public string? refreshToken { get; set; }
    public DateTime? refreshTokenExpiryTime { get; set; }
  }
}
