using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HammerProjectWebAPP.Models
{
  public class AuthenticatedResponse
  {
    public string? accessToken { get; set; }
    public string? refreshToken { get; set; }
  }
}
