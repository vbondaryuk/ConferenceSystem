using System.Threading.Tasks;
using ConferenceSystem.Api.Application.JwtTokens;
using ConferenceSystem.Api.Application.Users;

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

			var token = _tokenService.CreateToken(user);
			var refreshToken = _tokenService.GenerateRefreshToken(user);
			await AddTokenAsync(user, refreshToken);

			return new JwtToken(token, refreshToken.Token);
		}



		public Task AddTokenAsync(User user, JwtRefreshToken jwtRefreshToken)
		{
			return Task.CompletedTask;
		}

		public Task<JwtRefreshToken> GetTokenAsync(string token)
		{
			throw new System.NotImplementedException();
		}
	}
}