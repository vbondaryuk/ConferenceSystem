using System.Threading.Tasks;
using ConferenceSystem.Api.Application.Users;

namespace ConferenceSystem.Api.Application.JwtTokens
{
    public interface ITokenService
    {
        string CreateToken(User user);
        JwtRefreshToken GenerateRefreshToken(User user);
        Task<JwtRefreshToken> GetRefreshTokenAsync(int userId, string refreshToken);
        int GetUserIdFromExpiredToken(string token);
        Task AddRefreshTokenAsync(JwtRefreshToken jwtRefreshToken);
        Task RemoveRefreshTokenAsync(JwtRefreshToken jwtRefreshToken);
    }
}