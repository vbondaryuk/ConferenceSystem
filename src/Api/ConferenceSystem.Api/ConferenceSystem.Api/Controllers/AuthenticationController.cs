using System.Threading.Tasks;
using ConferenceSystem.Api.Application.Auth;
using ConferenceSystem.Api.Application.JwtTokens;
using ConferenceSystem.Api.Application.Users;
using Microsoft.AspNetCore.Mvc;

namespace ConferenceSystem.Api.Controllers
{
    [Route("auth")]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthenticationManager _authenticationManager;

        public AuthenticationController(IAuthenticationManager authenticationManager)
        {
            _authenticationManager = authenticationManager;
        }

        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] LoginDto loginDto)
        {
            var jwtToken = await _authenticationManager.Authenticate(loginDto);

            if (jwtToken == null)
                return BadRequest(new {message = "Username or password is incorrect"});

            return Ok(jwtToken);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] CreateUserDto createUserDto)
        {
            var jwtToken = await _authenticationManager.RegisterAsync(createUserDto);

            if (jwtToken == null)
                return BadRequest(new {message = "Username or password is incorrect"});

            return Ok(jwtToken);
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] JwtToken jwtToken)
        {
            jwtToken = await _authenticationManager.RefreshToken(jwtToken);

            return Ok(jwtToken);
        }
    }
}