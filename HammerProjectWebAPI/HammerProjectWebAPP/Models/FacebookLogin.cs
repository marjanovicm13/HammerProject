using System.ComponentModel.DataAnnotations;

namespace HammerProjectWebAPP.Models
{
  public class FacebookLogin
  {
    [Required]
    [StringLength(255)]
    public string facebookToken { get; set; }
  }
}
