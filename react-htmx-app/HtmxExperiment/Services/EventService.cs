using HtmxExperiment.Models;

namespace HtmxExperiment.Services;

public interface IEventService
{
    Task<List<Event>> GetAllEventsAsync();
    Task<Event?> GetEventByIdAsync(int id);
    Task<Event> AddEventAsync(Event eventItem);
    Task<Event?> UpdateEventAsync(Event eventItem);
    Task<bool> DeleteEventAsync(int id);
}

public class EventService : IEventService
{
    private static readonly List<Event> _events = new()
    {
        new Event
        {
            Id = 1,
            Name = "Tech Conference 2024",
            Description = "Annual technology conference featuring the latest in software development and AI",
            DateTime = DateTime.Now.AddDays(30),
            Location = "Convention Center, Downtown"
        },
        new Event
        {
            Id = 2,
            Name = "Workshop: ASP.NET Core",
            Description = "Hands-on workshop covering advanced ASP.NET Core concepts and best practices",
            DateTime = DateTime.Now.AddDays(15),
            Location = "Microsoft Office, Building A"
        },
        new Event
        {
            Id = 3,
            Name = "Networking Meetup",
            Description = "Monthly networking event for local developers and tech professionals",
            DateTime = DateTime.Now.AddDays(7),
            Location = "Tech Hub Cafe, Main Street"
        },
        new Event
        {
            Id = 4,
            Name = "AI/ML Seminar",
            Description = "Deep dive into machine learning algorithms and their practical applications",
            DateTime = DateTime.Now.AddDays(45),
            Location = "University Auditorium"
        },
        new Event
        {
            Id = 5,
            Name = "Code Review Session",
            Description = "Collaborative code review session focusing on clean code principles",
            DateTime = DateTime.Now.AddDays(3),
            Location = "Company Office, Conference Room B"
        }
    };

    public async Task<List<Event>> GetAllEventsAsync()
    {
        // Simulate async operation
        await Task.Delay(1);
        return _events.OrderBy(e => e.DateTime).ToList();
    }

    public async Task<Event?> GetEventByIdAsync(int id)
    {
        await Task.Delay(1);
        return _events.FirstOrDefault(e => e.Id == id);
    }

    public async Task<Event> AddEventAsync(Event eventItem)
    {
        await Task.Delay(1);
        eventItem.Id = _events.Max(e => e.Id) + 1;
        eventItem.CreatedAt = DateTime.UtcNow;
        _events.Add(eventItem);
        return eventItem;
    }

    public async Task<Event?> UpdateEventAsync(Event eventItem)
    {
        await Task.Delay(1);
        var existingEvent = _events.FirstOrDefault(e => e.Id == eventItem.Id);
        if (existingEvent == null)
            return null;

        existingEvent.Name = eventItem.Name;
        existingEvent.Description = eventItem.Description;
        existingEvent.DateTime = eventItem.DateTime;
        existingEvent.Location = eventItem.Location;
        
        return existingEvent;
    }

    public async Task<bool> DeleteEventAsync(int id)
    {
        await Task.Delay(1);
        var eventItem = _events.FirstOrDefault(e => e.Id == id);
        if (eventItem == null)
            return false;

        _events.Remove(eventItem);
        return true;
    }
}