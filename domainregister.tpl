{include file="orderforms/standard_cart/common.tpl"}

<div id="order-standard_cart">

    <div class="row">

        <div class="pull-md-right col-md-9">

            <div class="header-lined">
                <h1>
                    {$LANG.registerdomain}
                </h1>
            </div>

        </div>

        <div class="col-md-3 pull-md-left sidebar hidden-xs hidden-sm">

            {include file="orderforms/standard_cart/sidebar-categories.tpl"}

        </div>

        <div class="col-md-9 pull-md-right">

            {include file="orderforms/standard_cart/sidebar-categories-collapsed.tpl"}

            <p>{$LANG.orderForm.findNewDomain}</p>

            <div class="domain-checker-container">
                <div class="domain-checker-bg clearfix">
                    <form method="post" action="cart.php" id="frmDomainChecker">
                        <input type="hidden" name="a" value="checkDomain">
                        <div class="row">
                            <div class="col-md-8 col-md-offset-2 col-xs-10 col-xs-offset-1">
                                {if $bulkdomainsearchenabled}
                                    <div class="domain-bulk-options-box hidden-xs">
                                        <a href="domainchecker.php?search=bulk" id="btnBulkOptions" class="btn btn-warning btn-sm">{$LANG.bulkoptions}</a>
                                    </div>
                                {/if}
                                <div class="input-group input-group-lg input-group-box">
                                    <input type="text" name="domain" class="form-control" placeholder="{$LANG.findyourdomain}" value="{$lookupTerm}" id="inputDomain" data-toggle="tooltip" data-placement="left" data-trigger="manual" title="{lang key='orderForm.domainOrKeyword'}" />
                                    <span class="input-group-btn">
                                        <button type="submit" id="btnCheckAvailability" class="btn btn-primary domain-check-availability">{$LANG.search}</button>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {include file="$template/includes/captcha.tpl"}
                    </form>
                </div>
            </div>

            <div id="DomainSearchResults" class="hidden">

                <div id="searchDomainInfo" class="domain-checker-result-headline">
                    <p id="primaryLookupSearching" class="domain-lookup-loader domain-lookup-primary-loader domain-searching"><i class="fa fa-spinner fa-spin"></i> {lang key='orderForm.searching'}...</p>
                    <div id="primaryLookupResult" class="domain-lookup-result hidden">
                        <p class="domain-available domain-checker-available">{$LANG.domainavailable1} <strong></strong> {$LANG.domainavailable2}</p>
                        <p class="domain-unavailable domain-checker-unavailable">{lang key='orderForm.domainIsUnavailable'}</p>
                        <p class="domain-price">
                            <span class="price"></span>
                            <button class="btn btn-primary btn-add-to-cart" data-whois="0" data-domain="">
                                <span class="to-add">{$LANG.addtocart}</span>
                                <span class="added"><i class="glyphicon glyphicon-shopping-cart"></i> {lang key='checkout'}</span>
                                <span class="unavailable">{$LANG.domaincheckertaken}</span>
                            </button>
                        </p>
                    </div>
                </div>

                {if $spotlightTlds}
                    <div id="spotlightTlds" class="spotlight-tlds clearfix">
                        <div class="spotlight-tlds-container">
                            {foreach $spotlightTlds as $key => $data}
                                <div class="spotlight-tld-container spotlight-tld-container-{$spotlightTlds|count}">
                                    <div id="spotlight{$data.tldNoDot}" class="spotlight-tld{if $data.group} spotlight-tld-{$data.group}{/if}">
                                        {$data.tld}
                                        <span class="domain-lookup-loader domain-lookup-spotlight-loader">
                                            <i class="fa fa-spinner fa-spin"></i>
                                        </span>
                                        <div class="domain-lookup-result">
                                            <button type="button" class="btn unavailable hidden" disabled="disabled">
                                                {lang key='domainunavailable'}
                                            </button>
                                            <span class="available price hidden">{$data.register}</span>
                                            <button type="button" class="btn hidden btn-add-to-cart" data-whois="0" data-domain="">
                                                <span class="to-add">{lang key='orderForm.add'}</span>
                                                <span class="added"><i class="glyphicon glyphicon-shopping-cart"></i> {lang key='checkout'}</span>
                                                <span class="unavailable">{$LANG.domaincheckertaken}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            {/foreach}
                        </div>
                    </div>
                {/if}

                <div class="suggested-domains{if !$showSuggestionsContainer} hidden{/if}">
                    <div class="panel-heading">
                        {lang key='orderForm.suggestedDomains'}
                    </div>
                    <div id="suggestionsLoader" class="panel-body domain-lookup-loader domain-lookup-suggestions-loader">
                        <i class="fa fa-spinner fa-spin"></i> {lang key='orderForm.generatingSuggestions'}
                    </div>
                    <ul id="domainSuggestions" class="domain-lookup-result list-group hidden">
                        <li class="domain-suggestion list-group-item hidden">
                            <span class="domain"></span><span class="extension"></span>
                            <button type="button" class="btn btn-add-to-cart" data-whois="1" data-domain="">
                                <span class="to-add">{$LANG.addtocart}</span>
                                <span class="added"><i class="glyphicon glyphicon-shopping-cart"></i> {lang key='checkout'}</span>
                                <span class="unavailable">{$LANG.domaincheckertaken}</span>
                            </button>
                            <span class="price"></span>
                            <span class="promo hidden"></span>
                        </li>
                    </ul>
                    <div class="panel-footer more-suggestions hidden text-center">
                        <a id="moreSuggestions" href="#" onclick="loadMoreSuggestions();return false;">{lang key='domainsmoresuggestions'}</a>
                        <span id="noMoreSuggestions" class="no-more small hidden">{lang key='domaincheckernomoresuggestions'}</span>
                    </div>
                    <div class="text-center text-muted domain-suggestions-warning">
                        {lang key='domainssuggestionswarnings'}</p>
                    </div>
                </div>

            </div>

            <div class="row">
                <div class="{if $domainTransferEnabled}col-md-6{else}col-md-8 col-md-offset-2{/if}">
                    <div class="domain-promo-box">

                        <div class="clearfix">
                            <i class="fa fa-server fa-4x"></i>
                            <h3>{lang key='orderForm.addHosting'}</h3>
                            <p class="font-bold text-warning">{lang key='orderForm.chooseFromRange'}</p>
                        </div>

                        <p>{lang key='orderForm.packagesForBudget'}</p>

                        <a href="cart.php" class="btn btn-warning">
                            {lang key='orderForm.exploreNow'}
                        </a>
                    </div>
                </div>
                {if $domainTransferEnabled}
                    <div class="col-md-6">
                        <div class="domain-promo-box">

                            <div class="clearfix">
                                <i class="fa fa-globe fa-4x"></i>
                                <h3>{lang key='orderForm.transferToUs'}</h3>
                                <p class="font-bold text-primary">{lang key='orderForm.transferExtend'}*</p>
                            </div>

                            <a href="cart.php?a=add&domain=transfer" class="btn btn-primary">
                                {lang key='orderForm.transferDomain'}
                            </a>

                            <p class="small">* {lang key='orderForm.extendExclusions'}</p>
                        </div>
                    </div>
                {/if}
            </div>

        </div>
    </div>
</div>

{if $lookupTerm}
    <script>
        jQuery(document).ready(function() {
            jQuery('#btnCheckAvailability').click();
        });
    </script>
{/if}
