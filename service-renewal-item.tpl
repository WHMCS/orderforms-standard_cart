{foreach $renewableItems as $renewableItem}
    <div class="service-renewal"
         data-product-name="{$renewableItem.product->name}"
         data-service-id="{$renewableItem.serviceId}"
         data-service-domain="{$renewableItem.domain}"
         {if $renewableItem.renewable === false}style="display: none;" data-is-renewable="false" {else}data-is-renewable="true"{/if}
    >
        <div class="pull-right float-right">
            {if $renewableItem.renewable === false}
                <span class="label label-info">
                    {lang key='renewService.renewalUnavailable'}
                </span>
            {else}
                <span class="label label-warning">
                    {lang key='renewService.renewingIn' days=$renewableItem.nextDueDate->diffInDays()}
                </span>
            {/if}
        </div>
        <h3 class="font-size-24">
            {$renewableItem.product->name}
        </h3>
        <h4 class="font-size-22">
            {$renewableItem.domain}
        </h4>
        <p>
            {if is_null($renewableItem.nextDueDate)}
                {lang key='renewService.serviceNextDueDateBasic' nextDueDate={lang key='na'}}
            {else}
                {lang key='renewService.serviceNextDueDateExtended' nextDueDate=$renewableItem.nextDueDate->toClientDateFormat() nextDueDateFormatted=$renewableItem.nextDueDate->diffForHumans()}
            {/if}
        </p>
        <div class="clearfix">
            <div class="pull-left float-left">
                {if $renewableItem.renewable === false}
                    <div class="div-renewal-ineligible">
                        <i class="fas fa-info-circle"></i>{$renewableItem.reason}
                    </div>
                {else}
                    <div class="div-renewal-period-label">
                        {lang key='renewService.renewalPeriodLabel'}
                    </div>
                    <div>
                        {lang key='renewService.renewalPeriod' nextDueDate=$renewableItem.nextDueDate->toClientDateFormat() nextPayUntilDate=$renewableItem.nextPayUntilDate->toClientDateFormat() renewalPrice=$renewableItem.price}
                    </div>
                {/if}
            </div>
            {if $renewableItem.renewable === true}
                <button id="renewService{$renewableItem.serviceId}" class="btn btn-default btn-add-renewal-to-cart pull-right float-right" data-service-id="{$prefix}{$renewableItem.serviceId}">
                    <span class="to-add">
                        <i class="fas fa-fw fa-spinner fa-spin"></i>
                        {lang key='addtocart'}
                    </span>
                    <span class="added">
                        {lang key='domaincheckeradded'}
                    </span>
                </button>
            {/if}
        </div>
        {if !empty($renewableItem.addons)}
            <div class="addon-renewals"
                 {if $renewableItem.renewableCount <= 0}style="display: none;" data-is-renewable="false" {else}data-is-renewable="true"{/if}
            >
                <h4 class="font-size-22">Addons</h4>
                <div>
                    {include file="orderforms/standard_cart/service-renewal-item.tpl" renewableItems=$renewableItem.addons prefix='a-'}
                </div>
            </div>
        {/if}
    </div>
{/foreach}