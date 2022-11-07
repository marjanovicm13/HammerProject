using System;
using System.Collections.Generic;
using System.Security.Claims;
using HammerProjectWebAPP.Models;
using HammerProjectWebAPP.Services;
using Microsoft.AspNetCore.Mvc;

namespace HammerProjectWebAPP.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class AccountController : ControllerBase
  {
    private readonly IAccountService _accountService;
    private readonly ITokenService _tokenService;
    private readonly HammerProjectDbContext _dbContext;

    public AccountController(IAccountService accountService, ITokenService tokenService, HammerProjectDbContext dbContext)
    {
      _accountService = accountService;
      _tokenService = tokenService;
      _dbContext = dbContext;
    }
    [HttpPost]
    public IActionResult Post(FacebookLogin facebookToken)
    {
      if (string.IsNullOrEmpty(facebookToken.facebookToken))
      {
        throw new Exception("Token is null or empty");
      }

      var facebookUser = _accountService.GetUserFromFacebookAsync(facebookToken.facebookToken);
      
      var claims = new List<Claim>
            {
              new Claim(ClaimTypes.Name, facebookUser.Result.email),
              new Claim("firstName", facebookUser.Result.firstName),
              new Claim("lastName", facebookUser.Result.lastName)
          };

      var accessToken = _tokenService.GenerateAccessToken(claims);
      var refreshToken = _tokenService.GenerateRefreshToken();

      facebookUser.Result.refreshToken = refreshToken;
      facebookUser.Result.refreshTokenExpiryTime = DateTime.Now.AddDays(1);

      _dbContext.SaveChanges();

      return Ok(new AuthenticatedResponse { accessToken = accessToken, refreshToken = refreshToken });
    }
  }
}

