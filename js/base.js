if (typeof localTrans === 'undefined') {
    localTrans = function (phraseId, fallback)
    {
        if (typeof _localLang !== 'undefined') {
            if (typeof _localLang[phraseId] !== 'undefined') {
                if (_localLang[phraseId].length > 0) {
                    return _localLang[phraseId];
                }
            }
        }

        return fallback;
    }
}

var domainLookupCallCount,
    checkoutForm,
    furtherSuggestions,
    hideCvcOnCheckoutForExistingCard = 0;

jQuery(document).ready(function(){

    jQuery('#order-standard_cart').find('input').not('.no-icheck').iCheck({
        inheritID: true,
        checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue',
        increaseArea: '20%'
    });

    jQuery('.mc-promo .header').click(function(e) {
        e.preventDefault();
        if (jQuery(e.target).is('.btn, .btn span,.btn .fa')) {
            return;
        }
        jQuery(this).parent().find('.rotate').toggleClass('down');
        jQuery(this).parent().find('.body').slideToggle('fast');
    });
    jQuery('.mc-promos.viewcart .mc-promo:first-child .header').click();

    var cardNumber = jQuery('#inputCardNumber'),
        existingCvv = jQuery('#inputCardCVV2');
    if (cardNumber.length) {
        cardNumber.payment('formatCardNumber');
        jQuery('#inputCardCVV').payment('formatCardCVC');
        jQuery('#inputCardStart').payment('formatCardExpiry');
        jQuery('#inputCardExpiry').payment('formatCardExpiry');
    }
    if (existingCvv.length) {
        existingCvv.payment('formatCardCVC');
    }

    var $orderSummaryEl = jQuery("#orderSummary");
    if ($orderSummaryEl.length) {
        var offset = jQuery("#scrollingPanelContainer").parent('.row').offset();
        var maxTopOffset = jQuery("#scrollingPanelContainer").parent('.row').outerHeight() - 35;
        var topPadding = 15;
        jQuery(window).resize(function() {
            offset = jQuery("#scrollingPanelContainer").parent('.row').offset();
            maxTopOffset = jQuery("#scrollingPanelContainer").parent('.row').outerHeight() - 35;
            repositionScrollingSidebar();
        });
        jQuery(window).scroll(function() {
            repositionScrollingSidebar();
        });
        repositionScrollingSidebar();
    }

    function repositionScrollingSidebar() {
        if (jQuery('#scrollingPanelContainer').css('float') === 'none') {
            $orderSummaryEl.stop().css('margin-top', '0');
            return false;
        }
        var heightOfOrderSummary =  $orderSummaryEl.outerHeight();
        var offsetTop = 0;
        if (typeof offset !== "undefined") {
            offsetTop = offset.top;
        }
        var newTopOffset = jQuery(window).scrollTop() - offsetTop + topPadding;
        if (newTopOffset > maxTopOffset - heightOfOrderSummary) {
            newTopOffset = maxTopOffset - heightOfOrderSummary;
        }
        if (jQuery(window).scrollTop() > offsetTop) {
            $orderSummaryEl.stop().animate({
                marginTop: newTopOffset
            });
        } else {
            $orderSummaryEl.stop().animate({
                marginTop: 0
            });
        }
    }

    jQuery("#frmConfigureProduct").submit(function(e) {
        e.preventDefault();

        var button = jQuery('#btnCompleteProductConfig'),
            btnOriginalText = jQuery(button).html(),
            postUrl = whmcsBaseUrl + '/cart.php',
            postData = 'a=confproduct&' + jQuery("#frmConfigureProduct").serialize();

        jQuery(button).find('i').removeClass('fa-arrow-circle-right').addClass('fa-spinner fa-spin');
        displayRecommendations(
            postUrl,
            'addproductajax=1&' + postData,
            false
        ).done(function() {
            WHMCS.http.jqClient.post(
                postUrl,
                'ajax=1&' + postData,
                function(data) {
                    if (data) {
                        jQuery("#btnCompleteProductConfig").html(btnOriginalText);
                        jQuery("#containerProductValidationErrorsList").html(data);
                        jQuery("#containerProductValidationErrors").show();
                        // scroll to error container if below it
                        if (jQuery(window).scrollTop() > jQuery("#containerProductValidationErrors").offset().top) {
                            jQuery('html, body').scrollTop(jQuery("#containerProductValidationErrors").offset().top - 15);
                        }
                    } else {
                        window.location = whmcsBaseUrl + '/cart.php?a=confdomains';
                    }
                }
            );
        });
    });

    jQuery("#productConfigurableOptions").on('ifChecked', 'input', function() {
        recalctotals();
    });
    jQuery("#productConfigurableOptions").on('ifUnchecked', 'input', function() {
        recalctotals();
    });
    jQuery("#productConfigurableOptions").on('change', 'select', function() {
        recalctotals();
    });

    jQuery(".addon-products").on('click', '.panel-addon', function(e) {
        e.preventDefault();
        var $activeAddon = jQuery(this);
        if ($activeAddon.hasClass('panel-addon-selected')) {
            $activeAddon.find('input[type="checkbox"]').iCheck('uncheck');
        } else {
            $activeAddon.find('input[type="checkbox"]').iCheck('check');
        }
    });
    jQuery(".addon-products").on('ifChecked', '.panel-addon input', function(event) {
        var $activeAddon = jQuery(this).parents('.panel-addon');
        $activeAddon.addClass('panel-addon-selected');
        $activeAddon.find('input[type="checkbox"]').iCheck('check');
        $activeAddon.find('.panel-add').html('<i class="fas fa-shopping-cart"></i> '+localTrans('addedToCartRemove', 'Added to Cart (Remove)'));
        recalctotals();
    });
    jQuery(".addon-products").on('ifUnchecked', '.panel-addon input', function(event) {
        var $activeAddon = jQuery(this).parents('.panel-addon');
        $activeAddon.removeClass('panel-addon-selected');
        $activeAddon.find('input[type="checkbox"]').iCheck('uncheck');
        $activeAddon.find('.panel-add').html('<i class="fas fa-plus"></i> '+localTrans('addToCart', 'Add to Cart'));
        recalctotals();
    });

    jQuery("#frmConfigureProduct").on('ifChecked', '.addon-selector', function(event) {
        recalctotals();
    });

    if (jQuery(".domain-selection-options input:checked").length == 0) {
        var firstInput = jQuery(".domain-selection-options input:first");

        jQuery(firstInput).iCheck('check');
        jQuery(firstInput).parents('.option').addClass('option-selected');
    }
    jQuery("#domain" + jQuery(".domain-selection-options input:checked").val()).show();
    jQuery(".domain-selection-options input").on('ifChecked', function(event){
        jQuery(".domain-selection-options .option").removeClass('option-selected');
        jQuery(this).parents('.option').addClass('option-selected');
        jQuery(".domain-input-group").hide();
        jQuery("#domain" + jQuery(this).val()).show();
    });

    jQuery('#frmProductDomain').submit(function (e) {
        e.preventDefault();

        var btnSearchObj = jQuery(this).find('button[type="submit"]'),
            domainSearchResults = jQuery("#DomainSearchResults"),
            spotlightTlds = jQuery('#spotlightTlds'),
            suggestions = jQuery('#domainSuggestions'),
            btnDomainContinue = jQuery('#btnDomainContinue'),
            domainoption = jQuery(".domain-selection-options input:checked").val(),
            sldInput = jQuery("#" + domainoption + "sld"),
            sld = sldInput.val(),
            tld = '',
            pid = jQuery('#frmProductDomainPid').val(),
            tldInput = '',
            idnLanguage = jQuery('#idnLanguageSelector');

        jQuery('.field-error-msg').hide();

        if (idnLanguage.is(':visible')) {
            idnLanguage.slideUp();
            idnLanguage.find('select').val('');
        }

        if (domainoption == 'incart') {
            sldInput = jQuery("#" + domainoption + "sld option:selected");
            sld = sldInput.text();
        } else if (domainoption == 'subdomain') {
            tldInput = jQuery("#" + domainoption + "tld option:selected");
            tld = tldInput.text();
        } else {
            tldInput = jQuery("#" + domainoption + "tld");
            tld = tldInput.val();
            if (sld && !tld) {
                tldInput.tooltip('show');
                tldInput.focus();
                return false;
            }
            if (tld.substr(0, 1) != '.') {
                tld = '.' + tld;
            }
        }
        if (!sld) {
            sldInput.tooltip('show');
            sldInput.focus();
            return false;
        }

        sldInput.tooltip('hide');
        if (tldInput.length) {
            tldInput.tooltip('hide');
        }

        jQuery('input[name="domainoption"]').iCheck('disable');
        domainLookupCallCount = 0;
        btnSearchObj.attr('disabled', 'disabled').addClass('disabled');

        jQuery('.domain-lookup-result').hide();
        jQuery('#primaryLookupResult div').filter(function() {
            return $(this).closest('#idnLanguageSelector').length === 0;
        }).hide();
        jQuery('#primaryLookupResult').find('.register-price-label').show().end()
            .find('.transfer-price-label').hide();

        jQuery('.domain-lookup-register-loader').hide();
        jQuery('.domain-lookup-transfer-loader').hide();
        jQuery('.domain-lookup-other-loader').hide();
        if (domainoption == 'register') {
            jQuery('.domain-lookup-register-loader').show();
        } else if (domainoption == 'transfer') {
            jQuery('.domain-lookup-transfer-loader').show();
        } else {
            jQuery('.domain-lookup-other-loader').show();
        }

        jQuery('.domain-lookup-loader').show();
        suggestions.find('div:not(.actions)').hide().end()
            .find('.clone').remove();
        jQuery('div.panel-footer.more-suggestions').hide()
            .find('a').show().end()
            .find('span.no-more').hide();
        jQuery('.btn-add-to-cart').removeAttr('disabled')
            .find('span').hide().end()
            .find('span.to-add').show();
        btnDomainContinue.hide().attr('disabled', 'disabled');

        if (domainoption != 'register') {
            spotlightTlds.hide();
            jQuery('.suggested-domains').hide();
        }

        if (!domainSearchResults.is(":visible")) {
            domainSearchResults.fadeIn();
        }

        if (domainoption == 'register') {
            spotlightTlds.fadeIn('fast');
            jQuery('#resultDomainOption').val(domainoption);
            var lookup = WHMCS.http.jqClient.post(
                    WHMCS.utils.getRouteUrl('/domain/check'),
                    {
                        token: csrfToken,
                        type: 'domain',
                        domain: sld + tld,
                        sld: sld,
                        tld: tld,
                        source: 'cartAddDomain'
                    },
                    'json'
                ),
                spotlight = WHMCS.http.jqClient.post(
                    WHMCS.utils.getRouteUrl('/domain/check'),
                    {
                        token: csrfToken,
                        type: 'spotlight',
                        domain: sld + tld,
                        sld: sld,
                        tld: tld,
                        source: 'cartAddDomain'
                    },
                    'json'
                ),
                suggestion = WHMCS.http.jqClient.post(
                    WHMCS.utils.getRouteUrl('/domain/check'),
                    {
                        token: csrfToken,
                        type: 'suggestions',
                        domain: sld + tld,
                        sld: sld,
                        tld: tld,
                        source: 'cartAddDomain'
                    },
                    'json'
                );

            // primary lookup handler
            lookup.done(function (data) {
                jQuery.each(data.result, function(index, domain) {
                    var pricing = null,
                        result = jQuery('#primaryLookupResult'),
                        available = result.find('.domain-available'),
                        availablePrice = result.find('.domain-price'),
                        unavailable = result.find('.domain-unavailable'),
                        invalid= result.find('.domain-invalid'),
                        contactSupport = result.find('.domain-contact-support'),
                        resultDomain = jQuery('#resultDomain'),
                        resultDomainPricing = jQuery('#resultDomainPricingTerm'),
                        error = result.find('.domain-error');
                    result.show();
                    jQuery('.domain-lookup-primary-loader').hide();
                    if (typeof domain !== 'string' && !domain.error && domain.isValidDomain) {
                        error.hide();
                        pricing = domain.pricing;
                        if (domain.isAvailable && typeof pricing !== 'string') {
                            if (domain.domainName !== domain.idnDomainName && idnLanguage.not(':visible')) {
                                idnLanguage.slideDown();
                            }
                            if (domain.preferredTLDNotAvailable) {
                                unavailable.show().find('strong').html(domain.originalUnavailableDomain);
                            }
                            contactSupport.hide();
                            available.show().find('strong').html(domain.domainName);
                            availablePrice.show().find('span.price').html(pricing[Object.keys(pricing)[0]].register).end()
                                .find('button').attr('data-domain', domain.domainName);
                            resultDomain.val(domain.domainName);
                            resultDomainPricing.val(Object.keys(pricing)[0]).attr('name', 'domainsregperiod[' + domain.domainName +']');

                            btnDomainContinue.removeAttr('disabled');
                        } else {
                            unavailable.show().find('strong').html(domain.domainName);
                            contactSupport.hide();
                            if (typeof pricing === 'string' && pricing == 'ContactUs') {
                                contactSupport.show();
                            }
                        }
                    } else {
                        var done = false,
                            reg = /<br\s*\/>/,
                            errors = [];
                        if (!domain.isValidDomain && domain.domainErrorMessage) {
                            invalid.text(domain.domainErrorMessage);
                        } else if (domain.error || index === 'error') {
                            if (typeof domain === 'string') {
                                error.text(domain);
                            } else if (!domain.error.match(reg)) {
                                error.text(domain.error);
                            } else {
                                error.text('');
                                errors = domain.error.split(reg);
                                for(var i=0; i < errors.length; i++) {
                                    var errorMsg = errors[i];
                                    if (errorMsg.length) {
                                        if (error.text()) {
                                            // only add line break if there is
                                            // multiple lines of text
                                            error.append('<br />');
                                        }
                                        error.append(jQuery('<span></span>').text(errorMsg));
                                    }
                                }
                            }
                            error.show();
                            done = true;
                        }
                        if (!done) {
                            invalid.show();
                        }
                    }
                });
            }).always(function() {
                hasProductDomainLookupEnded(3, btnSearchObj);
            });

            // spotlight lookup handler
            spotlight.done(function(data) {
                if (typeof data != 'object' || data.result.length == 0 || data.result.error) {
                    jQuery('.domain-lookup-spotlight-loader').hide();
                    return;
                }
                jQuery.each(data.result, function(index, domain) {
                    var tld = domain.tldNoDots,
                        pricing = domain.pricing,
                        result = jQuery('#spotlight' + tld + ' .domain-lookup-result');
                    jQuery('.domain-lookup-spotlight-loader').hide();
                    result.find('button').hide();
                    if (domain.isValidDomain) {
                        if (domain.isAvailable && typeof pricing !== 'string') {
                            if (domain.domainName !== domain.idnDomainName && idnLanguage.not(':visible')) {
                                idnLanguage.slideDown();
                            }
                            result
                                .find('span.available').html(pricing[Object.keys(pricing)[0]].register).show().end()
                                .find('button.btn-add-to-cart')
                                .attr('data-domain', domain.domainName)
                                .show();

                            result.find('button.domain-contact-support').hide();
                        } else {
                            if (typeof pricing === 'string') {
                                if (pricing == '') {
                                    result.find('button.unavailable').show();
                                } else {
                                    result.find('button.domain-contact-support').show();
                                }
                                result.find('span.available').hide();
                            } else {
                                result.find('button.unavailable').show();
                                result.find('span.available').hide();
                            }
                        }
                    } else {
                        result.find('button.invalid:hidden').show().end()
                            .find('span.available').hide().end()
                            .find('button').not('button.invalid').hide();
                    }
                    result.show();
                });
            }).always(function() {
                hasProductDomainLookupEnded(3, btnSearchObj);
            });

            // suggestions lookup handler
            suggestion.done(function (data) {
                if (typeof data != 'object' || data.result.length == 0 || data.result.error) {
                    jQuery('.suggested-domains').fadeOut('fast', function() {
                        jQuery(this).hide();
                    });
                    return;
                } else {
                    jQuery('.suggested-domains').show();
                }
                var suggestionCount = 1;
                jQuery.each(data.result, function(index, domain) {
                    var tld = domain.tld,
                        pricing = domain.pricing;
                    suggestions.find('div:first').clone(true, true).appendTo(suggestions);
                    var newSuggestion = suggestions.find('div.domain-suggestion').last();
                    newSuggestion.addClass('clone')
                        .find('span.domain').html(domain.sld).end()
                        .find('span.extension').html('.' + tld);
                    if (domain.domainName !== domain.idnDomainName && idnLanguage.not(':visible')) {
                        idnLanguage.slideDown();
                    }
                    if (typeof pricing === 'string') {
                        newSuggestion.find('button.btn-add-to-cart').remove();
                        if (pricing != '') {
                            newSuggestion.find('button.domain-contact-support').show().end()
                                .find('span.price').hide();
                        } else {
                            newSuggestion.remove();
                        }
                    } else {
                        newSuggestion.find('button.btn-add-to-cart').attr('data-domain', domain.domainName).end()
                            .find('span.price').html(pricing[Object.keys(pricing)[0]].register);
                    }

                    if (suggestionCount <= 10) {
                        newSuggestion.show();
                    }
                    suggestionCount++;
                    if (domain.group) {
                        newSuggestion.find('span.promo')
                            .addClass(domain.group)
                            .html(domain.group.toUpperCase())
                            .show();
                    }
                    furtherSuggestions = suggestions.find('div.domain-suggestion.clone').not(':visible').length;
                    if (furtherSuggestions > 0) {
                        jQuery('div.more-suggestions').show();
                    }
                });
                jQuery('.domain-lookup-suggestions-loader').hide();
                jQuery('#domainSuggestions').show();
            }).always(function() {
                hasProductDomainLookupEnded(3, btnSearchObj);
            });
        } else if (domainoption == 'transfer') {
            jQuery('#resultDomainOption').val(domainoption);
            var transfer = WHMCS.http.jqClient.post(
                WHMCS.utils.getRouteUrl('/domain/check'),
                {
                    token: csrfToken,
                    type: 'transfer',
                    domain: sld + tld,
                    sld: sld,
                    tld: tld,
                    source: 'cartAddDomain'
                },
                'json'
            );

            transfer.done(function (data) {
                if (typeof data != 'object' || data.result.length == 0) {
                    jQuery('.domain-lookup-primary-loader').hide();
                    return;
                }
                var result = jQuery('#primaryLookupResult'),
                    transfereligible = result.find('.transfer-eligible'),
                    transferPrice = result.find('.domain-price'),
                    transfernoteligible = result.find('.transfer-not-eligible'),
                    resultDomain = jQuery('#resultDomain'),
                    resultDomainPricing = jQuery('#resultDomainPricingTerm');
                if (Object.keys(data.result).length === 0) {
                    jQuery('.domain-lookup-primary-loader').hide();
                    result.show();
                    transfernoteligible.show();
                }
                jQuery.each(data.result, function(index, domain) {
                    var pricing = domain.pricing;
                    jQuery('.domain-lookup-primary-loader').hide();
                    result.show();
                    if (domain.isRegistered) {
                        transfereligible.show();
                        transferPrice.show().find('.register-price-label').hide().end()
                            .find('.transfer-price-label').show().end()
                            .find('span.price').html(pricing[Object.keys(pricing)[0]].transfer).end()
                            .find('button').attr('data-domain', domain.domainName);
                        resultDomain.val(domain.domainName);
                        resultDomainPricing.val(Object.keys(pricing)[0]).attr('name', 'domainsregperiod[' + domain.domainName +']');
                        btnDomainContinue.removeAttr('disabled');
                    } else {
                        transfernoteligible.show();
                    }
                });
            }).always(function() {
                hasProductDomainLookupEnded(1, btnSearchObj);
            });
        } else if (domainoption == 'owndomain' || domainoption == 'subdomain' || domainoption == 'incart') {

            var otherDomain = WHMCS.http.jqClient.post(
                WHMCS.utils.getRouteUrl('/domain/check'),
                {
                    token: csrfToken,
                    type: domainoption,
                    pid: pid,
                    domain: sld + tld,
                    sld: sld,
                    tld: tld,
                    source: 'cartAddDomain'
                },
                'json'
            );

            otherDomain.done(function(data) {
                if (typeof data != 'object' || data.result.length == 0) {
                    jQuery('.domain-lookup-subdomain-loader').hide();
                    return;
                }
                jQuery.each(data.result, function(index, result) {
                    if (result.status === true) {
                        displayRecommendations(
                            whmcsBaseUrl + '/cart.php',
                            'addproductajax=1&a=confproduct&i=' + result.num,
                            false
                        ).done(function() {
                            window.location = whmcsBaseUrl + '/cart.php?a=confproduct&i=' + result.num;
                        });
                    } else {
                        jQuery('.domain-lookup-primary-loader').hide();
                        if (typeof result === 'string') {
                            jQuery('#primaryLookupResult').show().find('.domain-error')
                                .text(result)
                                .show();
                        } else {
                            jQuery('#primaryLookupResult').show().find('.domain-invalid').show();
                        }
                    }
                });

            }).always(function(){
                hasProductDomainLookupEnded(1, btnSearchObj);
            });
        }

        btnDomainContinue.show();
    });

    jQuery('#frmProductDomainSelections').on('submit', function(e) {
        var idnLanguage = jQuery('#idnLanguageSelector'),
            idnLanguageInput = idnLanguage.find('select'),
            form = jQuery(this);

        if (idnLanguage.is(':visible') && !idnLanguageInput.val()) {
            e.preventDefault();
            idnLanguageInput.showInputError();
            return false;
        }

        e.preventDefault();
        displayRecommendations(
            form.attr('action'),
            'addproductajax=1&' + form.serialize(),
            false
        ).done(function() {
            form.unbind().submit();
            form.submit();
        });
    });

    jQuery("#btnAlreadyRegistered").click(function() {
        jQuery("#containerNewUserSignup").slideUp('', function() {
            jQuery("#containerExistingUserSignin").slideDown('', function() {
                jQuery("#inputCustType").val('existing');
                jQuery("#btnAlreadyRegistered").fadeOut('', function() {
                    jQuery("#btnNewUserSignup").fadeIn();
                });
            });
        });
        jQuery("#containerNewUserSecurity").hide();
        if (jQuery("#stateselect").attr('required')) {
            jQuery("#stateselect").removeAttr('required').addClass('requiredAttributeRemoved');
        }
        jQuery('.marketing-email-optin').slideUp();
    });

    jQuery("#btnNewUserSignup").click(function() {
        jQuery("#containerExistingUserSignin").slideUp('', function() {
            jQuery("#containerNewUserSignup").slideDown('', function() {
                jQuery("#inputCustType").val('new');
                if (jQuery("#passwdFeedback").html().length == 0) {
                    jQuery("#containerNewUserSecurity").show();
                }
                jQuery("#btnNewUserSignup").fadeOut('', function() {
                    jQuery("#btnAlreadyRegistered").fadeIn();
                });
            });
            jQuery('.marketing-email-optin').slideDown();
        });
        if (jQuery("#stateselect").hasClass('requiredAttributeRemoved')) {
            jQuery("#stateselect").attr('required', 'required').removeClass('requiredAttributeRemoved');
        }
    });

    jQuery("#btnExistingLogin").click(function() {
        var inputLoginEmail = jQuery('#inputLoginEmail').val(),
            inputLoginPassword = jQuery('#inputLoginPassword').val(),
            existingLoginMessage = jQuery('#existingLoginMessage'),
            btnExistingLogin = jQuery('#btnExistingLogin');

        btnExistingLogin.prop('disabled', true)
            .addClass('disabled')
            .find('span').toggle();

        WHMCS.http.jqClient.jsonPost({
            url: WHMCS.utils.getRouteUrl('/login/cart'),
            data: {
                username: inputLoginEmail,
                password: inputLoginPassword,
                token: csrfToken
            },
            success: function (data) {
                if (!data.redirectUrl) {
                    location.reload(true);
                } else {
                    window.location.href = data.redirectUrl;
                }
            },
            error: function (error) {
                if (error) {
                    existingLoginMessage.slideUp('fast')
                        .toggle()
                        .html(error)
                        .slideDown('fast');
                    btnExistingLogin.prop('disabled', false)
                        .removeClass('disabled')
                        .find('span').toggle();
                }
            }
        });
    });

    jQuery('.account-select').on('ifChecked', function(event) {
        var userSignupContainer = jQuery('#containerNewUserSignup'),
            stateSelect = jQuery("#stateselect"),
            thisValue = jQuery(this).val(),
            btnCompleteOrder = jQuery('#btnCompleteOrder'),
            existingPayMethods = jQuery('#existingCardsContainer'),
            existingUserEmail = jQuery('#inputEmail');

        if (existingPayMethods.length) {
            existingPayMethods.html('');
        }

        if (existingUserEmail.length) {
            existingUserEmail.attr('value', '');
        }
        jQuery('#containerExistingAccountSelect')
            .find('div.account.active')
            .removeClass('active');
        jQuery(this).closest('div.account').addClass('active');
        if (thisValue === 'new') {
            if (userSignupContainer.not(':visible')) {
                userSignupContainer.slideDown('', function () {
                    jQuery("#inputCustType").val('add');
                    jQuery('.marketing-email-optin').slideDown();
                });
                if (stateSelect.hasClass('requiredAttributeRemoved')) {
                    stateSelect.attr('required', 'required')
                        .removeClass('requiredAttributeRemoved');
                }
            }
        } else {
            btnCompleteOrder.addClass('disabled');

            if (btnCompleteOrder.hasClass('spinner-on-click')) {
                var icon = btnCompleteOrder.find('i.fas,i.far,i.fal,i.fab');

                jQuery(icon)
                    .data('original-class', icon.attr('class'))
                    .removeAttr('class')
                    .addClass('fas fa-spinner fa-spin');
            }

            jQuery("#inputCustType").val('account');
            if (userSignupContainer.is(':visible')) {
                userSignupContainer.slideUp();
                if (stateSelect.attr('required')) {
                    stateSelect.removeAttr('required')
                        .addClass('requiredAttributeRemoved');
                }
                jQuery('.marketing-email-optin').slideUp();
            }
        }
        WHMCS.http.jqClient.jsonPost({
            url: WHMCS.utils.getRouteUrl('/cart/account/select'),
            data: {
                account_id: thisValue,
                token: csrfToken
            },
            success: function(data) {
                var creditDiv = jQuery('#applyCreditContainer');
                jQuery('#totalCartPrice').text(data.total);
                creditDiv.find('p').first().text(data.availableCreditBalance);
                if (!data.canUseCreditOnCheckout && creditDiv.is(':visible')) {
                    var skipCreditOnCheckout = jQuery('#skipCreditOnCheckout');
                    creditDiv.hide();
                    skipCreditOnCheckout.prop('checked', true);
                } else if (data.canUseCreditOnCheckout) {
                    var useCreditOnCheckout = jQuery('#useCreditOnCheckout'),
                        spanFullCredit = jQuery('#spanFullCredit'),
                        spanUseCredit = jQuery('#spanUseCredit');
                    if (data.full) {
                        hideCvcOnCheckoutForExistingCard = '1';
                        spanFullCredit.show().find('span').text(data.total);
                        if (spanUseCredit.is(':visible')) {
                            spanUseCredit.slideUp();
                        }
                    } else {
                        hideCvcOnCheckoutForExistingCard = '0';
                        spanUseCredit.show().find('span').text(data.creditBalance);
                        if (spanFullCredit.is(':visible')) {
                            spanFullCredit.slideUp();
                        }
                    }
                    useCreditOnCheckout.iCheck('check');
                    if (creditDiv.not(':visible')) {
                        creditDiv.slideDown();
                    }
                }
                if (existingPayMethods.length) {
                    existingPayMethods.html(data.existingCards);
                    existingPayMethods.find('input[type="radio"]').iCheck({
                        inheritID: true,
                        checkboxClass: 'icheckbox_square-blue',
                        radioClass: 'iradio_square-blue',
                        increaseArea: '20%'
                    });
                    jQuery(".payment-methods:checked").trigger('ifChecked');
                    selectPreferredCard();
                }
            },
            always: function() {
                btnCompleteOrder.removeClass('disabled');
                if (btnCompleteOrder.hasClass('spinner-on-click')) {
                    var icon = btnCompleteOrder.find('i.fas,i.far,i.fal,i.fab');

                    if (jQuery(icon).hasClass('fa-spinner')) {
                        jQuery(icon)
                            .removeAttr('class')
                            .addClass(icon.data('original-class'));
                    }
                }
            }
        });
    });

    var cvvFieldContainer = jQuery('#cvv-field-container'),
        existingCardContainer = jQuery('#existingCardsContainer'),
        newCardInfo = jQuery('#newCardInfo'),
        newCardSaveSettings = jQuery('#newCardSaveSettings'),
        inputNoStoreContainer = jQuery('#inputNoStoreContainer'),
        existingCardInfo = jQuery('#existingCardInfo'),
        newCardOption = jQuery('#new'),
        creditCardInputFields = jQuery('#creditCardInputFields');

    jQuery(document).on('ifChecked', '.existing-card', function(event) {
        newCardSaveSettings.slideUp().find('input').attr('disabled', 'disabled');
        if (jQuery('.payment-methods:checked').data('remote-inputs') === 1) {
            return;
        }

        newCardInfo.slideUp().find('input').attr('disabled', 'disabled');
        if (hideCvcOnCheckoutForExistingCard !== '1') {
            existingCardInfo.slideDown().find('input').removeAttr('disabled');
        } else {
            existingCardInfo.slideUp().find('input').attr('disabled', 'disabled');
        }
    });
    newCardOption.on('ifChecked', function(event) {
        newCardSaveSettings.slideDown().find('input').removeAttr('disabled');
        if (jQuery('.payment-methods:checked').data('remote-inputs') === 1) {
            return;
        }

        newCardInfo.slideDown().find('input').removeAttr('disabled');
        existingCardInfo.slideUp().find('input').attr('disabled', 'disabled');
    });

    jQuery(".payment-methods").on('ifChecked', function(event) {
        var existingCards = jQuery(document).find('.existing-card');

        if (!existingCards.length) {
            existingCardInfo.slideUp().find('input').attr('disabled', 'disabled');
        }

        if (jQuery(this).hasClass('is-credit-card')) {
            var gatewayPaymentType = jQuery(this).data('payment-type'),
                gatewayModule = jQuery(this).val(),
                showLocal = jQuery(this).data('show-local'),
                relevantMethods = [];
            if (gatewayPaymentType === 'RemoteCreditCard') {
                inputNoStoreContainer.hide().find('input').prop('disabled', 'disabled');
            } else {
                if (inputNoStoreContainer.not(':visible')) {
                    inputNoStoreContainer.slideDown().find('input').removeProp('disabled');
                }
            }

            existingCards.each(function(index) {
                var paymentType = jQuery(this).data('payment-type'),
                    paymentModule = jQuery(this).data('payment-gateway'),
                    payMethodId = jQuery(this).val();

                var paymentTypeMatch = (paymentType === gatewayPaymentType);

                var paymentModuleMatch = false;
                if (gatewayPaymentType === 'RemoteCreditCard') {
                    // only show remote credit cards that belong to the selected gateway
                    paymentModuleMatch = (paymentModule === gatewayModule);
                } else if (gatewayPaymentType === 'CreditCard') {
                    // any local credit card can be used with any credit card gateway
                    paymentModuleMatch = true;
                }

                if (showLocal && paymentType === 'CreditCard') {
                    paymentTypeMatch = true;
                    paymentModuleMatch = true;
                }

                var payMethodElements = jQuery('[data-paymethod-id="' + payMethodId + '"]');

                if (paymentTypeMatch && paymentModuleMatch) {
                    jQuery(payMethodElements).show();
                    relevantMethods.push(this);
                } else {
                    jQuery(payMethodElements).hide();
                }
            });

            var enabledRelevantMethods = relevantMethods.filter(function (item) {
                return ! jQuery(item).attr('disabled');
            });

            if (enabledRelevantMethods.length > 0) {
                var defaultId = null;
                jQuery.each(enabledRelevantMethods, function(index, value) {
                    var jQueryElement = jQuery(value),
                        order = parseInt(jQueryElement.data('order-preference'), 10);
                    if ((defaultId === null) || (order < defaultId)) {
                        defaultId = jQueryElement.val();
                        if (order === 0) {
                            return false;
                        }
                    }
                });
                if (defaultId === null) {
                    defaultId = 'new';
                }

                jQuery.each(enabledRelevantMethods, function(index, value) {
                    var jQueryElement = jQuery(value);
                    if (jQueryElement.val() === defaultId) {
                        jQueryElement.iCheck('check');
                        return false;
                    }
                });

                existingCardContainer.show();
                if (hideCvcOnCheckoutForExistingCard !== '1') {
                    existingCardInfo.show().find('input').removeAttr('disabled');
                } else {
                    existingCardInfo.hide().find('input').attr('disabled', 'disabled');
                }
            } else {
                jQuery(newCardOption).iCheck('check');
                existingCardContainer.hide();
                existingCardInfo.hide().find('input').attr('disabled', 'disabled');
            }

            if (!creditCardInputFields.is(":visible")) {
                creditCardInputFields.slideDown();
            }
        } else {
            creditCardInputFields.slideUp();
        }
    });

    jQuery('.cc-input-container .paymethod-info').click(function() {
        var payMethodId = $(this).data('paymethod-id');
        var input = jQuery('input[name="ccinfo"][value=' + payMethodId + ']:not(:disabled)');

        if (input.length > 0) {
            input.iCheck('check');
        }
    });

    jQuery("#inputDomainContact").on('change', function() {
        var thisInput = jQuery(this);
        if (this.value === "addingnew") {
            thisInput.closest('div').addClass('pb-2');
            jQuery("#domainRegistrantInputFields").parent('div').slideDown();
        } else {
            jQuery("#domainRegistrantInputFields").parent('div').slideUp(function () {
                thisInput.closest('div').removeClass('pb-2');
            });
        }
    });

    if (typeof registerFormPasswordStrengthFeedback == 'function') {
        jQuery("#inputNewPassword1").keyup(registerFormPasswordStrengthFeedback);
    } else {
        jQuery("#inputNewPassword1").keyup(function ()
        {
            passwordStrength = getPasswordStrength(jQuery(this).val());
            if (passwordStrength >= 75) {
                textLabel = langPasswordStrong;
                cssClass = 'success';
            } else
                if (passwordStrength >= 30) {
                    textLabel = langPasswordModerate;
                    cssClass = 'warning';
                } else {
                    textLabel = langPasswordWeak;
                    cssClass = 'danger';
                }
            jQuery("#passwordStrengthTextLabel").html(langPasswordStrength + ': ' + passwordStrength + '% ' + textLabel);
            jQuery("#passwordStrengthMeterBar").css(
                'width',
                passwordStrength + '%'
            ).attr('aria-valuenow', passwordStrength);
            jQuery("#passwordStrengthMeterBar").removeClass(
                'progress-bar-success progress-bar-warning progress-bar-danger').addClass(
                'progress-bar-' + cssClass);
        });
    }

    jQuery('#inputDomain').on('shown.bs.tooltip', function () {
        setTimeout(function(input) {
            input.tooltip('hide');
        },
            5000,
            jQuery(this)
        );
    });

    jQuery('#frmDomainChecker').submit(function (e) {
        e.preventDefault();

        if (
            typeof recaptchaValidationComplete !== 'undefined'
            && typeof recaptchaType !== 'undefined'
            && recaptchaType === 'invisible'
            && recaptchaValidationComplete === false
        ) {
            return;
        }

        var frmDomain = jQuery('#frmDomainChecker'),
            inputDomain = jQuery('#inputDomain'),
            suggestions = jQuery('#domainSuggestions'),
            reCaptchaContainer = jQuery('#divDynamicRecaptcha'),
            captcha = jQuery('#inputCaptcha'),
            idnLanguage = jQuery('#idnLanguageSelector');

        jQuery('.field-error-msg').hide();

        if (idnLanguage.is(':visible')) {
            idnLanguage.slideUp();
            idnLanguage.find('select').val('');
        }

        domainLookupCallCount = 0;

        // check a domain has been entered
        if (!inputDomain.val()) {
            inputDomain.tooltip('show');
            inputDomain.focus();
            return;
        }

        inputDomain.tooltip('hide');

        if (jQuery('#captchaContainer').length) {
            validate_captcha(frmDomain);
            return;
        }

        reCaptchaContainer.tooltip('hide');
        captcha.tooltip('hide');

        // disable repeat submit and show loader
        jQuery('#btnCheckAvailability').attr('disabled', 'disabled').addClass('disabled');
        jQuery('.domain-lookup-result').hide();
        jQuery('.domain-lookup-loader').show();

        // reset elements
        suggestions.find('div:not(.actions)').hide();
        suggestions.find('.clone').remove();
        jQuery('div.panel-footer.more-suggestions').hide()
            .find('a').show().end()
            .find('span.no-more').hide();
        jQuery('.btn-add-to-cart').removeAttr('disabled')
            .find('span').hide().end()
            .find('span.to-add').show();

        // fade in results
        if (jQuery('#DomainSearchResults').not(":visible")) {
            jQuery('.domain-pricing').fadeOut('fast', function() {
                jQuery('#DomainSearchResults').fadeIn();
            });

        }

        var lookup = WHMCS.http.jqClient.post(
                WHMCS.utils.getRouteUrl('/domain/check'),
                frmDomain.serialize() + '&type=domain',
                'json'
            ),
            spotlight = WHMCS.http.jqClient.post(
                WHMCS.utils.getRouteUrl('/domain/check'),
                frmDomain.serialize() + '&type=spotlight',
                'json'
            ),
            suggestion = WHMCS.http.jqClient.post(
                WHMCS.utils.getRouteUrl('/domain/check'),
                frmDomain.serialize() + '&type=suggestions',
                'json'
            );

        // primary lookup handler
        lookup.done(function (data) {
            if (typeof data != 'object' || data.result.length == 0) {
                jQuery('.domain-lookup-primary-loader').hide();
                return;
            }
            jQuery.each(data.result, function(index, domain) {
                var pricing = null,
                    result = jQuery('#primaryLookupResult'),
                    available = result.find('.domain-available'),
                    availablePrice = result.find('.domain-price'),
                    contactSupport = result.find('.domain-contact-support'),
                    unavailable = result.find('.domain-unavailable'),
                    invalid = result.find('.domain-invalid'),
                    error = result.find('.domain-error');
                jQuery('.domain-lookup-primary-loader').hide();
                result.find('.btn-add-to-cart').removeClass('checkout');
                result.show();
                if (typeof domain !== 'string' && !domain.error && domain.isValidDomain) {
                    pricing = domain.pricing;
                    unavailable.hide();
                    contactSupport.hide();
                    invalid.hide();
                    error.hide();
                    if (domain.isAvailable && typeof pricing !== 'string') {
                        if (domain.domainName !== domain.idnDomainName && idnLanguage.not(':visible')) {
                            idnLanguage.slideDown();
                        }
                        if (domain.preferredTLDNotAvailable) {
                            unavailable.show().find('strong').html(domain.originalUnavailableDomain);
                        }
                        available.show().find('strong').html(domain.domainName);
                        availablePrice.show().find('span.price').html(pricing[Object.keys(pricing)[0]].register).end()
                            .find('button').attr('data-domain', domain.domainName);
                    } else {
                        available.hide();
                        availablePrice.hide();
                        contactSupport.hide();
                        unavailable.show().find('strong').html(domain.domainName);
                        if (typeof pricing === 'string' && pricing == 'ContactUs') {
                            contactSupport.show();
                        }
                    }
                } else {
                    available.hide();
                    availablePrice.hide();
                    unavailable.hide();
                    contactSupport.hide();
                    invalid.hide();
                    error.hide();
                    var done = false,
                        reg = /<br\s*\/>/,
                        errors = [];
                    if (!domain.isValidDomain && domain.domainErrorMessage) {
                        invalid.text(domain.domainErrorMessage);
                    } else if (domain.error || index === 'error') {
                        if (typeof domain === 'string') {
                            error.text(domain);
                        } else if (!domain.error.match(reg)) {
                            error.text(domain.error);
                        } else {
                            error.text('');
                            errors = domain.error.split(reg);
                            for(var i=0; i < errors.length; i++) {
                                var errorMsg = errors[i];
                                if (errorMsg.length) {
                                    if (error.text()) {
                                        // only add line break if there is
                                        // multiple lines of text
                                        error.append('<br />');
                                    }
                                    error.append(jQuery('<span></span>').text(errorMsg));
                                }
                            }
                        }
                        error.show();
                        done = true;
                    }
                    if (!done) {
                        invalid.show();
                    }
                }

            });
        }).always(function() {
            hasDomainLookupEnded();
        });

        // spotlight lookup handler
        spotlight.done(function(data) {
            if (typeof data != 'object' || data.result.length == 0 || data.result.error) {
                jQuery('.domain-lookup-spotlight-loader').hide();
                return;
            }
            jQuery.each(data.result, function(index, domain) {
                var tld = domain.tldNoDots,
                    pricing = domain.pricing,
                    result = jQuery('#spotlight' + tld + ' .domain-lookup-result');
                jQuery('.domain-lookup-spotlight-loader').hide();
                result.find('button').hide();
                if (domain.isValidDomain) {
                    if (domain.isAvailable && typeof pricing !== 'string') {
                        if (domain.domainName !== domain.idnDomainName && idnLanguage.not(':visible')) {
                            idnLanguage.slideDown();
                        }
                        result.find('button.unavailable').hide().end()
                            .find('button.invalid').hide().end()
                            .find('span.available').html(pricing[Object.keys(pricing)[0]].register).show().end()
                            .find('button').not('button.unavailable').not('button.invalid')
                            .attr('data-domain', domain.domainName)
                            .show();

                        result.find('button.domain-contact-support').hide();
                    } else {
                        if (typeof pricing === 'string') {
                            if (pricing == '') {
                                result.find('button.unavailable').show();
                            } else {
                                result.find('button.domain-contact-support').show();
                            }
                            result.find('button.invalid').hide();
                            result.find('span.available').hide();
                        } else {
                            result.find('button.invalid').hide().end()
                                .find('button.unavailable').show().end()
                                .find('span.available').hide();
                        }
                    }
                } else {
                    result.find('button.invalid:hidden').show().end()
                        .find('span.available').hide().end()
                        .find('button').not('button.invalid').hide();
                }
                result.show();
            });
        }).always(function() {
            hasDomainLookupEnded();
        });

        // suggestions lookup handler
        suggestion.done(function (data) {
            if (typeof data != 'object' || data.result.length == 0 || data.result.error) {
                jQuery('.suggested-domains').fadeOut('fast', function() {
                    jQuery(this).hide();
                });
                return;
            } else {
                jQuery('.suggested-domains').show();
            }
            var suggestionCount = 1;
            jQuery.each(data.result, function(index, domain) {
                var tld = domain.tld,
                    pricing = domain.pricing;
                suggestions.find('div:first').clone(true, true).appendTo(suggestions);
                var newSuggestion = suggestions.find('div.domain-suggestion').last();
                newSuggestion.addClass('clone')
                    .find('span.domain').html(domain.sld).end()
                    .find('span.extension').html('.' + tld);

                if (typeof pricing === 'string') {
                    newSuggestion.find('button.btn-add-to-cart').remove();
                    if (pricing != '') {
                        newSuggestion.find('button.domain-contact-support').show().end()
                            .find('span.price').hide();
                    } else {
                        newSuggestion.remove();
                    }
                } else {
                    if (domain.domainName !== domain.idnDomainName && idnLanguage.not(':visible')) {
                        idnLanguage.slideDown();
                    }
                    newSuggestion.find('button.btn-add-to-cart').attr('data-domain', domain.domainName).end()
                        .find('span.price').html(pricing[Object.keys(pricing)[0]].register);
                }
                if (suggestionCount <= 10) {
                    newSuggestion.show();
                }
                suggestionCount++;
                if (domain.group) {
                    newSuggestion.find('span.promo')
                        .addClass(domain.group)
                        .show();
                    newSuggestion.find('span.sales-group-' + domain.group)
                        .show();
                }
                furtherSuggestions = suggestions.find('div.domain-suggestion.clone:hidden').length;
                if (furtherSuggestions > 0) {
                    jQuery('div.more-suggestions').show();
                }
            });
            jQuery('.domain-lookup-suggestions-loader').hide();
            jQuery('#domainSuggestions').show();
        }).always(function() {
            hasDomainLookupEnded();
        });
    });

    jQuery('.btn-add-to-cart').on('click', function() {
        if (jQuery(this).hasClass('checkout')) {
            window.location = whmcsBaseUrl + '/cart.php?a=confdomains';
            return;
        }
        var domain = jQuery(this).attr('data-domain'),
            buttons = jQuery('button[data-domain="' + domain + '"]'),
            whois = jQuery(this).attr('data-whois'),
            isProductDomain = jQuery(this).hasClass('product-domain'),
            btnDomainContinue = jQuery('#btnDomainContinue'),
            resultDomain = jQuery('#resultDomain'),
            resultDomainPricing = jQuery('#resultDomainPricingTerm'),
            idnLanguage = jQuery('#idnLanguageSelector'),
            idnLanguageInput = idnLanguage.find('select');

        if (idnLanguage.is(':visible') && !idnLanguageInput.val()) {
            idnLanguageInput.showInputError();
            return;
        }
        buttons.find('span.to-add').hide();
        buttons.find('span.loading').show();

        var sideOrder =
            ((jQuery(this).parents('.spotlight-tlds').length > 0)
            ||
            (jQuery(this).parents('.suggested-domains').length > 0)) ? 1 : 0;

        var addToCart = WHMCS.http.jqClient.post(
            whmcsBaseUrl + '/cart.php',
            {
                a: 'addToCart',
                domain: domain,
                token: csrfToken,
                whois: whois,
                sideorder: sideOrder,
                idnlanguage: idnLanguageInput.val()
            },
            'json'
        ).done(function (data) {
            buttons.find('span.loading').hide();
            if (data.result === 'added') {
                buttons.find('span.added').show();
                if (!isProductDomain) {
                    buttons.removeAttr('disabled').addClass('checkout');
                }
                if (resultDomain.length && !resultDomain.val()) {
                    resultDomain.val(domain);
                    resultDomainPricing.val(data.period).attr('name', 'domainsregperiod[' + domain +']');
                    if (btnDomainContinue.length > 0 && btnDomainContinue.is(':disabled')) {
                        btnDomainContinue.removeAttr('disabled');
                    }
                }
                jQuery('#cartItemCount').html(data.cartCount);
            } else {
                buttons.find('span.available.price').hide();
                buttons.find('span.unavailable').show();
                buttons.attr('disabled', 'disabled');
            }
        });
    });

    jQuery('#frmDomainTransfer').submit(function (e) {
        e.preventDefault();

        if (
            typeof recaptchaValidationComplete !== 'undefined'
            && typeof recaptchaType !== 'undefined'
            && recaptchaType === 'invisible'
            && recaptchaValidationComplete === false
        ) {
            return;
        }

        var frmDomain = jQuery('#frmDomainTransfer'),
        transferButton = jQuery('#btnTransferDomain'),
            inputDomain = jQuery('#inputTransferDomain'),
            authField = jQuery('#inputAuthCode'),
            domain = inputDomain.val(),
            authCode = authField.val(),
            redirect = false,
            reCaptchaContainer = jQuery('#divDynamicRecaptcha'),
            captcha = jQuery('#inputCaptcha');

        if (!domain) {
            inputDomain.tooltip('show');
            inputDomain.focus();
            return false;
        }

        inputDomain.tooltip('hide');

        if (jQuery('#captchaContainer').length) {
            validate_captcha(frmDomain);
            return;
        }

        reCaptchaContainer.tooltip('hide');
        captcha.tooltip('hide');

        transferButton.attr('disabled', 'disabled').addClass('disabled')
            .find('span').show().end()
            .find('.loader').show();

        WHMCS.http.jqClient.post(
            frmDomain.attr('action'),
            frmDomain.serialize(),
            null,
            'json'
        ).done(function (data) {
            if (typeof data != 'object') {
                transferButton.find('span').hide().end()
                    .find('#addToCart').show().end()
                    .removeAttr('disabled').removeClass('disabled');
                return false;
            }
            var result = data.result;

            if (result == 'added') {
                window.location = whmcsBaseUrl + '/cart.php?a=confdomains';
                redirect = true;
            } else {
                if (result.isRegistered == true) {
                    if (result.epp == true && !authCode) {
                        authField.tooltip('show');
                        authField.focus();
                    }
                } else {
                    jQuery('#transferUnavailable').html(result.unavailable)
                        .fadeIn('fast', function() {
                            setTimeout(function(input) {
                                    input.fadeOut('fast');
                                },
                                3000,
                                jQuery(this)
                            );
                        }
                    );
                }
            }
        }).always(function () {
            if (redirect == false) {
                transferButton.find('span').hide().end()
                    .find('#addToCart').show().end()
                    .removeAttr('disabled').removeClass('disabled');
            }
        });

    });

    jQuery("#btnEmptyCart").click(function() {
        jQuery('#modalEmptyCart').modal('show');
    });

    jQuery("#cardType li a").click(function (e) {
        e.preventDefault();
        jQuery("#selectedCardType").html(jQuery(this).html());
        jQuery("#cctype").val(jQuery('span.type', this).html().trim());
    });

    jQuery(document).on('click', '.domain-contact-support', function(e) {
        e.preventDefault();

        var child = window.open();
        child.opener = null;
        child.location = 'submitticket.php';
    });

    jQuery('#frmConfigureProduct input:visible, #frmConfigureProduct select:visible').first().focus();
    jQuery('#frmProductDomain input[type=text]:visible').first().focus();
    jQuery('#frmDomainChecker input[type=text]:visible').first().focus();
    jQuery('#frmDomainTransfer input[type=text]:visible').first().focus();

    jQuery('.checkout .mc-promo .btn-add').click(function(e) {
        var self = jQuery(this),
            productKey = self.data('product-key'),
            upSellBox = jQuery('#promo_' + productKey);

        self.attr('disabled', 'disabled')
            .find('span.arrow i').removeClass('fa-chevron-right').addClass('fa-spinner fa-spin');
        WHMCS.http.jqClient.post(
            window.location.pathname,
            {
                'a': 'addUpSell',
                'product_key': productKey,
                'checkoutModal': true,
                'token': csrfToken
            },
            function (data) {
                if (typeof data.modal !== 'undefined') {
                    openModal(
                        data.modal,
                        '',
                        data.modalTitle,
                        '',
                        '',
                        data.modalSubmit,
                        data.modelSubmitId
                    );
                    return;
                }
                if (data.done) {
                    jQuery('#totalCartPrice').text(data.newTotal);
                    upSellBox.fadeOut();
                }
            },
            'json'
        );
    });

    jQuery('.viewcart .mc-promo .btn-add').click(function(e) {
        var self = jQuery(this);
        self.attr('disabled', 'disabled')
            .find('span.arrow i').removeClass('fa-chevron-right').addClass('fa-spinner fa-spin');
        WHMCS.http.jqClient.post(
            window.location.pathname,
            {
                'a': 'addUpSell',
                'product_key': self.data('product-key'),
                'token': csrfToken
            },
            function (data) {
                if (typeof data.modal !== 'undefined') {
                    openModal(
                        data.modal,
                        '',
                        data.modalTitle,
                        '',
                        '',
                        data.modalSubmit,
                        data.modelSubmitId
                    );
                    return;
                }
                window.location.reload(true);
            },
            'json'
        );
    });

    jQuery(document).on('click', '#btnAddUpSellCheckout', function(e) {
        var upsellModalForm = jQuery('#upsellModalForm');
        WHMCS.http.jqClient.post(
            whmcsBaseUrl + '/cart.php',
            upsellModalForm.serialize(),
            function (data) {
                if (data.done){
                    jQuery('#totalCartPrice').text(data.newTotal);
                }
            },
            'json'
        );
        return false;
    });

    var useCreditOnCheckout = jQuery('#iCheck-useCreditOnCheckout'),
        skipCreditOnCheckout = jQuery('#iCheck-skipCreditOnCheckout');

    useCreditOnCheckout.on('ifChecked', function() {
        var radio = jQuery('#useCreditOnCheckout'),
            selectedPaymentMethod = jQuery('input[name="paymentmethod"]:checked'),
            selectedCC = jQuery('input[name="ccinfo"]:checked'),
            isCcSelected = selectedPaymentMethod.hasClass('is-credit-card'),
            firstNonCcGateway = jQuery('input[name="paymentmethod"]')
            .not(jQuery('input.is-credit-card[name="paymentmethod"]'))
            .first(),
            container = jQuery('#paymentGatewaysContainer'),
            existingCardInfo = jQuery('#existingCardInfo'),
            ccInputFields = jQuery('#creditCardInputFields'),
            spanFullCredit = jQuery('#spanFullCredit'),
            shouldHideContainer = true;
        if (radio.prop('checked')) {
            if (spanFullCredit.is(':hidden')) {
                shouldHideContainer = false;
            }
            if (isCcSelected && firstNonCcGateway.length !== 0) {
                firstNonCcGateway.iCheck('check');
                ccInputFields.slideUp();
                if (shouldHideContainer) {
                    container.slideUp();
                }
            } else if (!isCcSelected && container.is(':visible')) {
                if (shouldHideContainer) {
                    container.slideUp();
                }
            } else if ((!shouldHideContainer || isCcSelected) && !container.is(":visible")) {
                ccInputFields.slideDown();
                container.slideDown();
            }
            if (isCcSelected && selectedCC.val() !== 'new') {
                if (spanFullCredit.is(':visible')) {
                    hideCvcOnCheckoutForExistingCard = '1';
                    existingCardInfo.hide().find('input').attr('disabled', 'disabled');
                } else {
                    existingCardInfo.show().find('input').removeAttr('disabled');
                }
            }
        }
    });

    skipCreditOnCheckout.on('ifChecked', function() {
        var selectedPaymentMethod = jQuery('input[name="paymentmethod"]:checked'),
            selectedCC = jQuery('input[name="ccinfo"]:checked'),
            isCcSelected = selectedPaymentMethod.hasClass('is-credit-card'),
            existingCardInfo = jQuery('#existingCardInfo'),
            container = jQuery('#paymentGatewaysContainer');
        if (!container.is(":visible")) {
            container.slideDown();
        }
        if (isCcSelected) {
            hideCvcOnCheckoutForExistingCard = '0';
            if (selectedCC.val() !== 'new') {
                existingCardInfo.show().find('input').removeAttr('disabled');
            }
            jQuery('#creditCardInputFields').slideDown();
        }
    });

    var applyCreditContainer = jQuery('#applyCreditContainer');

    if (
        applyCreditContainer.is(':visible')
        && applyCreditContainer.data('apply-credit') === 1
        && useCreditOnCheckout.length
    ) {
        skipCreditOnCheckout.iCheck('check');
        useCreditOnCheckout.iCheck('check');
    }

    jQuery('#domainRenewals').find('span.added').hide().end().find('span.to-add').find('i').hide();
    jQuery('.btn-add-renewal-to-cart').on('click', function() {
        var self = jQuery(this),
            domainId = self.data('domain-id'),
            period = jQuery('#renewalPricing' + domainId).val();

        if (self.hasClass('checkout')) {
            window.location = whmcsBaseUrl + '/cart.php?a=view';
            return;
        }

        self.attr('disabled', 'disabled').each(function() {
            jQuery(this).find('i').fadeIn('fast').end().css('width', jQuery(this).outerWidth());
        });

        WHMCS.http.jqClient.post(
            WHMCS.utils.getRouteUrl('/cart/domain/renew/add'),
            {
                domainId: domainId,
                period: period,
                token: csrfToken
            },
            null,
            'json'
        ).done(function (data) {
            self.find('span.to-add').hide();
            if (data.result === 'added') {
                self.find('span.added').show().end().find('i').fadeOut('fast').css('width', self.outerWidth());
            }
            recalculateRenewalTotals();
        });
    });
    jQuery(document).on('submit', '#removeRenewalForm', function(e) {
        e.preventDefault();

        WHMCS.http.jqClient.post(
            whmcsBaseUrl + '/cart.php',
            jQuery(this).serialize() + '&ajax=1'
        ).done(function(data) {
            var domainId = data.i,
                button = jQuery('#renewDomain' + domainId);

            button.attr('disabled', 'disabled').each(function() {
                jQuery(this).find('span.added').hide().end()
                    .removeClass('checkout').find('span.to-add').show().end().removeAttr('disabled');
                jQuery(this).css('width', jQuery(this).outerWidth());
            });

        }).always(function () {
            jQuery('#modalRemoveItem').modal('hide');
            recalculateRenewalTotals();
        });
    });

    jQuery('.select-renewal-pricing').on('change', function() {
        var self = jQuery(this),
            domainId = self.data('domain-id'),
            button = jQuery('#renewDomain' + domainId);

        button.attr('disabled', 'disabled').each(function() {
            jQuery(this).css('width', jQuery(this).outerWidth());
            jQuery(this).find('span.added').hide().end()
                .removeClass('checkout').find('span.to-add').show().end().removeAttr('disabled');
        });
    });

    jQuery('#domainRenewalFilter').on('keyup', function() {
        var inputText = jQuery(this).val().toLowerCase();
        jQuery('#domainRenewals').find('div.domain-renewal').filter(function() {
            jQuery(this).toggle(jQuery(this).data('domain').toLowerCase().indexOf(inputText) > -1);
        });
    });

    checkoutForm = jQuery('#frmCheckout');
    if (checkoutForm.length) {
        checkoutForm.on('submit', validateCheckoutCreditCardInput);
    }

    jQuery(".payment-methods:checked").trigger('ifChecked');
    if (existingCardContainer.is(':visible') && existingCardContainer.find('input.existing-card').length > 0) {
        newCardInfo.slideUp();
    }
});
//checkoutForm
function validateCheckoutCreditCardInput(e)
{
    var newOrExisting = jQuery('input[name="ccinfo"]:checked').val(),
        submitButton = checkoutForm.find('*[type="submit"]'),
        cardType = null,
        submit = true,
        selectedPaymentMethod = checkoutForm.find('input[name="paymentmethod"]:checked'),
        isCreditCardGateway = selectedPaymentMethod.hasClass('is-credit-card'),
        isRemoteCard = selectedPaymentMethod.data('payment-type') === 'RemoteCreditCard',
        cardNumber = jQuery('#inputCardNumber');

    checkoutForm.find('.form-group').removeClass('has-error');
    checkoutForm.find('.field-error-msg').hide();

    if (isCreditCardGateway && !isRemoteCard) {
        var cvvField = checkoutForm.find('#inputCardCVV2');

        if (newOrExisting === 'new') {
            cvvField = checkoutForm.find('#inputCardCVV');

            cardType = jQuery.payment.cardType(checkoutForm.find('#inputCardNumber').val());
            if (!jQuery.payment.validateCardNumber(checkoutForm.find('#inputCardNumber').val()) || cardNumber.hasClass('unsupported')) {
                var error = cardNumber.data('message-invalid');
                if (cardNumber.hasClass('unsupported')) {
                    error = cardNumber.data('message-unsupported');
                }
                checkoutForm.find('#inputCardNumber').setInputError(error).showInputError();
                submit = false;
            }
            if (
                !jQuery.payment.validateCardExpiry(
                    checkoutForm.find('#inputCardExpiry').payment('cardExpiryVal')
                )
            ) {
                checkoutForm.find('#inputCardExpiry').showInputError();
                submit = false;
            }
        }
        if (cvvField.is(':visible') && !jQuery.payment.validateCardCVC(cvvField.val(), cardType)) {
            cvvField.showInputError();
            submit = false;
        }
        if (!submit) {
            submitButton.prop('disabled', false)
                .removeClass('disabled')
                .find('i')
                .removeAttr('class')
                .addClass('fas fa-arrow-circle-right');
            e.preventDefault();
        }
    }
}

function hasDomainLookupEnded() {
    domainLookupCallCount++;
    if (domainLookupCallCount == 3) {
        jQuery('#btnCheckAvailability').removeAttr('disabled').removeClass('disabled');
    }
}

function hasProductDomainLookupEnded(total, button) {
    domainLookupCallCount++;
    if (domainLookupCallCount == total) {
        button.removeAttr('disabled').removeClass('disabled');
        jQuery('input[name="domainoption"]').iCheck('enable');
    }
}

function domainGotoNextStep() {
    jQuery("#domainLoadingSpinner").show();
    jQuery("#frmProductDomainSelections").submit();
}

function removeItem(type, num) {
    jQuery('#inputRemoveItemType').val(type);
    jQuery('#inputRemoveItemRef').val(num);
    jQuery('#modalRemoveItem').modal('show');
}

function updateConfigurableOptions(i, billingCycle) {
    WHMCS.http.jqClient.post(whmcsBaseUrl + '/cart.php', 'a=cyclechange&ajax=1&i='+i+'&billingcycle='+billingCycle,
        function(data) {
            var co = jQuery('#productConfigurableOptions'),
                add = jQuery('#productAddonsContainer');
            if (co.length) {
                co.html(jQuery(data).find('#productConfigurableOptions').html());
            }
            if (add.length) {
                add.html(jQuery(data).find('#productAddonsContainer').html());
            }
            jQuery('input').iCheck({
                inheritID: true,
                checkboxClass: 'icheckbox_square-blue',
                radioClass: 'iradio_square-blue',
                increaseArea: '20%'
            });
        }
    );
    recalctotals();
}

function recalctotals() {
    if (!jQuery("#orderSummaryLoader").is(":visible")) {
        jQuery("#orderSummaryLoader").fadeIn('fast');
    }

    var thisRequestId = Math.floor((Math.random() * 1000000) + 1);
    window.lastSliderUpdateRequestId = thisRequestId;

    var post = WHMCS.http.jqClient.post(whmcsBaseUrl + '/cart.php', 'ajax=1&a=confproduct&calctotal=true&'+jQuery("#frmConfigureProduct").serialize());
    post.done(
        function(data) {
            if (thisRequestId == window.lastSliderUpdateRequestId) {
                jQuery("#producttotal").html(data);
            }
        }
    );
    post.always(
        function() {
            jQuery("#orderSummaryLoader").delay(500).fadeOut('slow');
        }
    );
}

function recalculateRenewalTotals() {
    if (!jQuery("#orderSummaryLoader").is(":visible")) {
        jQuery("#orderSummaryLoader").fadeIn('fast');
    }

    var thisRequestId = Math.floor((Math.random() * 1000000) + 1);
    window.lastSliderUpdateRequestId = thisRequestId;

    WHMCS.http.jqClient.get(
        WHMCS.utils.getRouteUrl('/cart/domain/renew/calculate')
    ).done(function(data) {
        if (thisRequestId === window.lastSliderUpdateRequestId) {
            jQuery("#producttotal").html(data.body);
        }
    }).always(
        function() {
            jQuery("#orderSummaryLoader").delay(500).fadeOut('slow');
        }
    );
}

function selectDomainPricing(domainName, price, period, yearsString, suggestionNumber) {
    jQuery("#domainSuggestion" + suggestionNumber).iCheck('check');
    jQuery("[name='domainsregperiod[" + domainName + "]']").val(period);
    jQuery("[name='" + domainName + "-selected-price']").html('<b class="glyphicon glyphicon-shopping-cart"></b>'
        + ' ' + period + ' ' + yearsString + ' @ ' + price);
}

function selectDomainPeriodInCart(domainName, price, period, yearsString) {
    var loader = jQuery("#orderSummaryLoader");
    if (loader.not(':visible')) {
        loader.fadeIn('fast');
    }
    jQuery("[name='" + domainName + "Pricing']").html(period + ' ' + yearsString + ' <span class="caret"></span>');
    jQuery("[name='" + domainName + "Price']").html(price);
    var update = WHMCS.http.jqClient.post(
        window.location.pathname,
        {
            domain: domainName,
            period: period,
            a: 'updateDomainPeriod',
            token: csrfToken
        }
    );
    update.done(
        function(data) {
            if (data.forceReload) {
                window.location.reload();
                return;
            }
            data.domains.forEach(function(domain) {
                jQuery("[name='" + domain.domain + "Price']").parent('div').find('.renewal-price').html(
                    domain.prefixedRenewPrice + domain.shortRenewalYearsLanguage
                );
            });
            jQuery('#subtotal').html(data.subtotal);
            if (data.promotype) {
                jQuery('#discount').html(data.discount);
            }
            if (data.taxrate) {
                jQuery('#taxTotal1').html(data.taxtotal);
            }
            if (data.taxrate2) {
                jQuery('#taxTotal2').html(data.taxtotal2);
            }

            var recurringSpan = jQuery('#recurring');

            recurringSpan.find('span:visible').not('span.cost').fadeOut('fast');

            if (data.totalrecurringannually) {
                jQuery('#recurringAnnually').fadeIn('fast').find('.cost').html(data.totalrecurringannually);
            }

            if (data.totalrecurringbiennially) {
                jQuery('#recurringBiennially').fadeIn('fast').find('.cost').html(data.totalrecurringbiennially);
            }

            if (data.totalrecurringmonthly) {
                jQuery('#recurringMonthly').fadeIn('fast').find('.cost').html(data.totalrecurringmonthly);
            }

            if (data.totalrecurringquarterly) {
                jQuery('#recurringQuarterly').fadeIn('fast').find('.cost').html(data.totalrecurringquarterly);
            }

            if (data.totalrecurringsemiannually) {
                jQuery('#recurringSemiAnnually').fadeIn('fast').find('.cost').html(data.totalrecurringsemiannually);
            }

            if (data.totalrecurringtriennially) {
                jQuery('#recurringTriennially').fadeIn('fast').find('.cost').html(data.totalrecurringtriennially);
            }

            jQuery('#totalDueToday').html(data.total);
        }
    );
    update.always(
        function() {
            loader.delay(500).fadeOut('slow');
        }
    );
}

function loadMoreSuggestions()
{
    var suggestions = jQuery('#domainSuggestions'),
        suggestionCount;

    for (suggestionCount = 1; suggestionCount <= 10; suggestionCount++) {
        if (furtherSuggestions > 0) {
            suggestions.find('div.domain-suggestion.clone:hidden:first').slideDown();
            furtherSuggestions = suggestions.find('div.domain-suggestion.clone:hidden').length;
        } else {
            jQuery('div.more-suggestions').find('a').addClass('hidden').end().find('span.no-more').removeClass('hidden');
            return;
        }
    }
}

function validate_captcha(form)
{
    var reCaptcha = jQuery('#g-recaptcha-response'),
        reCaptchaContainer = jQuery('#divDynamicRecaptcha'),
        captcha = jQuery('#inputCaptcha');

    if (reCaptcha.length && !reCaptcha.val()) {
        reCaptchaContainer.tooltip('show');
        return false;
    }

    if (captcha.length && !captcha.val()) {
        captcha.tooltip('show');
        return false;
    }

    var validate = WHMCS.http.jqClient.post(
        form.attr('action'),
        form.serialize() + '&a=validateCaptcha',
        null,
        'json'
    );

    validate.done(function(data) {
        if (data.error) {
            jQuery('#inputCaptcha').attr('data-original-title', data.error).tooltip('show');
            if (captcha.length) {
                jQuery('#inputCaptchaImage').replaceWith(
                    '<img id="inputCaptchaImage" src="' + whmcsBaseUrl + '/includes/verifyimage.php?nocache=' + new Date().getTime() + '" align="middle" />'
                );
            }
        } else {
            jQuery('#captchaContainer').remove();
            form.trigger('submit');
        }
    });
}

function selectPreferredCard()
{
    var methods = jQuery('input[name="ccinfo"]:visible'),
        select = methods.first(),
        preferred = methods.filter('[data-order-preference=0]');
    if (preferred.length) {
        select = preferred;
    }
    select.iCheck('check');
}
