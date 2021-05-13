{if $panel}
    <div class="m-0 panel-heading card-header">
        <h3 class="panel-title">
            {if $panel->hasIcon()}
                <i class="{$panel->getIcon()}"></i>&nbsp;
            {/if}

            {$panel->getLabel()}

            {if $panel->hasBadge()}
                &nbsp;<span class="badge">{$panel->getBadge()}</span>
            {/if}
        </h3>
    </div>

    <div class="panel-body card-body">
        <form role="form">
            <select class="form-control custom-select" onchange="selectChangeNavigate(this)">
                {assign var='hasCurrent' value=false}
                {foreach $panel->getChildren() as $child}
                    <option menuItemName="{$child->getName()}" value="{$child->getUri()}" class="list-group-item" {if $child->isCurrent()}selected="selected"{/if}>
                        {$child->getLabel()}

                        {if $child->hasBadge()}
                            ({$child->getBadge()})
                        {/if}
                    </option>
                    {if !$hasCurrent and $child->isCurrent()}
                        {assign var='hasCurrent' value=true}
                    {/if}
                {/foreach}
                {if !$hasCurrent}
                    <option value="" class="list-group-item" selected=""selected>- {lang key="cartchooseanothercategory"} -</option>
                {/if}
            </select>
        </form>
    </div>

    {if $panel->hasFooterHtml()}
        <div class="panel-footer card-footer">
            {$panel->getFooterHtml()}
        </div>
    {/if}
{/if}
