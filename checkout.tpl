<script>
    // Define state tab index value
    var statesTab = 10;
    // Do not enforce state input client side
    var stateNotRequired = true;
</script>
{include file="orderforms/standard_cart/common.tpl"}
<script type="text/javascript" src="{$BASE_PATH_JS}/StatesDropdown.js"></script>
<script type="text/javascript" src="{$BASE_PATH_JS}/PasswordStrength.js"></script>
<script>
    window.langPasswordStrength = "{$LANG.pwstrength}";
    window.langPasswordWeak = "{$LANG.pwstrengthweak}";
    window.langPasswordModerate = "{$LANG.pwstrengthmoderate}";
    window.langPasswordStrong = "{$LANG.pwstrengthstrong}";
</script>
{function name=getFontAwesomeCCIcon}
    {if $ccType eq "Visa"}
        fa-cc-visa
    {elseif $ccType eq "MasterCard"}
        fa-cc-mastercard
    {elseif $ccType eq "Discover"}
        fa-cc-discover
    {elseif $ccType eq "American Express"}
        fa-cc-amex
    {elseif $ccType eq "JCB"}
        fa-cc-jcb
    {elseif $ccType eq "Diners Club" || $ccType eq "EnRoute"}
        fa-cc-diners-club
    {else}
        fa-credit-card
    {/if}
{/function}

<div id="order-standard_cart">

    <div class="row">

        <div class="pull-md-right col-md-9">

            <div class="header-lined">
                <h1>{$LANG.orderForm.checkout}</h1>
            </div>

        </div>

        <div class="col-md-3 pull-md-left sidebar hidden-xs hidden-sm">

            {include file="orderforms/standard_cart/sidebar-categories.tpl"}

        </div>

        <div class="col-md-9 pull-md-right">

            {include file="orderforms/standard_cart/sidebar-categories-collapsed.tpl"}

            <div class="already-registered clearfix">
                <div class="pull-right">
                    <button type="button" class="btn btn-info{if $loggedin || !$loggedin && $custtype eq "existing"} hidden{/if}" id="btnAlreadyRegistered">
                        {$LANG.orderForm.alreadyRegistered}
                    </button>
                    <button type="button" class="btn btn-warning{if $loggedin || $custtype neq "existing"} hidden{/if}" id="btnNewUserSignup">
                        {$LANG.orderForm.createAccount}
                    </button>
                </div>
                <p>{$LANG.orderForm.enterPersonalDetails}</p>
            </div>

            {if $errormessage}
                <div class="alert alert-danger checkout-error-feedback" role="alert">
                    <p>{$LANG.orderForm.correctErrors}:</p>
                    <ul>
                        {$errormessage}
                    </ul>
                </div>
                <div class="clearfix"></div>
            {/if}

            <form method="post" action="{$smarty.server.PHP_SELF}?a=checkout" name="orderfrm" id="frmCheckout">
                <input type="hidden" name="submit" value="true" />
                <input type="hidden" name="custtype" id="inputCustType" value="{$custtype}" />

                <div id="containerExistingUserSignin"{if $loggedin || $custtype neq "existing"} class="hidden"{/if}>

                    <div class="sub-heading">
                        <span>{$LANG.orderForm.existingCustomerLogin}</span>
                    </div>

                    <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group prepend-icon">
                                <label for="inputLoginEmail" class="field-icon">
                                    <i class="fa fa-envelope"></i>
                                </label>
                                <input type="text" name="loginemail" id="inputLoginEmail" class="field" placeholder="{$LANG.orderForm.emailAddress}">
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group prepend-icon">
                                <label for="inputLoginPassword" class="field-icon">
                                    <i class="fa fa-lock"></i>
                                </label>
                                <input type="password" name="loginpassword" id="inputLoginPassword" class="field" placeholder="{$LANG.clientareapassword}">
                            </div>
                        </div>
                    </div>

                </div>

                <div id="containerNewUserSignup"{if !$loggedin && $custtype eq "existing"} class="hidden"{/if}>

                    <div class="sub-heading">
                        <span>{$LANG.orderForm.personalInformation}</span>
                    </div>

                    <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group prepend-icon">
                                <label for="inputFirstName" class="field-icon">
                                    <i class="fa fa-user"></i>
                                </label>
                                <input type="text" name="firstname" id="inputFirstName" class="field" placeholder="{$LANG.orderForm.firstName}" value="{$clientsdetails.firstname}"{if $loggedin} readonly="readonly"{/if} autofocus>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group prepend-icon">
                                <label for="inputLastName" class="field-icon">
                                    <i class="fa fa-user"></i>
                                </label>
                                <input type="text" name="lastname" id="inputLastName" class="field" placeholder="{$LANG.orderForm.lastName}" value="{$clientsdetails.lastname}"{if $loggedin} readonly="readonly"{/if}>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group prepend-icon">
                                <label for="inputEmail" class="field-icon">
                                    <i class="fa fa-envelope"></i>
                                </label>
                                <input type="email" name="email" id="inputEmail" class="field" placeholder="{$LANG.orderForm.emailAddress}" value="{$clientsdetails.email}"{if $loggedin} readonly="readonly"{/if}>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group prepend-icon">
                                <label for="inputPhone" class="field-icon">
                                    <i class="fa fa-phone"></i>
                                </label>
                                <input type="tel" name="phonenumber" id="inputPhone" class="field" placeholder="{$LANG.orderForm.phoneNumber}" value="{$clientsdetails.phonenumber}"{if $loggedin} readonly="readonly"{/if}>
                            </div>
                        </div>
                    </div>

                    <div class="sub-heading">
                        <span>{$LANG.orderForm.billingAddress}</span>
                    </div>

                    <div class="row">
                        <div class="col-sm-12">
                            <div class="form-group prepend-icon">
                                <label for="inputCompanyName" class="field-icon">
                                    <i class="fa fa-building"></i>
                                </label>
                                <input type="text" name="companyname" id="inputCompanyName" class="field" placeholder="{$LANG.orderForm.companyName} ({$LANG.orderForm.optional})" value="{$clientsdetails.companyname}"{if $loggedin} readonly="readonly"{/if}>
                            </div>
                        </div>
                        <div class="col-sm-12">
                            <div class="form-group prepend-icon">
                                <label for="inputAddress1" class="field-icon">
                                    <i class="fa fa-building-o"></i>
                                </label>
                                <input type="text" name="address1" id="inputAddress1" class="field" placeholder="{$LANG.orderForm.streetAddress}" value="{$clientsdetails.address1}"{if $loggedin} readonly="readonly"{/if}>
                            </div>
                        </div>
                        <div class="col-sm-12">
                            <div class="form-group prepend-icon">
                                <label for="inputAddress2" class="field-icon">
                                    <i class="fa fa-map-marker"></i>
                                </label>
                                <input type="text" name="address2" id="inputAddress2" class="field" placeholder="{$LANG.orderForm.streetAddress2}" value="{$clientsdetails.address2}"{if $loggedin} readonly="readonly"{/if}>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="form-group prepend-icon">
                                <label for="inputCity" class="field-icon">
                                    <i class="fa fa-building-o"></i>
                                </label>
                                <input type="text" name="city" id="inputCity" class="field" placeholder="{$LANG.orderForm.city}" value="{$clientsdetails.city}"{if $loggedin} readonly="readonly"{/if}>
                            </div>
                        </div>
                        <div class="col-sm-5">
                            <div class="form-group prepend-icon">
                                <label for="inputState" class="field-icon" id="inputStateIcon">
                                    <i class="fa fa-map-signs"></i>
                                </label>
                                <input type="text" name="state" id="inputState" class="field" placeholder="{$LANG.orderForm.state}" value="{$clientsdetails.state}"{if $loggedin} readonly="readonly"{/if}>
                            </div>
                        </div>
                        <div class="col-sm-3">
                            <div class="form-group prepend-icon">
                                <label for="inputPostcode" class="field-icon">
                                    <i class="fa fa-certificate"></i>
                                </label>
                                <input type="text" name="postcode" id="inputPostcode" class="field" placeholder="{$LANG.orderForm.postcode}" value="{$clientsdetails.postcode}"{if $loggedin} readonly="readonly"{/if}>
                            </div>
                        </div>
                        <div class="col-sm-12">
                            <div class="form-group prepend-icon">
                                <select name="country" id="inputCountry" class="field"{if $loggedin} disabled="disabled"{/if}>
                                    {foreach $countries as $countrycode => $countrylabel}
                                        <option value="{$countrycode}"{if (!$country && $countrycode == $defaultcountry) || $countrycode eq $country} selected{/if}>
                                            {$countrylabel}
                                        </option>
                                    {/foreach}
                                </select>
                            </div>
                        </div>
                    </div>

                    {if $customfields}
                        <div class="sub-heading">
                            <span>{$LANG.orderadditionalrequiredinfo}</span>
                        </div>
                        <div class="field-container">
                            <div class="row">
                                {foreach $customfields as $customfield}
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="customfield{$customfield.id}">{$customfield.name}</label>
                                            {$customfield.input}
                                            {if $customfield.description}
                                                <span class="field-help-text">
                                                    {$customfield.description}
                                                </span>
                                            {/if}
                                        </div>
                                    </div>
                                {/foreach}
                            </div>
                        </div>
                    {/if}

                </div>

                {if $domainsinorder}

                    <div class="sub-heading">
                        <span>{$LANG.domainregistrantinfo}</span>
                    </div>

                    <p class="small text-muted">{$LANG.orderForm.domainAlternativeContact}</p>

                    <div class="row margin-bottom">
                        <div class="col-sm-6 col-sm-offset-3">
                            <select name="contact" id="inputDomainContact" class="field">
                                <option value="">{$LANG.usedefaultcontact}</option>
                                {foreach $domaincontacts as $domcontact}
                                    <option value="{$domcontact.id}"{if $contact == $domcontact.id} selected{/if}>
                                        {$domcontact.name}
                                    </option>
                                {/foreach}
                                <option value="addingnew"{if $contact == "addingnew"} selected{/if}>
                                    {$LANG.clientareanavaddcontact}...
                                </option>
                            </select>
                        </div>
                    </div>

                    <div class="row{if $contact neq "addingnew"} hidden{/if}" id="domainRegistrantInputFields">
                        <div class="col-sm-6">
                            <div class="form-group prepend-icon">
                                <label for="inputDCFirstName" class="field-icon">
                                    <i class="fa fa-user"></i>
                                </label>
                                <input type="text" name="domaincontactfirstname" id="inputDCFirstName" class="field" placeholder="{$LANG.orderForm.firstName}" value="{$domaincontact.firstname}">
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group prepend-icon">
                                <label for="inputDCLastName" class="field-icon">
                                    <i class="fa fa-user"></i>
                                </label>
                                <input type="text" name="domaincontactlastname" id="inputDCLastName" class="field" placeholder="{$LANG.orderForm.lastName}" value="{$domaincontact.lastname}">
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group prepend-icon">
                                <label for="inputDCEmail" class="field-icon">
                                    <i class="fa fa-envelope"></i>
                                </label>
                                <input type="email" name="domaincontactemail" id="inputDCEmail" class="field" placeholder="{$LANG.orderForm.emailAddress}" value="{$domaincontact.email}">
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group prepend-icon">
                                <label for="inputDCPhone" class="field-icon">
                                    <i class="fa fa-phone"></i>
                                </label>
                                <input type="tel" name="domaincontactphonenumber" id="inputDCPhone" class="field" placeholder="{$LANG.orderForm.phoneNumber}" value="{$domaincontact.phonenumber}">
                            </div>
                        </div>
                        <div class="col-sm-12">
                            <div class="form-group prepend-icon">
                                <label for="inputDCCompanyName" class="field-icon">
                                    <i class="fa fa-building"></i>
                                </label>
                                <input type="text" name="domaincontactcompanyname" id="inputDCCompanyName" class="field" placeholder="{$LANG.orderForm.companyName} ({$LANG.orderForm.optional})" value="{$domaincontact.companyname}">
                            </div>
                        </div>
                        <div class="col-sm-12">
                            <div class="form-group prepend-icon">
                                <label for="inputDCAddress1" class="field-icon">
                                    <i class="fa fa-building-o"></i>
                                </label>
                                <input type="text" name="domaincontactaddress1" id="inputDCAddress1" class="field" placeholder="{$LANG.orderForm.streetAddress}" value="{$domaincontact.address1}">
                            </div>
                        </div>
                        <div class="col-sm-12">
                            <div class="form-group prepend-icon">
                                <label for="inputDCAddress2" class="field-icon">
                                    <i class="fa fa-map-marker"></i>
                                </label>
                                <input type="text" name="domaincontactaddress2" id="inputDCAddress2" class="field" placeholder="{$LANG.orderForm.streetAddress2}" value="{$domaincontact.address2}">
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="form-group prepend-icon">
                                <label for="inputDCCity" class="field-icon">
                                    <i class="fa fa-building-o"></i>
                                </label>
                                <input type="text" name="domaincontactcity" id="inputDCCity" class="field" placeholder="{$LANG.orderForm.city}" value="{$domaincontact.city}">
                            </div>
                        </div>
                        <div class="col-sm-5">
                            <div class="form-group prepend-icon">
                                <label for="inputDCState" class="field-icon">
                                    <i class="fa fa-map-signs"></i>
                                </label>
                                <input type="text" name="domaincontactstate" id="inputDCState" class="field" placeholder="{$LANG.orderForm.state}" value="{$domaincontact.state}">
                            </div>
                        </div>
                        <div class="col-sm-3">
                            <div class="form-group prepend-icon">
                                <label for="inputDCPostcode" class="field-icon">
                                    <i class="fa fa-certificate"></i>
                                </label>
                                <input type="text" name="domaincontactpostcode" id="inputDCPostcode" class="field" placeholder="{$LANG.orderForm.postcode}" value="{$domaincontact.postcode}">
                            </div>
                        </div>
                        <div class="col-sm-12">
                            <div class="form-group prepend-icon">
                                <select name="domaincontactcountry" id="inputDCCountry" class="field">
                                    {foreach $countries as $countrycode => $countrylabel}
                                        <option value="{$countrycode}"{if (!$domaincontact.country && $countrycode == $defaultcountry) || $countrycode eq $domaincontact.country} selected{/if}>
                                            {$countrylabel}
                                        </option>
                                    {/foreach}
                                </select>
                            </div>
                        </div>
                    </div>

                {/if}

                {if !$loggedin}

                    <div id="containerNewUserSecurity"{if !$loggedin && $custtype eq "existing"} class="hidden"{/if}>

                        <div class="sub-heading">
                            <span>{$LANG.orderForm.accountSecurity}</span>
                        </div>

                        <div class="row">
                            <div class="col-sm-6">
                                <div class="form-group prepend-icon">
                                    <label for="inputNewPassword1" class="field-icon">
                                        <i class="fa fa-lock"></i>
                                    </label>
                                    <input type="password" name="password" id="inputNewPassword1" class="field" placeholder="{$LANG.clientareapassword}">
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <div class="form-group prepend-icon">
                                    <label for="inputNewPassword2" class="field-icon">
                                        <i class="fa fa-lock"></i>
                                    </label>
                                    <input type="password" name="password2" id="inputNewPassword2" class="field" placeholder="{$LANG.clientareaconfirmpassword}">
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <div class="progress">
                                    <div class="progress-bar progress-bar-success progress-bar-striped" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" id="passwordStrengthMeterBar">
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <p class="text-center small text-muted" id="passwordStrengthTextLabel">{$LANG.pwstrength}: {$LANG.pwstrengthenter}</p>
                            </div>
                        </div>
                        {if $securityquestions}
                            <div class="row">
                                <div class="col-sm-6">
                                    <select name="securityqid" id="inputSecurityQId" class="field">
                                        <option value="">{$LANG.clientareasecurityquestion}</option>
                                        {foreach $securityquestions as $question}
                                            <option value="{$question.id}"{if $question.id eq $securityqid} selected{/if}>
                                                {$question.question}
                                            </option>
                                        {/foreach}
                                    </select>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group prepend-icon">
                                        <label for="inputSecurityQAns" class="field-icon">
                                            <i class="fa fa-lock"></i>
                                        </label>
                                        <input type="password" name="securityqans" id="inputSecurityQAns" class="field" placeholder="{$LANG.clientareasecurityanswer}">
                                    </div>
                                </div>
                            </div>
                        {/if}

                    </div>

                {/if}

                {foreach $hookOutput as $output}
                    <div>
                        {$output}
                    </div>
                {/foreach}

                <div class="sub-heading">
                    <span>{$LANG.orderForm.paymentDetails}</span>
                </div>

                <div class="alert alert-success text-center large-text" role="alert">
                    {$LANG.ordertotalduetoday}: &nbsp; <strong>{$total}</strong>
                </div>

                <div class="form-group">
                    <p class="small text-muted">{$LANG.orderForm.preferredPaymentMethod}</p>

                    <div class="text-center">
                        {foreach key=num item=gateway from=$gateways}
                            <label class="radio-inline">
                                <input type="radio" name="paymentmethod" value="{$gateway.sysname}" class="payment-methods{if $gateway.type eq "CC"} is-credit-card{/if}"{if $selectedgateway eq $gateway.sysname} checked{/if} />
                                {$gateway.name}
                            </label>
                        {/foreach}
                    </div>
                </div>

                <div class="alert alert-danger text-center gateway-errors hidden"></div>

                <div class="clearfix"></div>

                <div id="creditCardInputFields"{if $selectedgatewaytype neq "CC"} class="hidden"{/if}>
                    {if $clientsdetails.cclastfour}
                        <div class="row margin-bottom">
                            <div class="col-sm-12">
                                <div class="text-center">
                                    <label class="radio-inline">
                                        <input type="radio" name="ccinfo" value="useexisting" id="useexisting" {if $clientsdetails.cclastfour} checked{else} disabled{/if} />
                                        {$LANG.creditcarduseexisting}
                                        {if $clientsdetails.cclastfour}
                                            ({$clientsdetails.cclastfour})
                                        {/if}
                                    </label>
                                    <label class="radio-inline">
                                        <input type="radio" name="ccinfo" value="new" id="new" {if !$clientsdetails.cclastfour || $ccinfo eq "new"} checked{/if} />
                                        {$LANG.creditcardenternewcard}
                                    </label>
                                </div>
                            </div>
                        </div>
                    {else}
                        <input type="hidden" name="ccinfo" value="new" />
                    {/if}
                    <div id="newCardInfo" class="row{if $clientsdetails.cclastfour && $ccinfo neq "new"} hidden{/if}">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <input type="hidden" id="cctype" name="cctype" value="{$acceptedcctypes.0}" />
                                <div class="dropdown" id="cardType">
                                    <button class="btn btn-default dropdown-toggle field" type="button" id="creditCardType" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                        <span id="selectedCardType">
                                            <i class="fa {getFontAwesomeCCIcon ccType=$acceptedcctypes.0} fa-fw"></i>
                                            {$acceptedcctypes.0}
                                        </span>
                                        <span class="fa fa-caret-down fa-fw"></span>
                                    </button>
                                    <ul class="dropdown-menu" id="creditCardTypeDropDown" aria-labelledby="creditCardType">
                                        {foreach $acceptedcctypes as $cardType}
                                            <li>
                                                <a href="#">
                                                    <i class="fa {getFontAwesomeCCIcon ccType=$cardType} fa-fw"></i>
                                                    <span class="type">
                                                        {$cardType}
                                                    </span>
                                                </a>
                                            </li>
                                        {/foreach}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group prepend-icon">
                                <label for="inputCardNumber" class="field-icon">
                                    <i class="fa fa-credit-card"></i>
                                </label>
                                <input type="tel" name="ccnumber" id="inputCardNumber" class="field" placeholder="{$LANG.orderForm.cardNumber}" autocomplete="cc-number">
                            </div>
                        </div>
                        {if $showccissuestart}
                            <div class="col-sm-6">
                                <div class="form-group prepend-icon">
                                    <label for="inputCardStart" class="field-icon">
                                        <i class="fa fa-calendar-check-o"></i>
                                    </label>
                                    <input type="tel" name="ccstartdate" id="inputCardStart" class="field" placeholder="MM / YY ({$LANG.creditcardcardstart})" autocomplete="cc-exp">
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <div class="form-group prepend-icon">
                                    <label for="inputCardIssue" class="field-icon">
                                        <i class="fa fa-asterisk"></i>
                                    </label>
                                    <input type="tel" name="ccissuenum" id="inputCardIssue" class="field" placeholder="{$LANG.creditcardcardissuenum}">
                                </div>
                            </div>
                        {/if}
                        <div class="col-sm-6">
                            <div class="form-group prepend-icon">
                                <label for="inputCardExpiry" class="field-icon">
                                    <i class="fa fa-calendar"></i>
                                </label>
                                <input type="tel" name="ccexpirydate" id="inputCardExpiry" class="field" placeholder="MM / YY{if $showccissuestart} ({$LANG.creditcardcardexpires}){/if}" autocomplete="cc-exp">
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group prepend-icon">
                                <label for="inputCardCVV" class="field-icon">
                                    <i class="fa fa-barcode"></i>
                                </label>
                                <input type="tel" name="cccvv" id="inputCardCVV" class="field" placeholder="{$LANG.orderForm.cvv}" autocomplete="cc-cvc">
                            </div>
                        </div>
                    </div>
                    <div id="existingCardInfo" class="row{if !$clientsdetails.cclastfour || $ccinfo eq "new"} hidden{/if}">
                        <div class="col-sm-12">
                            <div class="form-group prepend-icon">
                                <label for="inputCardCvvExisting" class="field-icon">
                                    <i class="fa fa-barcode"></i>
                                </label>
                                <input type="tel" name="cccvvexisting" id="inputCardCvvExisting" class="field" placeholder="{$LANG.orderForm.cvv}" autocomplete="cc-cvc">
                            </div>
                        </div>
                    </div>
                </div>

                {if $shownotesfield}

                    <div class="sub-heading">
                        <span>{$LANG.orderForm.additionalNotes}</span>
                    </div>

                    <div class="row">
                        <div class="col-sm-12">
                            <div class="form-group">
                                <textarea name="notes" class="field" rows="4" placeholder="{$LANG.ordernotesdescription}">{$orderNotes}</textarea>
                            </div>
                        </div>
                    </div>

                {/if}

                <div class="text-center">
                    {if $accepttos}
                        <p>
                            <label class="checkbox-inline">
                                <input type="checkbox" name="accepttos" id="accepttos" />
                                &nbsp;
                                {$LANG.ordertosagreement}
                                <a href="{$tosurl}" target="_blank">{$LANG.ordertos}</a>
                            </label>
                        </p>
                    {/if}

                    <button type="submit" id="btnCompleteOrder" class="btn btn-primary btn-lg"{if $cartitems==0} disabled="disabled"{/if} onclick="this.value='{$LANG.pleasewait}'">
                        {$LANG.completeorder}
                        &nbsp;<i class="fa fa-arrow-circle-right"></i>
                    </button>
                </div>
            </form>

            {if $servedOverSsl}
                <div class="alert alert-warning checkout-security-msg">
                    <i class="fa fa-lock"></i>
                    {$LANG.ordersecure} (<strong>{$ipaddress}</strong>) {$LANG.ordersecure2}
                </div>
            {/if}

        </div>
    </div>
</div>

<script type="text/javascript" src="{$BASE_PATH_JS}/jquery.payment.js"></script>
