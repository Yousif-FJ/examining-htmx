using HtmxExperiment.Models;
using HtmxExperiment.Services;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace HtmxExperiment.Pages;

public class EventsModel(IEventService eventService) : PageModel
{
    private readonly IEventService _eventService = eventService;

    public List<Event> Events { get; set; } = [];

    public async Task OnGetAsync()
    {
        Events = await _eventService.GetAllEventsAsync();
    }
}