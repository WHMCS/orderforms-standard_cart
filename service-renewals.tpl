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
                    <button id="hideShowServiceRenewalButton" class="btn btn-sm btn-default service-renewals-quick-filter">
                        <span class="to-hide">
                            {lang key='renewService.hideShowServices.hide'}
                        </span>
                        <span class="to-show">
                            {lang key='renewService.hideShowServices.show'}
                        </span>
                    </button>
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
                            {include file="orderforms/standard_cart/service-renewal-item.tpl" renewableItems=$renewableServices prefix=''}
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
