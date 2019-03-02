namespace ConferenceSystem.Api.Application.JwtTokens
{
    public class JwtToken
    {
        public JwtToken(string token, string refreshToken)
        {
            Token = token;
            RefreshToken = refreshToken;
        }

        public string Token { get; set; }
        public string RefreshToken { get; set; }
    }
}