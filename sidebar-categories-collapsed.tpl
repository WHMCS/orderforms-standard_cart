<div class="sidebar-collapsed">

    <div class="pull-left form-inline float-left">
        <form>
            <select name="gid" id="gidForm" onchange="javascript:redirectToCartPage()" class="form-control">
                <optgroup label="Product Categories">
                    {foreach key=num item=productgroup from=$productgroups}
                        <option value="{$productgroup.routePath}"{if $gid eq $productgroup.gid} selected="selected"{/if}>{$productgroup.name}</option>
                    {/foreach}
                </optgroup>
                <optgroup label="Actions">
                    {if $loggedin}
                        <option value="{$WEB_ROOT}/cart.php?gid=addons"{if $gid eq "addons"} selected{/if}>{$LANG.cartproductaddons}</option>
                        {if $renewalsenabled}
                            <option value="{$WEB_ROOT}/cart.php?gid=renewals"{if $gid eq "renewals"} selected{/if}>{$LANG.domainrenewals}</option>
                        {/if}
                    {/if}
                    {if $registerdomainenabled}
                        <option value="{$WEB_ROOT}/cart.php?gid=registerdomain"{if $domain eq "register"} selected{/if}>{$LANG.navregisterdomain}</option>
                    {/if}
                    {if $transferdomainenabled}
                        <option value="{$WEB_ROOT}/cart.php?gid=transferdomain"{if $domain eq "transfer"} selected{/if}>{$LANG.transferinadomain}</option>
                    {/if}
                    <option value="{$WEB_ROOT}/cart.php?a=view"{if $action eq "view"} selected{/if}>{$LANG.viewcart}</option>
                </optgroup>
            </select>
        </form>
    </div>

    {if !$loggedin && $currencies}
        <div class="pull-right form-inline float-right">
            <form method="post" action="cart.php{if $action}?a={$action}{if $domain}&domain={$domain}{/if}{elseif $gid}?gid={$gid}{/if}">
                <select name="currency" onchange="submit()" class="form-control">
                    <option value="">{$LANG.choosecurrency}</option>
                    {foreach from=$currencies item=listcurr}
                        <option value="{$listcurr.id}"{if $listcurr.id == $currency.id} selected{/if}>{$listcurr.code}</option>
                    {/foreach}
                </select>
            </form>
        </div>
    {/if}

</div>

<script type="text/javascript">
    function redirectToCartPage()
    {
        var path = jQuery('#gidForm').val();
        if (path) {
            window.location.href = path;
        }
    }
</script>
