﻿//using Microsoft.IdentityModel.Tokens;
//using System.IdentityModel.Tokens.Jwt;
//using System.Security.Claims;
//using System.Text;

//public class JwtTokenGenerator
//{
//    private readonly string _secretKey;
//    private readonly string _issuer;
//    private readonly string _audience;
//    private readonly int _expiryInHours;

//    public JwtTokenGenerator(string secretKey, string issuer, string audience, int expiryInHours)
//    {
//        _secretKey = secretKey;
//        _issuer = issuer;
//        _audience = audience;
//        _expiryInHours = expiryInHours;
//    }
//    //jwtconfigraution ile tek satır ?

//    public string GenerateToken(string username, string roleId, string userId)
//    {
//        var claims = new[]
//        {
//            new Claim(ClaimTypes.Name, username),
//            new Claim(ClaimTypes.Role, roleId),
//            new Claim("userId", userId)
//        };

//        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
//        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

//        var token = new JwtSecurityToken(
//            issuer: _issuer,
//            audience: _audience,
//            claims: claims,
//            expires: DateTime.Now.AddHours(_expiryInHours),
//            signingCredentials: creds);

//        return new JwtSecurityTokenHandler().WriteToken(token);
//    } 
//}

using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TravelMapGuideWebApi.Server.Configuration;

public class JwtTokenGenerator
{
    private readonly JwtConfiguration _jwtConfig;

    public JwtTokenGenerator(JwtConfiguration jwtConfig)
    {
        _jwtConfig = jwtConfig;
    }

    public string GenerateToken(string username, string roleName, string userId)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.Name, username),
            new Claim(ClaimTypes.Role, roleName),
            new Claim("userId", userId)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtConfig.SecretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _jwtConfig.Issuer,
            audience: _jwtConfig.Audience,
            claims: claims,
            expires: DateTime.Now.AddHours(_jwtConfig.ExpiryInHours),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
