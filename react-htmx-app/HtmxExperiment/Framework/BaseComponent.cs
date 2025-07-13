using Microsoft.AspNetCore.Mvc;

namespace HtmxExperiment.Framework;

public abstract class BaseComponent<TModel> : ViewComponent
{
    public abstract IViewComponentResult Invoke(TModel model);
}
