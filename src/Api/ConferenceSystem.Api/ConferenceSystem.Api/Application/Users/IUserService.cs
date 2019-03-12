using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ConferenceSystem.Api.Application.Users
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAsync();
        Task<User> GetAsync(string userEmail);
        Task<User> GetAsync(int userId);
        Task<User> AddAsync(CreateUserDto createUserDto);
        bool ValidatePassword(User user, string password);
    }
}