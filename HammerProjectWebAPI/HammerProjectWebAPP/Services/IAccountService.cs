using HammerProjectWebAPP.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HammerProjectWebAPP.Services
{
  public interface IAccountService
  {
    //Task<TokenApiModel> FacebookLoginAsync(string facebookToken);
    Task<facebookaccounts> GetUserFromFacebookAsync(string facebookToken);
    Task<T> GetAsync<T>(string accessToken, string endpoint, string args = null);
  }
}
