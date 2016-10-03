{include file="orderforms/standard_cart/common.tpl"}

<div id="order-standard_cart">

    <div class="row">

        <div class="pull-md-right col-md-9">

            <div class="header-lined">
                <h1>{$LANG.domainrenewals}</h1>
            </div>

        </div>

        <div class="col-md-3 pull-md-left sidebar hidden-xs hidden-sm">

            {include file="orderforms/standard_cart/sidebar-categories.tpl"}

        </div>

        <div class="col-md-9 pull-md-right">

            {include file="orderforms/standard_cart/sidebar-categories-collapsed.tpl"}

            <p>{$LANG.domainrenewdesc}</p>

            <form method="post" action="cart.php?a=add&renewals=true">

                <table class="table table-hover table-striped renewals">
                    <thead>
                        <tr>
                            <th width="20"></th>
                            <th>{$LANG.orderdomain}</th>
                            <th class="text-center">{$LANG.domainstatus}</th>
                            <th class="text-center">{$LANG.domaindaysuntilexpiry}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {foreach from=$renewals item=renewal}
                            <tr>
                                <td>
                                    {if !$renewal.pastgraceperiod && !$renewal.beforerenewlimit}
                                        <input type="checkbox" name="renewalids[]" value="{$renewal.id}" />
                                    {/if}
                                </td>
                                <td>
                                    {$renewal.domain}
                                </td>
                                <td class="text-center">
                                    {$renewal.status}
                                </td>
                                <td class="text-center">
                                    {if $renewal.daysuntilexpiry > 30}
                                        <span class="text-success">
                                            {$renewal.daysuntilexpiry} {$LANG.domainrenewalsdays}
                                        </span>
                                    {elseif $renewal.daysuntilexpiry > 0}
                                        <span class="text-danger">
                                            {$renewal.daysuntilexpiry} {$LANG.domainrenewalsdays}
                                        </span>
                                    {else}
                                        <span>
                                            {$renewal.daysuntilexpiry*-1} {$LANG.domainrenewalsdaysago}
                                        </span>
                                    {/if}
                                    {if $renewal.ingraceperiod}
                                        <br />
                                        <span class="text-danger">
                                            {$LANG.domainrenewalsingraceperiod}
                                        </span>
                                    {/if}
                                </td>
                                <td>
                                    {if $renewal.beforerenewlimit}
                                        <span class="text-danger">
                                            {$LANG.domainrenewalsbeforerenewlimit|sprintf2:$renewal.beforerenewlimitdays}
                                        </span>
                                    {elseif $renewal.pastgraceperiod}
                                        <span class="text-danger">
                                            {$LANG.domainrenewalspastgraceperiod}
                                        </span>
                                    {else}
                                        <select class="form-control" name="renewalperiod[{$renewal.id}]">
                                            {foreach from=$renewal.renewaloptions item=renewaloption}
                                                <option value="{$renewaloption.period}">
                                                    {$renewaloption.period} {$LANG.orderyears} @ {$renewaloption.price}
                                                </option>
                                            {/foreach}
                                        </select>
                                    {/if}
                                </td>
                            </tr>
                        {foreachelse}
                            <tr class="carttablerow">
                                <td colspan="5">{$LANG.domainrenewalsnoneavailable}</td>
                            </tr>
                        {/foreach}
                    </tbody>
                </table>

                <p class="text-center">
                    <button type="submit" class="btn btn-success">
                        <i class="fa fa-shopping-cart"></i>
                        {$LANG.ordernowbutton}
                    </button>
                </p>

            </form>

        </div>
    </div>
</div>
