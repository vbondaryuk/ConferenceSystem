using System;
using System.Collections.Concurrent;
using System.Security.Claims;
using System.Threading.Tasks;
using ConferenceSystem.Api.Application.Users;
using ConferenceSystem.Api.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace ConferenceSystem.Api.Hubs
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ConferenceHub : Hub
    {
        private static readonly ConcurrentDictionary<string, string> ConnectedClients = new ConcurrentDictionary<string, string>();

        public async Task SendMessage(MessageViewModel message)
        {
            var recipient = message.Recipient;
            if(ConnectedClients.TryGetValue(recipient, out string connectionId))
            {
                await Clients.Client(connectionId).SendAsync("ReceiveMessage", message);
            }
        }

        public async Task RequestConnectedClients()
        {
            var clients = ConnectedClients.Keys;
            await Clients.Caller.SendAsync("connectedUsers", clients);
        }

        public override Task OnConnectedAsync()
        {
            var email = Context.User.FindFirstValue(ClaimTypes.Email);
            ConnectedClients.TryAdd(email, Context.ConnectionId);
            _ = Clients.All.SendAsync("OnConnectedUser", email);

            return Task.CompletedTask;
        }

        /// <summary>Called when a connection with the hub is terminated.</summary>
        /// <returns>A <see cref="T:System.Threading.Tasks.Task" /> that represents the asynchronous disconnect.</returns>
        public override Task OnDisconnectedAsync(Exception exception)
        {
            var email = Context.User.FindFirstValue(ClaimTypes.Email);
            ConnectedClients.TryRemove(email, out _);
            _ = Clients.All.SendAsync("OnDisconnectedUser", email);

            return Task.CompletedTask;
        }
    }
}