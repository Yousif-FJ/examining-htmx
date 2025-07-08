using Microsoft.AspNetCore.Mvc;
using todo_app_htmx.Framework;
using todo_app_htmx.Models;

namespace todo_app_htmx.Components;

public class TodoItem : BaseComponent<Todo>
{
    public override IViewComponentResult Invoke(Todo model)
    {
        return View("/Components/TodoItem.cshtml", model);
    }
}
