using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace ConferenceSystem.Api.Application.JwtTokens
{
    public class JwtSettings
    {
        public string SecurityKey { get; set; }
        public string Issuer { get; set; }
        public string Audience { get; set; }
        public long AccessExpireMinutes { get; set; }
        public long RefreshExpireMinutes { get; set; }
        public SymmetricSecurityKey IssuerSigningKey => new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SecurityKey));

    }
}