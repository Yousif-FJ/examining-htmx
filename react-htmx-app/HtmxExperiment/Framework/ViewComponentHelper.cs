using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc;

namespace HtmxExperiment.Framework;

public static class ViewComponentHelper
{
    public static Task<IHtmlContent> InvokeTypedComponentAsync<TComponent,TModel>(this IViewComponentHelper helper, TModel model) 
        where TComponent : BaseComponent<TModel>
    {
        return helper.InvokeAsync(typeof(TComponent).Name, model);
    }
}
