using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace HammerProjectWebAPP.Services
{
  public class TokenService: ITokenService
  {
    public string GenerateAccessToken(IEnumerable<Claim> claims)
    {
      var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Constants.Secret));
      var signingCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

      var token = new JwtSecurityToken(
              issuer: Constants.Issuer,
              audience: Constants.Audience,
              claims: claims,
              notBefore: DateTime.Now,
              expires: DateTime.Now.AddMinutes(1),
              signingCredentials: signingCredentials
            );

      var tokenJson = new JwtSecurityTokenHandler().WriteToken(token);
      return tokenJson;
    }

    public string GenerateRefreshToken()
    {
      var randomNumber = new byte[32];
      using(var rng = RandomNumberGenerator.Create())
      {
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
      }
    }

    public ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
    {
      var tokenValidationParameters = new TokenValidationParameters
      {
        ValidateAudience = false,
        ValidateIssuer = false,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Constants.Secret)),
        ValidateLifetime = false
      };

      var tokenHandler = new JwtSecurityTokenHandler();
      SecurityToken securityToken;
      var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out securityToken);
      var jwtSecurityToken = securityToken as JwtSecurityToken;
      if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
        throw new SecurityTokenException("Invalid token");

      return principal;
    }
  }
}
