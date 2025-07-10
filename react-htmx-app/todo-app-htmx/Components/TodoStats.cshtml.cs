using Microsoft.AspNetCore.Mvc;
using todo_app_htmx.Framework;
using todo_app_htmx.Models;

namespace todo_app_htmx.Components;

public class TodoStats : BaseComponent<List<Todo>>
{
    public override IViewComponentResult Invoke(List<Todo> model)
    {
        return View("/Components/TodoStats.cshtml", model);
    }
}
