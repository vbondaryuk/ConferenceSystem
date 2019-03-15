using ConferenceSystem.Api.Application.Users;

namespace ConferenceSystem.Api.Models
{
    public static class UserMapper
    {
        public static UserViewModel Map(User user)
        {
            return new UserViewModel
            {
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName
            };
        }
    }
}