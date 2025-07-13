using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace HtmxExperiment.Framework;

public class PageModelExtension : PageModel
{ 
    public ViewComponentResult ViewComponent<TComponent, TModel>(TModel model) where TComponent : BaseComponent<TModel>
    {
        return ViewComponent(typeof(TComponent).Name, model);
    }
}
