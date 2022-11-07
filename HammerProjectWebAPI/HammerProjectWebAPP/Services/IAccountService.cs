using HammerProjectWebAPP.Models;
using System.Threading.Tasks;

namespace HammerProjectWebAPP.Services
{
  public interface IAccountService
  {
    Task<facebookaccounts> GetUserFromFacebookAsync(string facebookToken);
    Task<T> GetAsync<T>(string accessToken, string endpoint, string args = null);
  }
}
