using Microsoft.AspNetCore.Mvc;

namespace todo_app_htmx.Framework;

public abstract class BaseComponent<TModel> : ViewComponent
{
    public abstract IViewComponentResult Invoke(TModel model);
}
