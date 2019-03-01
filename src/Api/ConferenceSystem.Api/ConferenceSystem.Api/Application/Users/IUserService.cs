using System.Threading.Tasks;

namespace ConferenceSystem.Api.Application.Users
{
	public interface IUserService
	{
		Task<User> GetAsync(string userEmail);
		Task<User> GetAsync(int userId);
		bool ValidatePassword(User user, string password);
	}
}