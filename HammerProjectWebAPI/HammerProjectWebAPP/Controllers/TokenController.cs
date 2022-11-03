using HammerProjectWebAPP.Models;
using HammerProjectWebAPP.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HammerProjectWebAPP.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class TokenController: ControllerBase
  {
    private readonly HammerProjectDbContext _dbContext;
    private readonly ITokenService _tokenService;

    public TokenController(HammerProjectDbContext dbContext, ITokenService tokenService)
    {
      this._dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
      this._tokenService = tokenService ?? throw new ArgumentNullException(nameof(tokenService));
    }

    [HttpPost]
    [Route("refresh")]
    public IActionResult Refresh(TokenApiModel tokenApiModel)
    {
      if (tokenApiModel == null)
        return BadRequest("Invalid client request");

      string accessToken = tokenApiModel.accessToken;
      string refreshToken = tokenApiModel.refreshToken;

      var principal = _tokenService.GetPrincipalFromExpiredToken(accessToken);
      var username = principal.Identity.Name;

      var user = _dbContext.login.SingleOrDefault(x => x.loginUserName == username);
      var fbUser = _dbContext.facebookaccounts.SingleOrDefault(x => x.email == username);

      if ((user == null || user.refreshToken != refreshToken || user.refreshTokenExpiryTime <= DateTime.Now) && (fbUser == null || fbUser.refreshToken != refreshToken || fbUser.refreshTokenExpiryTime <= DateTime.Now))
        return BadRequest("Invalid client request");


      var newAccessToken = _tokenService.GenerateAccessToken(principal.Claims);
      var newRefreshToken = _tokenService.GenerateRefreshToken();

      if (user != null)
      {
        user.refreshToken = newRefreshToken;
        _dbContext.SaveChanges();
      }
      else if(fbUser != null)
      {
        fbUser.refreshToken = newRefreshToken;
        _dbContext.SaveChanges();

      }

      return Ok(new AuthenticatedResponse { accessToken = newAccessToken, refreshToken = newRefreshToken });
     }
    [Authorize]
    [HttpPost]
    [Route("revoke")]
    public IActionResult Revoke()
    {
      var username = User.Identity.Name;
      var user = _dbContext.login.SingleOrDefault(x => x.loginUserName == username);
      if (user == null)
        return BadRequest();

     user.refreshToken = null;

      _dbContext.SaveChanges();
      return NoContent();
    }
  }
}
