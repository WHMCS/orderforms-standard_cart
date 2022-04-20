{include file="orderforms/standard_cart/common.tpl"}

<div id="order-standard_cart">

    <div class="row">
        <div class="cart-sidebar">
            {include file="orderforms/standard_cart/sidebar-categories.tpl"}
        </div>

        <div class="cart-body">
            <div class="header-lined">
                <h1 class="font-size-36">{$LANG.domaincheckerchoosedomain}</h1>
            </div>
            {include file="orderforms/standard_cart/sidebar-categories-collapsed.tpl"}
            <form id="frmProductDomain">
                <input type="hidden" id="frmProductDomainPid" value="{$pid}" />
                <div class="domain-selection-options">
                    {if $incartdomains}
                        <div class="option">
                            <label>
                                <input type="radio" name="domainoption" value="incart" id="selincart" />{$LANG.cartproductdomainuseincart}
                            </label>
                            <div class="domain-input-group clearfix" id="domainincart">
                                <div class="row">
                                    <div class="col-sm-8 col-sm-offset-1 col-md-6 col-md-offset-2 offset-sm-1 offset-md-2">
                                        <div class="domains-row">
                                            <select id="incartsld" name="incartdomain" class="form-control">
                                                {foreach key=num item=incartdomain from=$incartdomains}
                                                    <option value="{$incartdomain}">{$incartdomain}</option>
                                                {/foreach}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-sm-2">
                                        <button type="submit" class="btn btn-primary btn-block">
                                            {$LANG.orderForm.use}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/if}
                    {if $registerdomainenabled}
                        <div class="option">
                            <label>
                                <input type="radio" name="domainoption" value="register" id="selregister"{if $domainoption eq "register"} checked{/if} />{$LANG.cartregisterdomainchoice|sprintf2:$companyname}
                            </label>
                            <div class="domain-input-group clearfix" id="domainregister">
                                <div class="row">
                                    <div class="col-sm-8 col-sm-offset-1 offset-sm-1">
                                        <div class="row domains-row">
                                            <div class="col-xs-9 col-9">
                                                <div class="input-group">
                                                    <div class="input-group-addon input-group-prepend">
                                                        <span class="input-group-text">{$LANG.orderForm.www}</span>
                                                    </div>
                                                    <input type="text" id="registersld" value="{$sld}" class="form-control" autocapitalize="none" data-toggle="tooltip" data-placement="top" data-trigger="manual" title="{lang key='orderForm.enterDomain'}" />
                                                </div>
                                            </div>
                                            <div class="col-xs-3 col-3">
                                                <select id="registertld" class="form-control">
                                                    {foreach from=$registertlds item=listtld}
                                                        <option value="{$listtld}"{if $listtld eq $tld} selected="selected"{/if}>{$listtld}</option>
                                                    {/foreach}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-sm-2">
                                        <button type="submit" class="btn btn-primary btn-block">
                                            {$LANG.orderForm.check}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/if}
                    {if $transferdomainenabled}
                        <div class="option">
                            <label>
                                <input type="radio" name="domainoption" value="transfer" id="seltransfer"{if $domainoption eq "transfer"} checked{/if} />{$LANG.carttransferdomainchoice|sprintf2:$companyname}
                            </label>
                            <div class="domain-input-group clearfix" id="domaintransfer">
                                <div class="row">
                                    <div class="col-sm-8 col-sm-offset-1 offset-sm-1">
                                        <div class="row domains-row">
                                            <div class="col-xs-9 col-9">
                                                <div class="input-group">
                                                    <div class="input-group-addon input-group-prepend">
                                                        <span class="input-group-text">{$LANG.orderForm.www}</span>
                                                    </div>
                                                    <input type="text" id="transfersld" value="{$sld}" class="form-control" autocapitalize="none" data-toggle="tooltip" data-placement="top" data-trigger="manual" title="{lang key='orderForm.enterDomain'}"/>
                                                </div>
                                            </div>
                                            <div class="col-xs-3 col-3">
                                                <select id="transfertld" class="form-control">
                                                    {foreach from=$transfertlds item=listtld}
                                                        <option value="{$listtld}"{if $listtld eq $tld} selected="selected"{/if}>{$listtld}</option>
                                                    {/foreach}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-sm-2">
                                        <button type="submit" class="btn btn-primary btn-block">
                                            {$LANG.orderForm.transfer}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/if}
                    {if $owndomainenabled}
                        <div class="option">
                            <label>
                                <input type="radio" name="domainoption" value="owndomain" id="selowndomain"{if $domainoption eq "owndomain"} checked{/if} />{$LANG.cartexistingdomainchoice|sprintf2:$companyname}
                            </label>
                            <div class="domain-input-group clearfix" id="domainowndomain">
                                <div class="row">
                                    <div class="col-sm-8 col-sm-offset-1 offset-sm-1">
                                        <div class="row domains-row">
                                            <div class="col-xs-9 col-9">
                                                <div class="input-group">
                                                    <div class="input-group-addon input-group-prepend">
                                                        <span class="input-group-text">{lang key='orderForm.www'}</span>
                                                    </div>
                                                    <input type="text" id="owndomainsld" value="{$sld}" placeholder="{lang key='yourdomainplaceholder'}" class="form-control" autocapitalize="none" data-toggle="tooltip" data-placement="top" data-trigger="manual" title="{lang key='orderForm.enterDomain'}" />
                                                </div>
                                            </div>
                                            <div class="col-xs-3 col-3">
                                                <input type="text" id="owndomaintld" value="{$tld|substr:1}" placeholder="{$LANG.yourtldplaceholder}" class="form-control" autocapitalize="none" data-toggle="tooltip" data-placement="top" data-trigger="manual" title="{lang key='orderForm.required'}" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-sm-2">
                                        <button type="submit" class="btn btn-primary btn-block" id="useOwnDomain">
                                            {$LANG.orderForm.use}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/if}
                    {if $subdomains}
                        <div class="option">
                            <label>
                                <input type="radio" name="domainoption" value="subdomain" id="selsubdomain"{if $domainoption eq "subdomain"} checked{/if} />{$LANG.cartsubdomainchoice|sprintf2:$companyname}
                            </label>
                            <div class="domain-input-group clearfix" id="domainsubdomain">
                                <div class="row">
                                    <div class="col-sm-9">
                                        <div class="row domains-row">
                                            <div class="col-xs-2 col-2 text-right">
                                                <p class="form-control-static">http://</p>
                                            </div>
                                            <div class="col-xs-5 col-5">
                                                <input type="text" id="subdomainsld" value="{$sld}" placeholder="yourname" class="form-control" autocapitalize="none" data-toggle="tooltip" data-placement="top" data-trigger="manual" title="{lang key='orderForm.enterDomain'}" />
                                            </div>
                                            <div class="col-xs-5 col-5">
                                                <select id="subdomaintld" class="form-control">
                                                    {foreach $subdomains as $subid => $subdomain}
                                                        <option value="{$subid}">{$subdomain}</option>
                                                    {/foreach}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-sm-2">
                                        <button type="submit" class="btn btn-primary btn-block">
                                            {$LANG.orderForm.check}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/if}
                </div>

                {if $freedomaintlds}
                    <p>* <em>{$LANG.orderfreedomainregistration} {$LANG.orderfreedomainappliesto}: {$freedomaintlds}</em></p>
                {/if}

            </form>

            <div class="clearfix"></div>
            <form method="post" action="{$WEB_ROOT}/cart.php?a=add&pid={$pid}&domainselect=1" id="frmProductDomainSelections">

                <div id="DomainSearchResults" class="w-hidden">

                    <div id="searchDomainInfo">
                        <p id="primaryLookupSearching" class="domain-lookup-loader domain-lookup-primary-loader domain-searching domain-checker-result-headline">
                            <i class="fas fa-spinner fa-spin"></i>
                            <span class="domain-lookup-register-loader">{lang key='orderForm.checkingAvailability'}...</span>
                            <span class="domain-lookup-transfer-loader">{lang key='orderForm.verifyingTransferEligibility'}...</span>
                            <span class="domain-lookup-other-loader">{lang key='orderForm.verifyingDomain'}...</span>
                        </p>
                        <div id="primaryLookupResult" class="domain-lookup-result domain-lookup-primary-results w-hidden">
                            <div class="domain-unavailable domain-checker-unavailable headline">{lang key='orderForm.domainIsUnavailable'}</div>
                            <div class="domain-available domain-checker-available headline">{$LANG.domainavailable1} <strong></strong> {$LANG.domainavailable2}</div>
                            <div class="btn btn-primary domain-contact-support headline">{$LANG.domainContactUs}</div>
                            <div class="transfer-eligible">
                                <p class="domain-checker-available headline">{lang key='orderForm.transferEligible'}</p>
                                <p>{lang key='orderForm.transferUnlockBeforeContinuing'}</p>
                            </div>
                            <div class="transfer-not-eligible">
                                <p class="domain-checker-unavailable headline">{lang key='orderForm.transferNotEligible'}</p>
                                <p>{lang key='orderForm.transferNotRegistered'}</p>
                                <p>{lang key='orderForm.trasnferRecentlyRegistered'}</p>
                                <p>{lang key='orderForm.transferAlternativelyRegister'}</p>
                            </div>
                            <div class="domain-invalid">
                                <p class="domain-checker-unavailable headline">{lang key='orderForm.domainInvalid'}</p>
                                <p>
                                    {lang key='orderForm.domainLetterOrNumber'}<span class="domain-length-restrictions">{lang key='orderForm.domainLengthRequirements'}</span><br />
                                    {lang key='orderForm.domainInvalidCheckEntry'}
                                </p>
                            </div>
                            <div id="idnLanguageSelector" class="margin-10 idn-language-selector idn-language w-hidden">
                                <div class="row">
                                    <div class="col-sm-10 col-sm-offset-1 col-lg-8 col-lg-offset-2 offset-sm-1 offset-lg-2">
                                        <div class="margin-10 text-center">
                                            {lang key='cart.idnLanguageDescription'}
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-8 col-lg-6 col-sm-offset-2 col-lg-offset-3 offset-sm-2 offset-lg-3">
                                        <div class="form-group">
                                            <select name="idnlanguage" class="form-control">
                                                <option value="">{lang key='cart.idnLanguage'}</option>
                                                {foreach $idnLanguages as $idnLanguageKey => $idnLanguage}
                                                    <option value="{$idnLanguageKey}">{lang key='idnLanguage.'|cat:$idnLanguageKey}</option>
                                                {/foreach}
                                            </select>
                                            <div class="field-error-msg">
                                                {lang key='cart.selectIdnLanguageForRegister'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="domain-price">
                                <span class="register-price-label">{lang key='orderForm.domainPriceRegisterLabel'}</span>
                                <span class="transfer-price-label w-hidden">{lang key='orderForm.domainPriceTransferLabel'}</span>
                                <span class="price"></span>
                            </div>
                            <p class="domain-error domain-checker-unavailable headline"></p>
                            <input type="hidden" id="resultDomainOption" name="domainoption" />
                            <input type="hidden" id="resultDomain" name="domains[]" />
                            <input type="hidden" id="resultDomainPricingTerm" />
                        </div>
                    </div>

                    {if $registerdomainenabled}
                        {if $spotlightTlds}
                            <div id="spotlightTlds" class="spotlight-tlds clearfix w-hidden">
                                <div class="spotlight-tlds-container">
                                    {foreach $spotlightTlds as $key => $data}
                                        <div class="spotlight-tld-container spotlight-tld-container-{$spotlightTlds|count}">
                                            <div id="spotlight{$data.tldNoDots}" class="spotlight-tld">
                                                {if $data.group}
                                                    <div class="spotlight-tld-{$data.group}">{$data.groupDisplayName}</div>
                                                {/if}
                                                {$data.tld}
                                                <span class="domain-lookup-loader domain-lookup-spotlight-loader">
                                                    <i class="fas fa-spinner fa-spin"></i>
                                                </span>
                                                <div class="domain-lookup-result">
                                                    <button type="button" class="btn unavailable w-hidden" disabled="disabled">
                                                        {lang key='domainunavailable'}
                                                    </button>
                                                    <button type="button" class="btn invalid w-hidden" disabled="disabled">
                                                        {lang key='domainunavailable'}
                                                    </button>
                                                    <span class="available price w-hidden">{$data.register}</span>
                                                    <button type="button" class="btn btn-add-to-cart product-domain w-hidden" data-whois="0" data-domain="">
                                                        <span class="to-add">{lang key='orderForm.add'}</span>
                                                        <span class="loading">
                                                            <i class="fas fa-spinner fa-spin"></i> {lang key='loading'}
                                                        </span>
                                                        <span class="added"><i class="far fa-shopping-cart"></i> {lang key='domaincheckeradded'}</span>
                                                        <span class="unavailable">{$LANG.domaincheckertaken}</span>
                                                    </button>
                                                    <button type="button" class="btn btn-primary domain-contact-support w-hidden">
                                                        {lang key='domainChecker.contactSupport'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    {/foreach}
                                </div>
                            </div>
                        {/if}

                        <div class="suggested-domains w-hidden">
                            <div class="panel-heading card-header">
                                {lang key='orderForm.suggestedDomains'}
                            </div>
                            <div id="suggestionsLoader" class="card-body panel-body domain-lookup-loader domain-lookup-suggestions-loader">
                                <i class="fas fa-spinner fa-spin"></i> {lang key='orderForm.generatingSuggestions'}
                            </div>
                            <div id="domainSuggestions" class="domain-lookup-result list-group w-hidden">
                                <div class="domain-suggestion list-group-item w-hidden">
                                    <span class="domain"></span><span class="extension"></span>
                                    <div class="actions">
                                        <button type="button" class="btn btn-add-to-cart product-domain" data-whois="1" data-domain="">
                                            <span class="to-add">{$LANG.addtocart}</span>
                                            <span class="loading">
                                                <i class="fas fa-spinner fa-spin"></i> {lang key='loading'}
                                            </span>
                                            <span class="added">{lang key='domaincheckeradded'}</span>
                                            <span class="unavailable">{$LANG.domaincheckertaken}</span>
                                        </button>
                                        <button type="button" class="btn btn-primary domain-contact-support w-hidden">{lang key='domainChecker.contactSupport'}</button>
                                        <span class="price"></span>
                                        <span class="promo w-hidden"></span>
                                    </div>
                                </div>
                            </div>
                            <div class="panel-footer card-footer more-suggestions text-center w-hidden">
                                <a id="moreSuggestions" href="#" onclick="loadMoreSuggestions();return false;">{lang key='domainsmoresuggestions'}</a>
                                <span id="noMoreSuggestions" class="no-more small w-hidden">{lang key='domaincheckernomoresuggestions'}</span>
                            </div>
                            <div class="text-center text-muted domain-suggestions-warning">
                                <p>{lang key='domainssuggestionswarnings'}</p>
                            </div>
                        </div>
                    {/if}
                </div>

                <div class="text-center">
                    <button id="btnDomainContinue" type="submit" class="btn btn-primary btn-lg w-hidden" disabled="disabled">
                        {$LANG.continue}
                        &nbsp;<i class="fas fa-arrow-circle-right"></i>
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

{include file="orderforms/standard_cart/recommendations-modal.tpl"}
