using Microsoft.Owin.Security.OAuth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using HammerProjectWebAPP.Models;
using Microsoft.Extensions.Configuration;

namespace HammerProjectWebAPP.Provider
{
  public class OauthProvider: OAuthAuthorizationServerProvider
  {
    private readonly IConfiguration _configuration;
    private HammerProjectDbContext _dbContext;

    public OauthProvider(IConfiguration configuration, HammerProjectDbContext dbContext)
    {
      _configuration = configuration;
      _dbContext = dbContext;
    }
    public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
    {
      //First request will come here, this method will validate the request wheather it has crendtials(UserName and Password)
      //if the request not contain username and   
      //password the request will reject from here not proceded any further  
      context.Validated();
    }

    public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
    {

      //If the request has valid and it contain username and password than this method
      //will check correct crenstials and than generate a valid token  
      var identity = new ClaimsIdentity(context.Options.AuthenticationType);

      if(_dbContext != null)
      {
        var user = _dbContext.login.Where(o => o.loginUserName == context.UserName && o.loginPassword == context.Password);
        if (user != null)
        {
          identity.AddClaim(new Claim("UserName", context.UserName));
          identity.AddClaim(new Claim("LoggedOn", DateTime.Now.ToString()));
          context.Validated(identity);
        }
        else
        {
          context.SetError("Wrong Crendtials", "Provided username and password is incorrect");
          context.Rejected();
        }
      }
      else
      {
        context.SetError("Wrong Credentials", "Provided username and password is incorrect");
        context.Rejected();
      }
      return;
    }
  }
}
