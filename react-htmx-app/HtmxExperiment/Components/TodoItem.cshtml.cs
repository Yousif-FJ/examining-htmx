using HtmxExperiment.Framework;
using HtmxExperiment.Models;
using Microsoft.AspNetCore.Mvc;

namespace HtmxExperiment.Components;

public class TodoItem : BaseComponent<Todo>
{
    public override IViewComponentResult Invoke(Todo model)
    {
        return View("/Components/TodoItem.cshtml", model);
    }
}
