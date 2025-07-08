using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace todo_app_htmx.Framework;

public class PageModelExtension : PageModel
{ 
    public ViewComponentResult ViewComponent<TComponent, TModel>(TModel model) where TComponent : BaseComponent<TModel>
    {
        return ViewComponent(typeof(TComponent).Name, model);
    }
}
