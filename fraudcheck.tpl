{include file="orderforms/standard_cart/common.tpl"}

<div id="order-standard_cart">

    <div class="header-lined">
        <h1 class="font-size-36">
            {$LANG.cartfraudcheck}
        </h1>
    </div>

    <div class="row">

        <div class="col-md-10 col-md-offset-1 offset-md-1">

            {include file="orderforms/standard_cart/sidebar-categories-collapsed.tpl"}

            <div class="alert alert-danger error-heading">
                <i class="fas fa-exclamation-triangle"></i>
                {$errortitle}
            </div>

            <div class="row">
                <div class="col-sm-8 col-sm-offset-2 offset-sm-2 text-center">
                    {if $userValidation && !$userValidation.submittedAt && $userValidation.token eq true}
                        <p class="margin-bottom">{lang key='fraud.furtherVal'}</p>
                        <p>
                            <a href="#" class="btn btn-default" data-url="{$userValidationUrl}" onclick="openValidationSubmitModal(this);return false;">
                                {lang key='fraud.submitDocs'}
                                &nbsp;<i class="fas fa-arrow-right"></i>
                            </a>
                        </p>
                        <div id="validationSubmitModal" class="modal fade" role="dialog">
                            <div class="modal-dialog modal-lg">
                                <div class="modal-content">
                                    <div class="modal-body top-margin-10">
                                        <iframe id="validationContent" allow="camera {$userValidationHost}" width="100%" height="700" frameborder="0" src=""></iframe>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-default" data-dismiss="modal">{lang key='close'}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {else}
                        <p class="margin-bottom">{$error}</p>

                        <p>
                            <a href="{$WEB_ROOT}/submitticket.php" class="btn btn-default">
                                {$LANG.orderForm.submitTicket}
                                &nbsp;<i class="fas fa-arrow-right"></i>
                            </a>
                        </p>
                    {/if}

                </div>
            </div>

        </div>
    </div>
</div>
