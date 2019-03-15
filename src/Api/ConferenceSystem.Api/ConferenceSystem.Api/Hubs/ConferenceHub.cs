using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
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
        private readonly IUserService _userService;
        private static readonly ConcurrentDictionary<User, HashSet<string>> ConnectedClients = new ConcurrentDictionary<User, HashSet<string>>();

        public ConferenceHub(IUserService userService)
        {
            _userService = userService;
        }

        public async Task SendMessage(MessageViewModel message)
        {
            var user = await _userService.GetAsync(message.Recipient);
            if (ConnectedClients.TryGetValue(user, out HashSet<string> connectionIds))
            {
                foreach (var connectionId in connectionIds)
                {
                    await Clients.Client(connectionId).SendAsync("ReceiveMessage", message);
                }
            }
        }

        public async Task RequestConnectedClients()
        {
            var clients = ConnectedClients.Keys;
            await Clients.Caller.SendAsync("connectedUsers", clients);
        }

        public override async Task OnConnectedAsync()
        {
            var connectionId = Context.ConnectionId;
            var email = Context.User.FindFirstValue(ClaimTypes.Email);
            var user = await _userService.GetAsync(email);

            if (ConnectedClients.TryGetValue(user, out var connectionIds))
            {
                connectionIds.Add(connectionId);
            }
            else
            {
                connectionIds = new HashSet<string> { connectionId };
                ConnectedClients.AddOrUpdate(user, connectionIds, (_, updatedConnections) =>
                {
                    updatedConnections.UnionWith(connectionIds);
                    return updatedConnections;
                });

            }
            
            _ = Clients.All.SendAsync("OnConnectedUser", UserMapper.Map(user));
        }

        /// <summary>Called when a connection with the hub is terminated.</summary>
        /// <returns>A <see cref="T:System.Threading.Tasks.Task" /> that represents the asynchronous disconnect.</returns>
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var connectionId = Context.ConnectionId;
            var email = Context.User.FindFirstValue(ClaimTypes.Email);
            var user = await _userService.GetAsync(email);
            if (ConnectedClients.TryGetValue(user, out var connectionIds))
            {
                connectionIds.Remove(connectionId);
            }

            if (connectionIds?.Count == 0)
            {
                ConnectedClients.TryRemove(user, out _);
            }

            _ = Clients.All.SendAsync("OnDisconnectedUser", UserMapper.Map(user));
        }
    }
}