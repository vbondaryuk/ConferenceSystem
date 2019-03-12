using System.Threading.Tasks;
using ConferenceSystem.Api.Application.JwtTokens;
using ConferenceSystem.Api.Application.Users;

namespace ConferenceSystem.Api.Application.Auth
{
    public interface IAuthenticationManager
    {
        Task<JwtToken> Authenticate(LoginDto loginDto);
        Task<User> GetCurrentUser();
        Task<JwtToken> RegisterAsync(CreateUserDto createUserDto);
        Task<JwtToken> RefreshToken(JwtToken jwtToken);
    }
}