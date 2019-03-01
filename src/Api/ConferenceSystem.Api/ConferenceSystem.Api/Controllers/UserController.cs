using System.Threading.Tasks;
using ConferenceSystem.Api.Application.Auth;
using ConferenceSystem.Api.Application.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ConferenceSystem.Api.Controllers
{
	[Authorize]
	[ApiController]
	[Route("[controller]")]
	public class UserController : ControllerBase
	{
		private readonly IAuthenticationManager _authenticationManager;

		public UserController(IAuthenticationManager authenticationManager)
		{
			_authenticationManager = authenticationManager;
		}

		[AllowAnonymous]
		[HttpPost("authenticate")]
		public async Task<IActionResult> Authenticate([FromBody]LoginDto loginDto)
		{
			var jwtToken = await _authenticationManager.Authenticate(loginDto);

			if (jwtToken == null)
				return BadRequest(new { message = "Username or password is incorrect" });

			return Ok(jwtToken);
		}
	}
}