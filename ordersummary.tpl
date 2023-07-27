{if $producttotals}
    <span class="product-name">{if $producttotals.allowqty && $producttotals.qty > 1}{$producttotals.qty} x {/if}{$producttotals.productinfo.name}</span>
    <span class="product-group">{$producttotals.productinfo.groupname}</span>

    <div class="clearfix">
        <span class="pull-left float-left">{$producttotals.productinfo.name}</span>
        <span class="pull-right float-right">{$producttotals.pricing.baseprice}</span>
    </div>

    {foreach $producttotals.configoptions as $configoption}
        {if $configoption}
            <div class="clearfix">
                <span class="pull-left float-left">&nbsp;&raquo; {$configoption.name}: {$configoption.optionname}</span>
                <span class="pull-right float-right">{$configoption.recurring}{if $configoption.setup} + {$configoption.setup} {$LANG.ordersetupfee}{/if}</span>
            </div>
        {/if}
    {/foreach}

    {foreach $producttotals.addons as $addon}
        <div class="clearfix">
            <span class="pull-left float-left">+ {$addon.name}</span>
            <span class="pull-right float-right">{$addon.recurring}</span>
        </div>
    {/foreach}

    {if $producttotals.pricing.setup || $producttotals.pricing.recurring || $producttotals.pricing.addons}
        <div class="summary-totals">
            {if $producttotals.pricing.setup}
                <div class="clearfix">
                    <span class="pull-left float-left">{$LANG.cartsetupfees}:</span>
                    <span class="pull-right float-right">{$producttotals.pricing.setup}</span>
                </div>
            {/if}
            {foreach from=$producttotals.pricing.recurringexcltax key=cycle item=recurring}
                <div class="clearfix">
                    <span class="pull-left float-left">{$cycle}:</span>
                    <span class="pull-right float-right">{$recurring}</span>
                </div>
            {/foreach}
            {if $producttotals.pricing.tax1}
                <div class="clearfix">
                    <span class="pull-left float-left">{$carttotals.taxname} @ {$carttotals.taxrate}%:</span>
                    <span class="pull-right float-right">{$producttotals.pricing.tax1}</span>
                </div>
            {/if}
            {if $producttotals.pricing.tax2}
                <div class="clearfix">
                    <span class="pull-left float-left">{$carttotals.taxname2} @ {$carttotals.taxrate2}%:</span>
                    <span class="pull-right float-right">{$producttotals.pricing.tax2}</span>
                </div>
            {/if}
        </div>
    {/if}

    <div class="total-due-today">
        <span class="amt">{$producttotals.pricing.totaltoday}</span>
        <span>{$LANG.ordertotalduetoday}</span>
    </div>
{elseif !empty($renewals) || !empty($serviceRenewals)}
    {if !empty($serviceRenewals) && !empty($carttotals.renewalsByType.services)}
        <span class="product-name">{lang key='renewService.titleAltPlural'}</span>
        {foreach $carttotals.renewalsByType.services as $serviceId => $serviceRenewal}
            <div class="clearfix" id="cartServiceRenewal{$serviceId}">
                <div class="pull-left float-left">
                    <div>
                        {$serviceRenewal.name}
                    </div>
                    <div>
                        {$serviceRenewal.domainName}
                    </div>
                </div>
                <div class="pull-right float-right">
                    <div>
                        {$serviceRenewal.billingCycle}
                    </div>
                    <div>
                        {$serviceRenewal.recurringBeforeTax}
                        <a onclick="removeItem('r','{$serviceId}','service'); return false;" href="#" id="linkCartRemoveServiceRenewal{$serviceId}">
                            <i class="fas fa-fw fa-trash-alt"></i>
                        </a>
                    </div>
                </div>
            </div>
        {/foreach}
    {elseif !empty($renewals) && !empty($carttotals.renewalsByType.domains)}
        <span class="product-name">{lang key='domainrenewals'}</span>
        {foreach $carttotals.renewalsByType.domains as $domainId => $renewal}
            <div class="clearfix" id="cartDomainRenewal{$domainId}">
                <span class="pull-left float-left">
                    {$renewal.domain} - {$renewal.regperiod} {if $renewal.regperiod == 1}{lang key='orderForm.year'}{else}{lang key='orderForm.years'}{/if}
                </span>
                <span class="pull-right float-right">
                    {$renewal.priceBeforeTax}
                    <a onclick="removeItem('r','{$domainId}','domain'); return false;" href="#" id="linkCartRemoveDomainRenewal{$domainId}">
                        <i class="fas fa-fw fa-trash-alt"></i>
                    </a>
                </span>
            </div>
            {if $renewal.dnsmanagement}
                <div class="clearfix">
                    <span class="pull-left float-left">+ {lang key='domaindnsmanagement'}</span>
                </div>
            {/if}
            {if $renewal.emailforwarding}
                <div class="clearfix">
                    <span class="pull-left float-left">+ {lang key='domainemailforwarding'}</span>
                </div>
            {/if}
            {if $renewal.idprotection}
                <div class="clearfix">
                    <span class="pull-left float-left">+ {lang key='domainidprotection'}</span>
                </div>
            {/if}
            {if $renewal.hasGracePeriodFee}
                <div class="clearfix">
                    <span class="pull-left float-left">+ {lang key='domainRenewal.graceFee'}</span>
                </div>
            {/if}
            {if $renewal.hasRedemptionGracePeriodFee}
                <div class="clearfix">
                    <span class="pull-left float-left">+ {lang key='domainRenewal.redemptionFee'}</span>
                </div>
            {/if}

        {/foreach}
    {/if}
    <div class="summary-totals">
        <div class="clearfix">
            <span class="pull-left float-left">{lang key='ordersubtotal'}:</span>
            <span class="pull-right float-right">{$carttotals.subtotal}</span>
        </div>
        {if ($carttotals.taxrate && $carttotals.taxtotal) || ($carttotals.taxrate2 && $carttotals.taxtotal2)}
            {if $carttotals.taxrate}
                <div class="clearfix">
                    <span class="pull-left float-left">{$carttotals.taxname} @ {$carttotals.taxrate}%:</span>
                    <span class="pull-right float-right">{$carttotals.taxtotal}</span>
                </div>
            {/if}
            {if $carttotals.taxrate2}
                <div class="clearfix">
                    <span class="pull-left float-left">{$carttotals.taxname2} @ {$carttotals.taxrate2}%:</span>
                    <span class="pull-right float-right">{$carttotals.taxtotal2}</span>
                </div>
            {/if}
        {/if}
    </div>
    <div class="total-due-today">
        <span class="amt">{$carttotals.total}</span>
        <span>{lang key='ordertotalduetoday'}</span>
    </div>
{/if}
