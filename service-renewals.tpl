{include file="orderforms/standard_cart/common.tpl"}
<div id="order-standard_cart">
    <div class="row">
        <div class="cart-sidebar">
            {include file="orderforms/standard_cart/sidebar-categories.tpl"}
        </div>
        <div class="cart-body">
            <div class="header-lined row">
                <div class="col-md-6">
                    <h1 class="font-size-36">
                        {if $totalResults > 1}
                            {lang key='renewService.titlePlural'}
                        {else}
                            {lang key='renewService.titleSingular'}
                        {/if}
                    </h1>
                </div>
                <div class="col-md-6">
                    {if $totalResults > 5}
                        <input id="serviceRenewalFilter" type="search" class="service-renewals-filter form-control" placeholder="{lang key='renewService.searchPlaceholder'}">
                    {/if}
                </div>
            </div>
            {include file="orderforms/standard_cart/sidebar-categories-collapsed.tpl"}
            {if $totalServiceCount == 0}
                <div id="no-services" class="alert alert-warning text-center" role="alert">
                    {lang key='renewService.noServices'}
                </div>
                <p class="text-center">
                    <a href="" class="btn btn-default">
                        <i class="fas fa-arrow-circle-left"></i>
                        {lang key='orderForm.returnToClientArea'}
                    </a>
                </p>
            {else}
                <div class="row">
                    <div class="secondary-cart-body">
                        {if $totalResults < $totalServiceCount}
                            <div class="text-center">
                                {lang key='renewService.showingServices' showing=$totalResults totalCount=$totalServiceCount}
                                <a id="linkShowAll" href="{routePath('service-renewals')}">
                                    {lang key='domainRenewal.showAll'}
                                </a>
                            </div>
                        {/if}
                        <div id="serviceRenewals" class="service-renewals">
                            {foreach $renewableServices as $renewableService}
                                <div class="service-renewal" data-product-name="{$renewableService.product.name}" data-service-id="{$renewableService.serviceId}" data-service-domain="{$renewableService.domain}">
                                    <div class="pull-right float-right">
                                        <span class="label label-warning">
                                            {lang key='renewService.renewingIn' days=$renewableService.nextDueDate->diffInDays()}
                                        </span>
                                    </div>
                                    <h3 class="font-size-24">
                                        {$renewableService.product.name}
                                    </h3>
                                    <h4 class="font-size-22">
                                        {$renewableService.domain}
                                    </h4>
                                    <p>
                                        {lang key='renewService.serviceNextDueDateExtended' nextDueDate=$renewableService.nextDueDate->toClientDateFormat() nextDueDateFormatted=$renewableService.nextDueDate->diffForHumans()}
                                    </p>
                                    <div class="clearfix">
                                        <div class="pull-left float-left">
                                            <div class="div-renewal-period-label">
                                                {lang key='renewService.renewalPeriodLabel'}
                                            </div>
                                            <div>
                                                {lang key='renewService.renewalPeriod' nextDueDate=$renewableService.nextDueDate->toClientDateFormat() nextPayUntilDate=$renewableService.nextPayUntilDate->toClientDateFormat() renewalPrice=$renewableService.price}
                                            </div>
                                        </div>
                                        <button id="renewService{$renewableService.serviceId}" class="btn btn-default btn-add-renewal-to-cart pull-right float-right" data-service-id="{$renewableService.serviceId}">
                                            <span class="to-add">
                                                <i class="fas fa-fw fa-spinner fa-spin"></i>
                                                {lang key='addtocart'}
                                            </span>
                                            <span class="added">
                                                {lang key='domaincheckeradded'}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            {/foreach}
                            {foreach $nonRenewableServices as $nonRenewableService}
                                <div class="service-renewal" data-product-name="{$nonRenewableService.product.name}" data-service-id="{$nonRenewableService.serviceId}" data-service-domain="{$nonRenewableService.domain}">
                                    <div class="pull-right float-right">
                                        <span class="label label-info">
                                            {lang key='renewService.renewalUnavailable'}
                                        </span>
                                    </div>
                                    <h3 class="font-size-24">
                                        {$nonRenewableService.product.name}
                                    </h3>
                                    <h4 class="font-size-22">
                                        {$nonRenewableService.domain}
                                    </h4>
                                    <p>
                                        {if is_null($nonRenewableService.nextDueDate)}
                                            {lang key='renewService.serviceNextDueDateBasic' nextDueDate={lang key='na'}}
                                        {else}
                                            {lang key='renewService.serviceNextDueDateExtended' nextDueDate=$nonRenewableService.nextDueDate->toClientDateFormat() nextDueDateFormatted=$nonRenewableService.nextDueDate->diffForHumans()}
                                        {/if}
                                    </p>
                                    <div class="clearfix">
                                        <div class="pull-left float-left">
                                            <div class="div-renewal-ineligible">
                                                <i class="fas fa-info-circle"></i>{$nonRenewableService.reason}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            {/foreach}
                        </div>
                    </div>
                    <div class="secondary-cart-sidebar" id="scrollingPanelContainer">
                        <div id="orderSummary">
                            <div class="order-summary">
                                <div class="loader" id="orderSummaryLoader">
                                    <i class="fas fa-fw fa-sync fa-spin"></i>
                                </div>
                                <h2 class="font-size-30">
                                    {lang key='ordersummary'}
                                </h2>
                                <div class="summary-container" id="producttotal"></div>
                            </div>
                            <div class="text-center">
                                <a id="btnGoToCart" class="btn btn-primary btn-lg" href="{$WEB_ROOT}/cart.php?a=view">
                                    {lang key='viewcart'}
                                    <i class="far fa-shopping-cart"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    </div>
    <form id="removeRenewalForm" method="post" action="{$WEB_ROOT}/cart.php" data-renew-type="service">
        <input type="hidden" name="a" value="remove">
        <input type="hidden" name="r" value="" id="inputRemoveItemType">
        <input type="hidden" name="i" value="" id="inputRemoveItemRef">
        <input type="hidden" name="rt" value="service" id="inputRemoveItemRenewalType">
        <div class="modal fade modal-remove-item" id="modalRemoveItem" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header d-block">
                        <h4 class="modal-title">
                            <button type="button" class="close" data-dismiss="modal" aria-label="{lang key='orderForm.close'}">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <i class="fas fa-times fa-3x"></i>
                            <span>{lang key='orderForm.removeItem'}</span>
                        </h4>
                    </div>
                    <div class="modal-body">
                        {lang key='cartremoveitemconfirm'}
                    </div>
                    <div class="modal-footer d-block">
                        <button type="button" class="btn btn-default" data-dismiss="modal">{lang key='no'}</button>
                        <button type="submit" class="btn btn-primary">{lang key='yes'}</button>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
<script>recalculateRenewalTotals();</script>
