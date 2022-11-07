using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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
