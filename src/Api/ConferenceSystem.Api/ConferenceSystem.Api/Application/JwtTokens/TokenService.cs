using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using ConferenceSystem.Api.Application.Users;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace ConferenceSystem.Api.Application.JwtTokens
{
    public class TokenService : ITokenService
    {
        private static readonly List<JwtRefreshToken> JwtRefreshTokens = new List<JwtRefreshToken>();

        private readonly JwtSettings _jwtSettings;

        public TokenService(IOptions<JwtSettings> jwtSettings)
        {
            _jwtSettings = jwtSettings.Value;
        }

        public string CreateToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
                }),
                Expires = DateTime.UtcNow.AddMinutes(_jwtSettings.AccessExpireMinutes),
                NotBefore = DateTime.UtcNow,
                Issuer = _jwtSettings.Issuer,
                Audience = _jwtSettings.Audience,
                SigningCredentials = new SigningCredentials(_jwtSettings.IssuerSigningKey, SecurityAlgorithms.HmacSha256Signature)
            };
            var securityToken = tokenHandler.CreateToken(tokenDescriptor);
            var token = tokenHandler.WriteToken(securityToken);

            return token;
        }

        public JwtRefreshToken GenerateRefreshToken(User user)
        {
            var randomNumber = new byte[32];
            string token;
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                token = Convert.ToBase64String(randomNumber);
            }

            return new JwtRefreshToken(token, DateTime.UtcNow.AddMinutes(_jwtSettings.RefreshExpireMinutes), user.Id);
        }

        public int GetUserIdFromExpiredToken(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = false,
                ValidateIssuerSigningKey = true,
                ValidIssuer = _jwtSettings.Issuer,
                ValidAudience = _jwtSettings.Audience,
                IssuerSigningKey = _jwtSettings.IssuerSigningKey,
                ValidateLifetime = false //here we should turn off validate life time since in most cases this method needed refresh expired token
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var securityToken);
            var jwtSecurityToken = securityToken as JwtSecurityToken;
            if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid token");

            var userClaim = principal.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            if(userClaim == null)
                throw new SecurityTokenException("Invalid token");
            var userId = Convert.ToInt32(userClaim);

            return userId;
        }

        public Task<JwtRefreshToken> GetRefreshTokenAsync(int userId, string refreshToken)
        {
            return Task.FromResult(JwtRefreshTokens.FirstOrDefault(x => x.UserId == userId && x.Token == refreshToken));
        }

        public Task AddRefreshTokenAsync(JwtRefreshToken jwtRefreshToken)
        {
            JwtRefreshTokens.Add(jwtRefreshToken);
            return Task.CompletedTask;
        }

        public Task RemoveRefreshTokenAsync(JwtRefreshToken jwtRefreshToken)
        {
            var token = JwtRefreshTokens.FirstOrDefault(x =>
                x.UserId == jwtRefreshToken.UserId && x.Token == jwtRefreshToken.Token);
            JwtRefreshTokens.Remove(token);
            return Task.CompletedTask;
        }
    }
}