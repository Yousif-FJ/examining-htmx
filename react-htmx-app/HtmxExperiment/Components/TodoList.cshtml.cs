using HtmxExperiment.Framework;
using HtmxExperiment.Models;
using Microsoft.AspNetCore.Mvc;

namespace HtmxExperiment.Components;

public class TodoList : BaseComponent<List<Todo>>
{
    public override IViewComponentResult Invoke(List<Todo> model)
    {
        return View("/Components/TodoList.cshtml", model);
    }
}