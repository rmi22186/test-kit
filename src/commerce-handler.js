var eventMapping = {
    10: 'ADD_TO_CART',
    11: 'ProductRemoveFromCart',
    12: 'INITIATE_PURCHASE',
    13: 'INITIATE_PURCHASE',
    14: 'CLICK_AD',
    15: 'VIEW_ITEM',
    16: 'PURCHASE',
    17: 'ProductRefund',
    18: 'VIEW_AD',
    19: 'CLICK_AD',
    20: 'ADD_TO_WISHLIST',
    21: 'ProductRemoveFromWishlist',
    22: 'VIEW_ITEM'
}

var aliasMapping = {
    13: 'ProductCheckoutOption',
    19: 'PromotionClick'
}

function CommerceHandler(common) {
    this.common = common || {};
}

CommerceHandler.prototype.logCommerceEvent = function(event) {
    var event_data_and_custom_data = {
        mpid: event.MPID,
        affiliation: event.ProductAction.Affiliation,
        coupon: event.ProductAction.CouponCode,
        transaction_id: event.ProductAction.TransactionId,
        shipping: event.ProductAction.ShippingAmount,
        tax: event.ProductAction.TaxAmount,
        revenue: event.ProductAction.TotalAmount,
        // currency: event.CurrencyCode ? event.CurrencyCode : null
    };

    for (var eventAttr in event.EventAttributes) {
        if (event.EventAttributes.hasOwnProperty(eventAttr)) {
            event_data_and_custom_data[eventAttr] = event.EventAttributes[eventAttr]
        }
    }

    for (var userAttr in event.UserAttributes) {
        if (event.UserAttributes.hasOwnProperty(userAttr)) {
            event_data_and_custom_data[userAttr] = event.UserAttributes[userAttr]
        }
    }

    if (event.CurrencyCode) {
        event_data_and_custom_data["currency"] = event.CurrencyCode;
    }

    // Turn ProductList into Branch content_items
    var content_items = event.ProductAction.ProductList.map(value => {
        var attrs = {}

        for (var attr in value.Attributes) {
            if (value.Attributes.hasOwnProperty(attr)) {
                attrs[attr] = value.Attributes[attr]
            }
        }

        return {
            $product_brand: value.Brand,
            $coupon_code: value.CouponCode,
            $product_name: value.Name,
            $price: value.Price,
            $quantity: value.Quantity,
            $sku: value.Sku,
            $total_amount: value.TotalAmount,
            $product_variant: value.Variant,
            attrs
        };
    })

    // Handle mapping of mParticle to Branch event names
    var customer_event_alias = aliasMapping[event.EventCategory] || '';
    var event_name = eventMapping[event.EventCategory] || event.EventName;

    // Log Branch Commerce event
    branch.logEvent(
        event_name,
        event_data_and_custom_data,
        content_items,
        customer_event_alias,
        function (err) { console.log(err); }
    );
};

module.exports = CommerceHandler;
