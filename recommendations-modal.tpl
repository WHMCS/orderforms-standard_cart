{if in_array($templatefile, ['configureproductdomain', 'configureproduct'])}
<div class="hidden" id="divProductHasRecommendations" data-value="{$productinfo.hasRecommendations}"></div>
{/if}
<div class="modal fade" id="recommendationsModal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="float-left pull-left">
                    {if in_array($templatefile, ['viewcart', 'complete', 'checkout'])}
                        {lang key="recommendations.title.generic"}
                    {else}
                        {lang key="recommendations.title.addedTo"}
                    {/if}
                </h4>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <div class="clearfix"></div>
            </div>
            <div class="modal-body">
                {include file="orderforms/standard_cart/includes/product-recommendations.tpl"}
            </div>
            <div class="modal-footer">
                <a class="btn btn-primary" href="#" id="btnContinueRecommendationsModal" data-dismiss="modal" role="button">
                    <span class="w-hidden hidden"><i class="fas fa-spinner fa-spin"></i>&nbsp;</span>{lang key="continue"}
                </a>
            </div>
        </div>
    </div>
    <div class="product-recommendation clonable w-hidden hidden">
        <div class="header">
            <div class="cta">
                <div class="price">
                    <span class="w-hidden hidden">{lang key="orderfree"}</span>
                    <span class="breakdown-price"></span>
                    <span class="setup-fee"><small>&nbsp;{lang key="ordersetupfee"}</small></span>
                </div>
                <button type="button" class="btn btn-sm btn-add">
                    <span class="text">{lang key="addtocart"}</span>
                    <span class="arrow"><i class="fas fa-chevron-right"></i></span>
                </button>
            </div>
            <div class="expander">
                <i class="fas fa-chevron-right rotate" data-toggle="tooltip" data-placement="right" title="{lang key="recommendations.learnMore"}"></i>
            </div>
            <div class="content">
                <div class="headline truncate"></div>
                <div class="tagline truncate">
                    {lang key="recommendations.taglinePlaceholder"}
                </div>
            </div>
        </div>
        <div class="body clearfix"><p></p></div>
    </div>
</div>
