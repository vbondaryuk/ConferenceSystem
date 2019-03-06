using System;
using System.Threading.Tasks;
using ConferenceSystem.Api.Application.JwtTokens;
using ConferenceSystem.Api.Application.Users;
using Microsoft.IdentityModel.Tokens;

namespace ConferenceSystem.Api.Application.Auth
{
    public class AuthenticationManager : IAuthenticationManager
    {
        private readonly IUserService _userService;
        private readonly ITokenService _tokenService;

        public AuthenticationManager(
            IUserService userService,
            ITokenService tokenService)
        {
            _userService = userService;
            _tokenService = tokenService;
        }

        public async Task<JwtToken> Authenticate(LoginDto loginDto)
        {
            User user = await _userService.GetAsync(loginDto.Email);
            if (user == null)
                return null;

            var isValid = _userService.ValidatePassword(user, loginDto.Password);
            if (!isValid)
                return null;

            return await GenerateToken(user);
        }

        public async Task<JwtToken> RegisterAsync(CreateUserDto createUserDto)
        {
            var user = await _userService.AddAsync(createUserDto);

            return await GenerateToken(user);
        }

        public async Task<JwtToken> RefreshToken(JwtToken jwtToken)
        {
            var userId = _tokenService.GetUserIdFromExpiredToken(jwtToken.Token);
            var refreshToken = await _tokenService.GetRefreshTokenAsync(userId, jwtToken.RefreshToken);
            if(refreshToken == null || refreshToken.Expires < DateTime.UtcNow)
                throw new SecurityTokenException("Invalid token");

            User user = await _userService.GetAsync(userId);
            await _tokenService.RemoveRefreshTokenAsync(refreshToken);

            return await GenerateToken(user);
        }

        private async Task<JwtToken> GenerateToken(User user)
        {
            var token = _tokenService.CreateToken(user);
            var refreshToken = _tokenService.GenerateRefreshToken(user);
            await _tokenService.AddRefreshTokenAsync(refreshToken);

            return new JwtToken(token, refreshToken.Token);
        }
    }
}