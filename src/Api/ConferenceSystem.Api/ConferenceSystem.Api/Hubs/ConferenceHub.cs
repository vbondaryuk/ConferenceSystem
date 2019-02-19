using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace ConferenceSystem.Api.Hubs
{
	public class ConferenceHub : Hub
	{
		public async Task SendMessage(string user, string message)
		{
			await Clients.All.SendAsync("ReceiveMessage", user, message);
		}
	}
}