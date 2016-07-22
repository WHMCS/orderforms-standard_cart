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

    jQuery("#btnCompleteProductConfig").click(function() {
        var btnOriginalText = jQuery(this).html();
        jQuery(this).find('i').removeClass('fa-arrow-circle-right').addClass('fa-spinner fa-spin');
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

    jQuery(".domain-selection-options input:first").iCheck('check');
    jQuery(".domain-selection-options input:first").parents('.option').addClass('option-selected');
    jQuery("#domain" + jQuery(".domain-selection-options input:first").val()).show();
    jQuery(".domain-selection-options input").on('ifChecked', function(event){
        jQuery(".domain-selection-options .option").removeClass('option-selected');
        jQuery(this).parents('.option').addClass('option-selected');
        jQuery(".domain-input-group").hide();
        jQuery("#domain" + jQuery(this).val()).show();
    });

    jQuery(".domain-selection-options .option").click(function(e) {
        jQuery(this).find('input').iCheck('check');
    });

    jQuery('#frmProductDomain button[type="submit"]').click(function(e) {
        e.preventDefault();
        var btnSearchObj = jQuery(this);
        var preSearchText = btnSearchObj.html();
        jQuery(this).html('<i class="fa fa-spinner fa-spin"></i> ' + preSearchText);
        jQuery("#domainSearchResults").hide();
        jQuery("#domainLoadingSpinner").show();
        var domainoption = jQuery(".domain-selection-options input:checked").val();
        var sld = jQuery("#"+domainoption+"sld").val();
        var tld = '';
        if (domainoption=='incart') {
            var sld = jQuery("#"+domainoption+"sld option:selected").text();
        } else if (domainoption=='subdomain') {
            var tld = jQuery("#"+domainoption+"tld option:selected").text();
        } else {
            var tld = jQuery("#"+domainoption+"tld").val();
        }
        jQuery.post("cart.php", { ajax: 1, a: "domainoptions", sld: sld, tld: tld, checktype: domainoption },
            function(data) {
                jQuery("#domainLoadingSpinner").hide();
                jQuery("#domainSearchResults").html(data);
                jQuery("#domainSearchResults").slideDown();
                btnSearchObj.html(preSearchText);
            }
        );
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
            suggestions = jQuery('#domainSuggestions');

        domainLookupCallCount = 0;

        // check a domain has been entered
        if (!inputDomain.val()) {
            inputDomain.tooltip('show');
            inputDomain.focus();
            return;
        }

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
            if (typeof data != 'object' || data.result.length == 0) {
                jQuery('.domain-lookup-primary-loader').hide();
                return;
            }
            jQuery.each(data.result, function(index, domain) {
                var pricing = domain.pricing,
                    result = jQuery('#primaryLookupResult'),
                    available = result.find('.domain-available'),
                    availableprice = result.find('.domain-price'),
                    unavailable = result.find('.domain-unavailable');
                jQuery('.domain-lookup-primary-loader').hide();
                result.removeClass('hidden').show();
                if (domain.isAvailable) {
                    unavailable.hide();
                    available.show().find('strong').html(domain.domainName);
                    availableprice.show().find('span.price').html(pricing[Object.keys(pricing)[0]].register).end()
                        .find('button').attr('data-domain', domain.idnDomainName);
                } else {
                    available.hide();
                    availableprice.hide();
                    unavailable.show().find('strong').html(domain.domainName);
                }
            });
        }).always(function() {
            hasDomainLookupEnded();
        });

        // spotlight lookup handler
        spotlight.done(function(data) {
            if (typeof data != 'object' || data.result.length == 0) {
                jQuery('.domain-lookup-spotlight-loader').hide();
                return;
            }
            jQuery.each(data.result, function(index, domain) {
                var tld = domain.tld,
                    pricing = domain.pricing,
                    result = jQuery('#spotlight' + tld + ' .domain-lookup-result');
                jQuery('.domain-lookup-spotlight-loader').hide();
                if (domain.isAvailable) {
                    result.find('button.unavailable').addClass('hidden').end()
                        .find('span.available').html(pricing[Object.keys(pricing)[0]].register).removeClass('hidden').end()
                        .find('button').not('button.unavailable')
                        .attr('data-domain', domain.idnDomainName)
                        .removeClass('hidden');
                } else {
                    result.find('button.unavailable.hidden').removeClass('hidden').end()
                        .find('span.available').addClass('hidden').end()
                        .find('button').not('button.unavailable').addClass('hidden');
                }
                result.removeClass('hidden');
            });
        }).always(function() {
            hasDomainLookupEnded();
        });

        // suggestions lookup handler
        suggestion.done(function (data) {
            if (typeof data != 'object' || data.result.length == 0) {
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
                    .find('span.extension').html('.' + tld).end()
                    .find('button').attr('data-domain', domain.idnDomainName).end()
                    .find('span.price').html(pricing[Object.keys(pricing)[0]].register).end();
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
            whois = jQuery(this).attr('data-whois');

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
                buttons.find('span.added').show().end().removeAttr('disabled').addClass('checkout');
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
            redirect = false;

        if (!domain) {
            inputDomain.tooltip('show');
            inputDomain.focus();
            return false;
        }

        transferButton.attr('disabled', 'disabled').addClass('disabled')
            .find('span').hide().removeClass('hidden').end()
            .find('.loader').show();

        var lookup = jQuery.post(
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
});

function hasDomainLookupEnded() {
    domainLookupCallCount++;
    if (domainLookupCallCount == 3) {
        jQuery('#btnCheckAvailability').removeAttr('disabled').removeClass('disabled');
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

function catchEnter(e) {
    if (e) {
        addtocart();
        e.returnValue=false;
    }
}
