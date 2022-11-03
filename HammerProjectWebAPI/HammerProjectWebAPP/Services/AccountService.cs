using HammerProjectWebAPP.Models;
using Marten.Services;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;

namespace HammerProjectWebAPP.Services
{
  public class AccountService: IAccountService
  {

    private readonly HttpClient _httpClient;
    private readonly ITokenService _tokenService;
    private readonly HammerProjectDbContext _dbContext;

    public AccountService(ITokenService tokenService, HammerProjectDbContext dbContext)
    {
      _dbContext = dbContext;
      _httpClient = new HttpClient
      {
        BaseAddress = new Uri("https://graph.facebook.com/v2.8/")
      };
      _httpClient.DefaultRequestHeaders
        .Accept
        .Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
      _tokenService = tokenService;
    }

    public async Task<facebookaccounts> GetUserFromFacebookAsync(string facebookToken)
    {
      var result = await GetAsync<dynamic>(facebookToken, "me", "fields=first_name,last_name,email");
      if (result == null)
      {
        throw new Exception("User from this token does not exist.");
      }

      var account = new facebookaccounts()
      {
        firstName = result.first_name,
        lastName = result.last_name,
        email = result.email
      };

      var user = _dbContext.facebookaccounts.FirstOrDefault(x => x.email == account.email);

      if (user != null)
      {
        return user;
      }
      else
      {
        _dbContext.facebookaccounts.Add(account);
        _dbContext.SaveChanges();
        user = _dbContext.facebookaccounts.FirstOrDefault(x => x.email == account.email);
      }

      return user;
    }

    public async Task<T> GetAsync<T>(string accessToken, string endpoint, string args = null)
    {
      var response = await _httpClient.GetAsync($"{endpoint}?access_token={accessToken}&{args}");
      if (!response.IsSuccessStatusCode)
        return default(T);

      var result = await response.Content.ReadAsStringAsync();

      return JsonConvert.DeserializeObject<T>(result);
    }
  }
}
