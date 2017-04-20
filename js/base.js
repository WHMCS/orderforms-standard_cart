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
    furtherSuggestions;

jQuery(document).ready(function(){

    jQuery('#order-standard_cart').find('input').iCheck({
        inheritID: true,
        checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue',
        increaseArea: '20%'
    });

    if (jQuery('#inputCardNumber').length) {
        jQuery('#inputCardNumber').payment('formatCardNumber');
        jQuery('#inputCardCVV').payment('formatCardCVC');
        jQuery('#inputCardStart').payment('formatCardExpiry');
        jQuery('#inputCardExpiry').payment('formatCardExpiry');
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
        if (jQuery("#scrollingPanelContainer").css('float') != 'left') {
            $orderSummaryEl.stop().css('margin-top', '0');
            return false;
        }
        var heightOfOrderSummary =  $orderSummaryEl.outerHeight();
        var newTopOffset = jQuery(window).scrollTop() - offset.top + topPadding;
        if (newTopOffset > maxTopOffset - heightOfOrderSummary) {
            newTopOffset = maxTopOffset - heightOfOrderSummary;
        }
        if (jQuery(window).scrollTop() > offset.top) {
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

        var button = jQuery('#btnCompleteProductConfig');

        var btnOriginalText = jQuery(button).html();
        jQuery(button).find('i').removeClass('fa-arrow-circle-right').addClass('fa-spinner fa-spin');
        jQuery.post("cart.php", 'ajax=1&a=confproduct&' + jQuery("#frmConfigureProduct").serialize(),
            function(data) {
                if (data) {
                    jQuery("#btnCompleteProductConfig").html(btnOriginalText);
                    jQuery("#containerProductValidationErrorsList").html(data);
                    jQuery("#containerProductValidationErrors").removeClass('hidden').show();
                    // scroll to error container if below it
                    if (jQuery(window).scrollTop() > jQuery("#containerProductValidationErrors").offset().top) {
                        jQuery('html, body').scrollTop(jQuery("#containerProductValidationErrors").offset().top - 15);
                    }
                } else {
                    window.location = 'cart.php?a=confdomains';
                }
            }
        );
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
        $activeAddon.find('.panel-add').html('<i class="fa fa-shopping-cart"></i> '+localTrans('addedToCartRemove', 'Added to Cart (Remove)'));
        recalctotals();
    });
    jQuery(".addon-products").on('ifUnchecked', '.panel-addon input', function(event) {
        var $activeAddon = jQuery(this).parents('.panel-addon');
        $activeAddon.removeClass('panel-addon-selected');
        $activeAddon.find('input[type="checkbox"]').iCheck('uncheck');
        $activeAddon.find('.panel-add').html('<i class="fa fa-plus"></i> '+localTrans('addToCart', 'Add to Cart'));
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
            tldInput = '';

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

        jQuery('.domain-lookup-result').addClass('hidden');
        jQuery('#primaryLookupResult div').hide();
        jQuery('#primaryLookupResult').find('.register-price-label').show().end()
            .find('.transfer-price-label').addClass('hidden');

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
        suggestions.find('li').addClass('hidden').end()
            .find('.clone').remove().end();
        jQuery('div.panel-footer.more-suggestions').addClass('hidden')
            .find('a').removeClass('hidden').end()
            .find('span.no-more').addClass('hidden');
        jQuery('.btn-add-to-cart').removeAttr('disabled')
            .find('span').hide().end()
            .find('span.to-add').show();
        btnDomainContinue.addClass('hidden').attr('disabled', 'disabled');

        if (domainoption != 'register') {
            spotlightTlds.hide();
            jQuery('.suggested-domains').hide();
        }

        if (!domainSearchResults.is(":visible")) {
            domainSearchResults.hide().removeClass('hidden').fadeIn();
        }

        if (domainoption == 'register') {
            jQuery('.suggested-domains').hide().removeClass('hidden').fadeIn('fast');
            spotlightTlds.hide().removeClass('hidden').fadeIn('fast');
            jQuery('#resultDomainOption').val(domainoption);
            var lookup = jQuery.post(
                    'cart.php',
                    {
                        token: csrfToken,
                        a: 'checkDomain',
                        type: 'domain',
                        domain: sld + tld
                    },
                    'json'
                ),
                spotlight = jQuery.post(
                    'cart.php',
                    {
                        token: csrfToken,
                        a: 'checkDomain',
                        type: 'spotlight',
                        domain: sld + tld
                    },
                    'json'
                ),
                suggestion = jQuery.post(
                    'cart.php',
                    {
                        token: csrfToken,
                        a: 'checkDomain',
                        type: 'suggestions',
                        domain: sld + tld
                    },
                    'json'
                );

            // primary lookup handler
            lookup.done(function (data) {
                jQuery.each(data.result, function(index, domain) {
                    var pricing = domain.pricing,
                        result = jQuery('#primaryLookupResult'),
                        available = result.find('.domain-available'),
                        availablePrice = result.find('.domain-price'),
                        unavailable = result.find('.domain-unavailable'),
                        invalid= result.find('.domain-invalid'),
                        contactSupport = result.find('.domain-contact-support'),
                        resultDomain = jQuery('#resultDomain'),
                        resultDomainPricing = jQuery('#resultDomainPricingTerm');
                    result.removeClass('hidden').show();
                    jQuery('.domain-lookup-primary-loader').hide();
                    if (domain.isValidDomain) {
                        if (domain.isAvailable && typeof pricing !== 'string') {
                            if (domain.preferredTLDNotAvailable) {
                                unavailable.show().find('strong').html(domain.domainName);
                            }
                            contactSupport.hide();
                            available.show().find('strong').html(domain.domainName);
                            availablePrice.show().find('span.price').html(pricing[Object.keys(pricing)[0]].register).end()
                                .find('button').attr('data-domain', domain.idnDomainName);
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
                        var invalidLength = invalid.find('span.domain-length-restrictions');
                        invalidLength.hide();
                        if (domain.minLength > 0 && domain.maxLength > 0) {
                            invalidLength.find('.min-length').html(domain.minLength).end()
                                .find('.max-length').html(domain.maxLength).end();
                            invalidLength.show();
                        }
                        invalid.show();
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
                    result.find('button').addClass('hidden').end();
                    if (domain.isValidDomain) {
                        if (domain.isAvailable && typeof pricing !== 'string') {
                            result
                                .find('span.available').html(pricing[Object.keys(pricing)[0]].register).removeClass('hidden').end()
                                .find('button.btn-add-to-cart')
                                .attr('data-domain', domain.idnDomainName)
                                .removeClass('hidden');
                        } else {
                            if (typeof pricing === 'string') {
                                if (pricing == '') {
                                    result.find('button.unavailable').removeClass('hidden').end();
                                } else {
                                    result.find('button.domain-contact-support').removeClass('hidden').end();
                                }
                                result.find('span.available').addClass('hidden').end();
                            } else {
                                result.find('button.unavailable').removeClass('hidden').end();
                                result.find('span.available').addClass('hidden').end();
                            }
                        }
                    } else {
                        result.find('button.invalid.hidden').removeClass('hidden').end()
                            .find('span.available').addClass('hidden').end()
                            .find('button').not('button.invalid').addClass('hidden');
                    }
                    result.removeClass('hidden');
                });
            }).always(function() {
                hasProductDomainLookupEnded(3, btnSearchObj);
            });

            // suggestions lookup handler
            suggestion.done(function (data) {
                if (typeof data != 'object' || data.result.length == 0 || data.result.error) {
                    jQuery('.suggested-domains').fadeOut('fast', function() {
                        jQuery(this).addClass('hidden');
                    });
                    return;
                } else {
                    jQuery('.suggested-domains').removeClass('hidden');
                }
                var suggestionCount = 1;
                jQuery.each(data.result, function(index, domain) {
                    var tld = domain.tld,
                        pricing = domain.pricing;
                    suggestions.find('li:first').clone(true, true).appendTo(suggestions);
                    var newSuggestion = suggestions.find('li.domain-suggestion').last();
                    newSuggestion.addClass('clone')
                        .find('span.domain').html(domain.sld).end()
                        .find('span.extension').html('.' + tld).end();

                    if (typeof pricing === 'string') {
                        newSuggestion.find('button.btn-add-to-cart').remove();
                        if (pricing != '') {
                            newSuggestion.find('button.domain-contact-support').removeClass('hidden').end()
                                .find('span.price').hide();
                        } else {
                            newSuggestion.remove();
                        }
                    } else {
                        newSuggestion.find('button.btn-add-to-cart').attr('data-domain', domain.idnDomainName).end()
                            .find('span.price').html(pricing[Object.keys(pricing)[0]].register).end();
                    }

                    if (suggestionCount <= 10) {
                        newSuggestion.removeClass('hidden');
                    }
                    suggestionCount++;
                    if (domain.group) {
                        newSuggestion.find('span.promo')
                            .addClass(domain.group)
                            .html(domain.group.toUpperCase())
                            .removeClass('hidden')
                            .end();
                    }
                    furtherSuggestions = suggestions.find('li.domain-suggestion.clone.hidden').length;
                    if (furtherSuggestions > 0) {
                        jQuery('div.more-suggestions').removeClass('hidden');
                    }
                });
                jQuery('.domain-lookup-suggestions-loader').hide();
                jQuery('#domainSuggestions').removeClass('hidden');
            }).always(function() {
                hasProductDomainLookupEnded(3, btnSearchObj);
            });
        } else if (domainoption == 'transfer') {
            jQuery('#resultDomainOption').val(domainoption);
            var transfer = jQuery.post(
                'cart.php',
                {
                    token: csrfToken,
                    a: 'checkDomain',
                    type: 'transfer',
                    domain: sld + tld
                },
                'json'
            );

            transfer.done(function (data) {
                if (typeof data != 'object' || data.result.length == 0) {
                    jQuery('.domain-lookup-primary-loader').hide();
                    return;
                }
                jQuery.each(data.result, function(index, domain) {
                    var pricing = domain.pricing,
                        result = jQuery('#primaryLookupResult'),
                        transfereligible = result.find('.transfer-eligible'),
                        transferPrice = result.find('.domain-price'),
                        transfernoteligible = result.find('.transfer-not-eligible'),
                        resultDomain = jQuery('#resultDomain'),
                        resultDomainPricing = jQuery('#resultDomainPricingTerm');
                    jQuery('.domain-lookup-primary-loader').hide();
                    result.removeClass('hidden').show();
                    if (domain.isRegistered) {
                        transfereligible.show();
                        transferPrice.show().find('.register-price-label').hide().end()
                            .find('.transfer-price-label').removeClass('hidden').show().end()
                            .find('span.price').html(pricing[Object.keys(pricing)[0]].transfer).end()
                            .find('button').attr('data-domain', domain.idnDomainName);
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

            var otherDomain = jQuery.post(
                'cart.php',
                {
                    token: csrfToken,
                    a: 'checkDomain',
                    type: domainoption,
                    pid: pid,
                    domain: sld + tld
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
                        window.location = 'cart.php?a=confproduct&i=' + result.num;
                    } else {
                        jQuery('.domain-lookup-primary-loader').hide();
                        jQuery('#primaryLookupResult').removeClass('hidden').show().find('.domain-invalid').show();
                    }
                });

            }).always(function(){
                hasProductDomainLookupEnded(1, btnSearchObj);
            });
        }

        btnDomainContinue.removeClass('hidden');
    });

    jQuery("#btnAlreadyRegistered").click(function() {
        jQuery("#containerNewUserSignup").slideUp('', function() {
            jQuery("#containerExistingUserSignin").hide().removeClass('hidden').slideDown('', function() {
                jQuery("#inputCustType").val('existing');
                jQuery("#btnAlreadyRegistered").fadeOut('', function() {
                    jQuery("#btnNewUserSignup").removeClass('hidden').fadeIn();
                });
            });
        });
        jQuery("#containerNewUserSecurity").hide();
        if (jQuery("#stateselect").attr('required')) {
            jQuery("#stateselect").removeAttr('required').addClass('requiredAttributeRemoved');
        }
    });

    jQuery("#btnNewUserSignup").click(function() {
        jQuery("#containerExistingUserSignin").slideUp('', function() {
            jQuery("#containerNewUserSignup").hide().removeClass('hidden').slideDown('', function() {
                jQuery("#inputCustType").val('new');
                jQuery("#containerNewUserSecurity").show();
                jQuery("#btnNewUserSignup").fadeOut('', function() {
                    jQuery("#btnAlreadyRegistered").removeClass('hidden').fadeIn();
                });
            });
        });
        if (jQuery("#stateselect").hasClass('requiredAttributeRemoved')) {
            jQuery("#stateselect").attr('required', 'required').removeClass('requiredAttributeRemoved');
        }
    });

    jQuery(".payment-methods").on('ifChecked', function(event) {
        if (jQuery(this).hasClass('is-credit-card')) {
            if (!jQuery("#creditCardInputFields").is(":visible")) {
                jQuery("#creditCardInputFields").hide().removeClass('hidden').slideDown();
            }
        } else {
            jQuery("#creditCardInputFields").slideUp();
        }
    });

    jQuery("input[name='ccinfo']").on('ifChecked', function(event) {
        if (jQuery(this).val() == 'new') {
            jQuery("#existingCardInfo").slideUp('', function() {
                jQuery("#newCardInfo").hide().removeClass('hidden').slideDown();
            });
        } else {
            jQuery("#newCardInfo").slideUp('', function() {
                jQuery("#existingCardInfo").hide().removeClass('hidden').slideDown();
            });
        }
    });

    jQuery("#inputDomainContact").on('change', function() {
        if (this.value == "addingnew") {
            jQuery("#domainRegistrantInputFields").hide().removeClass('hidden').slideDown();
        } else {
            jQuery("#domainRegistrantInputFields").slideUp();
        }
    });

    jQuery("#inputNewPassword1").keyup(function () {
        passwordStrength = getPasswordStrength(jQuery(this).val());
        if (passwordStrength >= 75) {
            textLabel = langPasswordStrong;
            cssClass = 'success';
        } else if (passwordStrength >= 30) {
            textLabel = langPasswordModerate;
            cssClass = 'warning';
        } else {
            textLabel = langPasswordWeak;
            cssClass = 'danger';
        }
        jQuery("#passwordStrengthTextLabel").html(langPasswordStrength + ': ' + passwordStrength + '% ' + textLabel);
        jQuery("#passwordStrengthMeterBar").css('width', passwordStrength + '%').attr('aria-valuenow', passwordStrength);
        jQuery("#passwordStrengthMeterBar").removeClass('progress-bar-success progress-bar-warning progress-bar-danger').addClass('progress-bar-' + cssClass);
    });

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

        var frmDomain = jQuery('#frmDomainChecker'),
            inputDomain = jQuery('#inputDomain'),
            suggestions = jQuery('#domainSuggestions'),
            reCaptchaContainer = jQuery('#google-recaptcha'),
            captcha = jQuery('#inputCaptcha');

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
        jQuery('.domain-lookup-result').addClass('hidden');
        jQuery('.domain-lookup-loader').show();

        // reset elements
        suggestions.find('li').addClass('hidden').end();
        suggestions.find('.clone').remove().end();
        jQuery('div.panel-footer.more-suggestions').addClass('hidden')
            .find('a').removeClass('hidden').end()
            .find('span.no-more').addClass('hidden');
        jQuery('.btn-add-to-cart').removeAttr('disabled')
            .find('span').hide().end()
            .find('span.to-add').show();
        jQuery('.suggested-domains').hide().removeClass('hidden').fadeIn('fast');

        // fade in results
        if (!jQuery('#DomainSearchResults').is(":visible")) {
            jQuery('.domain-pricing').hide();
            jQuery('#DomainSearchResults').hide().removeClass('hidden').fadeIn();
        }

        var lookup = jQuery.post(
                frmDomain.attr('action'),
                frmDomain.serialize() + '&type=domain',
                'json'
            ),
            spotlight = jQuery.post(
                frmDomain.attr('action'),
                frmDomain.serialize() + '&type=spotlight',
                'json'
            ),
            suggestion = jQuery.post(
                frmDomain.attr('action'),
                frmDomain.serialize() + '&type=suggestions',
                'json'
            );

        // primary lookup handler
        lookup.done(function (data) {
            if (typeof data != 'object' || data.result.length == 0 || data.result.error) {
                jQuery('.domain-lookup-primary-loader').hide();
                return;
            }
            jQuery.each(data.result, function(index, domain) {
                var pricing = domain.pricing,
                    result = jQuery('#primaryLookupResult'),
                    available = result.find('.domain-available'),
                    availablePrice = result.find('.domain-price'),
                    contactSupport = result.find('.domain-contact-support'),
                    unavailable = result.find('.domain-unavailable'),
                    invalid = result.find('.domain-invalid');
                jQuery('.domain-lookup-primary-loader').hide();
                result.removeClass('hidden').show();
                if (domain.isValidDomain) {
                    unavailable.hide();
                    contactSupport.hide();
                    invalid.hide();
                    if (domain.isAvailable && typeof pricing !== 'string') {
                        if (domain.preferredTLDNotAvailable) {
                            unavailable.show().find('strong').html(domain.originalUnavailableDomain);
                        }
                        available.show().find('strong').html(domain.domainName);
                        availablePrice.show().find('span.price').html(pricing[Object.keys(pricing)[0]].register).end()
                            .find('button').attr('data-domain', domain.idnDomainName);
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
                    var invalidLength = invalid.find('span.domain-length-restrictions');
                    invalidLength.hide();
                    if (domain.minLength > 0 && domain.maxLength > 0) {
                        invalidLength.find('.min-length').html(domain.minLength).end()
                            .find('.max-length').html(domain.maxLength).end();
                        invalidLength.show();
                    }
                    invalid.show();
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
                result.find('button').addClass('hidden').end();
                if (domain.isValidDomain) {
                    if (domain.isAvailable && typeof pricing !== 'string') {
                        result.find('button.unavailable').addClass('hidden').end()
                            .find('button.invalid').addClass('hidden').end()
                            .find('span.available').html(pricing[Object.keys(pricing)[0]].register).removeClass('hidden').end()
                            .find('button').not('button.unavailable').not('button.invalid')
                            .attr('data-domain', domain.idnDomainName)
                            .removeClass('hidden');
                    } else {
                        if (typeof pricing === 'string') {
                            if (pricing == '') {
                                result.find('button.unavailable').removeClass('hidden').end();
                            } else {
                                result.find('button.domain-contact-support').removeClass('hidden').end();
                            }
                            result.find('button.invalid').addClass('hidden').end();
                            result.find('span.available').addClass('hidden').end();
                        } else {
                            result.find('button.invalid').addClass('hidden').end()
                                .find('button.unavailable').removeClass('hidden').end()
                                .find('span.available').addClass('hidden').end();
                        }
                    }
                } else {
                    result.find('button.invalid.hidden').removeClass('hidden').end()
                        .find('span.available').addClass('hidden').end()
                        .find('button').not('button.invalid').addClass('hidden');
                }
                result.removeClass('hidden');
            });
        }).always(function() {
            hasDomainLookupEnded();
        });

        // suggestions lookup handler
        suggestion.done(function (data) {
            if (typeof data != 'object' || data.result.length == 0 || data.result.error) {
                jQuery('.suggested-domains').fadeOut('fast', function() {
                    jQuery(this).addClass('hidden');
                });
                return;
            } else {
                jQuery('.suggested-domains').removeClass('hidden');
            }
            var suggestionCount = 1;
            jQuery.each(data.result, function(index, domain) {
                var tld = domain.tld,
                    pricing = domain.pricing;
                suggestions.find('li:first').clone(true, true).appendTo(suggestions);
                var newSuggestion = suggestions.find('li.domain-suggestion').last();
                newSuggestion.addClass('clone')
                    .find('span.domain').html(domain.sld).end()
                    .find('span.extension').html('.' + tld).end();

                if (typeof pricing === 'string') {
                    newSuggestion.find('button.btn-add-to-cart').remove();
                    if (pricing != '') {
                        newSuggestion.find('button.domain-contact-support').removeClass('hidden').end()
                            .find('span.price').hide();
                    } else {
                        newSuggestion.remove();
                    }
                } else {
                    newSuggestion.find('button.btn-add-to-cart').attr('data-domain', domain.idnDomainName).end()
                        .find('span.price').html(pricing[Object.keys(pricing)[0]].register).end();
                }
                if (suggestionCount <= 10) {
                    newSuggestion.removeClass('hidden');
                }
                suggestionCount++;
                if (domain.group) {
                    newSuggestion.find('span.promo')
                        .addClass(domain.group)
                        .removeClass('hidden')
                        .end();
                    newSuggestion.find('span.sales-group-' + domain.group)
                        .removeClass('hidden')
                        .end();
                }
                furtherSuggestions = suggestions.find('li.domain-suggestion.clone.hidden').length;
                if (furtherSuggestions > 0) {
                    jQuery('div.more-suggestions').removeClass('hidden');
                }
            });
            jQuery('.domain-lookup-suggestions-loader').hide();
            jQuery('#domainSuggestions').removeClass('hidden');
        }).always(function() {
            hasDomainLookupEnded();
        });
    });

    jQuery('.btn-add-to-cart').on('click', function() {
        if (jQuery(this).hasClass('checkout')) {
            window.location = 'cart.php?a=confdomains';
            return;
        }
        var domain = jQuery(this).attr('data-domain'),
            buttons = jQuery('button[data-domain="' + domain + '"]'),
            whois = jQuery(this).attr('data-whois'),
            isProductDomain = jQuery(this).hasClass('product-domain'),
            btnDomainContinue = jQuery('#btnDomainContinue'),
            resultDomain = jQuery('#resultDomain'),
            resultDomainPricing = jQuery('#resultDomainPricingTerm');

        buttons.attr('disabled', 'disabled');

        var addToCart = jQuery.post(
            window.location.pathname,
            {
                a: 'addToCart',
                domain: domain,
                token: csrfToken,
                whois: whois
            },
            'json'
        ).done(function (data) {
            buttons.find('span.to-add').hide();
            if (data.result == 'added') {
                buttons.find('span.added').show().end();
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
                buttons.find('span.unavailable').show();
            }
        });
    });

    jQuery('#frmDomainTransfer').submit(function (e) {
        e.preventDefault();

        var frmDomain = jQuery('#frmDomainTransfer'),
        transferButton = jQuery('#btnTransferDomain'),
            inputDomain = jQuery('#inputTransferDomain'),
            authField = jQuery('#inputAuthCode'),
            domain = inputDomain.val(),
            authCode = authField.val(),
            redirect = false,
            reCaptchaContainer = jQuery('#google-recaptcha'),
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
            .find('span').hide().removeClass('hidden').end()
            .find('.loader').show();

        jQuery.post(
            frmDomain.attr('action'),
            frmDomain.serialize(),
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
                window.location = 'cart.php?a=confdomains';
                redirect = true;
            } else {
                if (result.isRegistered == true) {
                    if (result.epp == true && !authCode) {
                        authField.tooltip('show');
                        authField.focus();
                    }
                } else {
                    jQuery('#transferUnavailable').html(result.unavailable)
                        .hide().removeClass('hidden').fadeIn('fast', function() {
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
        jQuery("#cctype").val(jQuery('span.type', this).html());
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

    // Domain Pricing Table Filters
    jQuery(".tld-filters a").click(function(e) {
        e.preventDefault();

        if (jQuery(this).hasClass('label-success')) {
            jQuery(this).removeClass('label-success');
        } else {
            jQuery(this).addClass('label-success');
        }

        jQuery('.tld-row').removeClass('filtered-row');
        jQuery('.tld-filters a.label-success').each(function(index) {
            var filterValue = jQuery(this).data('category');
            jQuery('.tld-row[data-category*="' + filterValue + '"]').addClass('filtered-row');
        });
        jQuery(".filtered-row:even").removeClass('highlighted');
        jQuery(".filtered-row:odd").addClass('highlighted');
        jQuery('.tld-row:not(".filtered-row")').fadeOut('', function() {
            if (jQuery('.filtered-row').size() == 0) {
                jQuery('.tld-row.no-tlds').show();
            } else {
                jQuery('.tld-row.no-tlds').hide();
            }
        });
        jQuery('.tld-row.filtered-row').fadeIn();
    });
    jQuery(".filtered-row:even").removeClass('highlighted');
    jQuery(".filtered-row:odd").addClass('highlighted');

    jQuery('.promo-cart .btn-add').click(function(e) {
        var self = jQuery(this);
        self.attr('disabled', 'disabled')
            .find('span.loading').hide().removeClass('hidden').show().end();
        jQuery.post(
            window.location.pathname,
            {
                'a': 'addUpSell',
                'product_key': self.data('product-key'),
                'token': csrfToken
            },
            function (data) {
                console.log(data.modal);
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

    jQuery(document).on('click', '#btnAddUpSell', function(e) {
        needRefresh = true;
    });
});

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

    jQuery.post("cart.php", 'a=cyclechange&ajax=1&i='+i+'&billingcycle='+billingCycle,
        function(data) {
            jQuery("#productConfigurableOptions").html(jQuery(data).find('#productConfigurableOptions').html());
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

    thisRequestId = Math.floor((Math.random() * 1000000) + 1);
    window.lastSliderUpdateRequestId = thisRequestId;

    var post = jQuery.post("cart.php", 'ajax=1&a=confproduct&calctotal=true&'+jQuery("#frmConfigureProduct").serialize());
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

function selectDomainPricing(domainName, price, period, yearsString, suggestionNumber) {
    jQuery("#domainSuggestion" + suggestionNumber).iCheck('check');
    jQuery("[name='domainsregperiod[" + domainName + "]']").val(period);
    jQuery("[name='" + domainName + "-selected-price']").html('<b class="glyphicon glyphicon-shopping-cart"></b>'
        + ' ' + period + ' ' + yearsString + ' @ ' + price);
}

function selectDomainPeriodInCart(domainName, price, period, yearsString) {
    var loader = jQuery("#orderSummaryLoader");
    if (loader.hasClass('hidden')) {
        loader.hide().removeClass('hidden').fadeIn('fast');
    }
    jQuery("[name='" + domainName + "Pricing']").html(period + ' ' + yearsString + ' <span class="caret"></span>');
    jQuery("[name='" + domainName + "Price']").html(price);
    var update = jQuery.post(
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
            data.domains.forEach(function(domain) {
                jQuery("[name='" + domain.domain + "Price']").parent('div').find('.renewal-price').html(
                    domain.renewprice + domain.shortYearsLanguage
                ).end();
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

            recurringSpan.find('span:visible').not('span.cost').fadeOut('fast').end();

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
            loader.delay(500).fadeOut('slow').addClass('hidden').show();
        }
    );
}

function loadMoreSuggestions()
{
    var suggestions = jQuery('#domainSuggestions'),
        suggestionCount;

    for (suggestionCount = 1; suggestionCount <= 10; suggestionCount++) {
        if (furtherSuggestions > 0) {
            suggestions.find('li.domain-suggestion.hidden.clone:first').not().hide().removeClass('hidden').slideDown();
            furtherSuggestions = suggestions.find('li.domain-suggestion.clone.hidden').length;
        } else {
            jQuery('div.more-suggestions').find('a').addClass('hidden').end().find('span.no-more').removeClass('hidden');
            return;
        }
    }
}

function validate_captcha(form)
{
    var reCaptcha = jQuery('#g-recaptcha-response'),
        reCaptchaContainer = jQuery('#google-recaptcha'),
        captcha = jQuery('#inputCaptcha');

    if (reCaptcha.length && !reCaptcha.val()) {
        reCaptchaContainer.tooltip('show');
        return false;
    }

    if (captcha.length && !captcha.val()) {
        captcha.tooltip('show');
        return false;
    }

    var validate = jQuery.post(
        form.attr('action'),
        form.serialize() + '&a=validateCaptcha',
        'json'
    );

    validate.done(function(data) {
        if (data.error) {
            jQuery('#inputCaptcha').attr('data-original-title', data.error).tooltip('show');
            if (captcha.length) {
                jQuery('#inputCaptchaImage').replaceWith(
                    '<img id="inputCaptchaImage" src="includes/verifyimage.php" align="middle" />'
                );
            }
        } else {
            jQuery('#captchaContainer').remove();
            form.trigger('submit');
        }
    });
}
