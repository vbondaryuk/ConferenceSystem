using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace ConferenceSystem.Api.Application.Users
{
    public class UserService : IUserService
    {
        private static readonly List<User> Users = new List<User>
        {
            new User
            {
                Id = 1,
                Email = "test@test",
                Password = CreatePassword("123456", Array.Empty<byte>()),
                Salt = Array.Empty<byte>()
            }
        };

        public Task<User> GetAsync(string userEmail)
        {
            return Task.FromResult(Users.SingleOrDefault(x => x.Email == userEmail));
        }

        public Task<User> GetAsync(int userId)
        {
            return Task.FromResult(Users.SingleOrDefault(x => x.Id == userId));
        }

        public async Task<User> AddAsync(CreateUserDto createUserDto)
        {
            var user = await GetAsync(createUserDto.Email);
            if (user != null)
                throw new Exception("User already exists");

            int id = Users.Max(x => x.Id) + 1;//temporary solution while we do not use DataBase

            var salt = CreateSalt();
            var password = CreatePassword(createUserDto.Password, salt);
            user = new User
            {
                Id = id,
                Email = createUserDto.Email,
                FirstName = createUserDto.FirstName,
                LastName = createUserDto.LastName,
                Password = password,
                Salt = salt
            };
            Users.Add(user);

            return user;
        }

        public bool ValidatePassword(User user, string password)
        {
            using (var hmacSha512 = new HMACSHA512(user.Salt))
            {
                var computedHash = hmacSha512.ComputeHash(Encoding.UTF8.GetBytes(password));
                if (computedHash.Length != user.Password.Length)
                    return false;

                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != user.Password[i])
                        return false;
                }
            }

            return true;
        }

        private static byte[] CreateSalt()
        {
            var salt = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
                return salt;
            }
        }

        private static byte[] CreatePassword(string password, byte[] salt)
        {
            using (var hmacSha512 = new HMACSHA512(salt))
            {
                return hmacSha512.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
        }
    }
}