{if $selectedAccountId === $client->id}
    {foreach $client->payMethods->validateGateways()->sortByExpiryDate() as $payMethod}
        {assign "payMethodExpired" 0}
        {assign "expiryDate" ""}
        {if $payMethod->isCreditCard()}
            {if ($payMethod->payment->isExpired())}
                {assign "payMethodExpired" 1}
            {/if}

            {if $payMethod->payment->getExpiryDate()}
                {assign "expiryDate" $payMethod->payment->getExpiryDate()->format('m/Y')}
            {/if}
        {/if}

        <div class="paymethod-info radio-inline" data-paymethod-id="{$payMethod->id}">
            <input type="radio"
                   name="ccinfo"
                   class="existing-card"
                   {if $payMethodExpired}disabled{/if}
                   data-payment-type="{$payMethod->getType()}"
                   data-payment-gateway="{$payMethod->gateway_name}"
                   data-order-preference="{$payMethod->order_preference}"
                   value="{$payMethod->id}">
        </div>

        <div class="paymethod-info" data-paymethod-id="{$payMethod->id}">
            <i class="{$payMethod->getFontAwesomeIcon()}"></i>
        </div>
        <div class="paymethod-info" data-paymethod-id="{$payMethod->id}">
            {if $payMethod->isCreditCard() || $payMethod->isRemoteBankAccount()}
                {$payMethod->payment->getDisplayName()}
            {else}
                <span class="type">
                {$payMethod->payment->getAccountType()}
            </span>
                {substr($payMethod->payment->getAccountNumber(), -4)}
            {/if}
        </div>
        <div class="paymethod-info" data-paymethod-id="{$payMethod->id}">
            {$payMethod->getDescription()}
        </div>
        <div class="paymethod-info" data-paymethod-id="{$payMethod->id}">
            {$expiryDate}{if $payMethodExpired}<br><small>{$LANG.clientareaexpired}</small>{/if}
        </div>
    {/foreach}
{/if}
