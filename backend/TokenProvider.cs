using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Entities;

public class TokenProvider
{
    private readonly IConfiguration _configuration;

    public TokenProvider(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string Create(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);

        var claims = new List<Claim> {
          new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
        };

        var tokenDesciptor = new SecurityTokenDescriptor
        {
            Issuer = _configuration["Jwt:Issuer"],

            Audience = _configuration["Jwt:Audience"],

            Subject = new ClaimsIdentity(claims),

            Expires = DateTime.UtcNow.AddMinutes(double.Parse(_configuration["Jwt:ExpiresInMins"])),

            SigningCredentials = new SigningCredentials(
                key: new SymmetricSecurityKey(key),
                algorithm: SecurityAlgorithms.HmacSha256Signature
            )
        };

        var token = tokenHandler.CreateToken(tokenDesciptor);
        return tokenHandler.WriteToken(token);
    }
}
