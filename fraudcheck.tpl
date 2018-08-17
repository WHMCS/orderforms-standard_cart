{include file="orderforms/{$carttpl}/common.tpl"}

<div id="order-standard_cart">

    <div class="header-lined">
        <h1>
            {$LANG.cartfraudcheck}
        </h1>
    </div>

    <div class="row">

        <div class="col-md-10 col-md-offset-1">

            {include file="orderforms/{$carttpl}/sidebar-categories-collapsed.tpl"}

            <div class="alert alert-danger error-heading">
                <i class="fas fa-exclamation-triangle"></i>
                {$errortitle}
            </div>

            <div class="row">
                <div class="col-sm-8 col-sm-offset-2">

                    <p class="margin-bottom">{$error}</p>

                    <div class="text-center">
                        <a href="submitticket.php" class="btn btn-default">
                            {$LANG.orderForm.submitTicket}
                            &nbsp;<i class="fas fa-arrow-right"></i>
                        </a>
                    </div>

                </div>
            </div>

        </div>
    </div>
</div>
