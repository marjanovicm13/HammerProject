using System;
using System.ComponentModel.DataAnnotations;

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
