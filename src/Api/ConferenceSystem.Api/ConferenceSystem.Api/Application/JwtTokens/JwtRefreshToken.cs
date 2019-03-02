using System;

namespace ConferenceSystem.Api.Application.JwtTokens
{
    public class JwtRefreshToken
    {
        public JwtRefreshToken(string token, DateTime expires, int userId)
        {
            Token = token;
            Expires = expires;
            UserId = userId;
        }

        public string Token { get; set; }
        public DateTime Expires { get; set; }
        public int UserId { get; set; }
    }
}