import { MERCHI } from "../app/merchi";

export function createPaymentIntent(cart_token,cart_id, success, error){
    var request = new MERCHI.Request(),
        data = new MERCHI.Dictionary();
    request.resource(`/stripe/payment_intent/cart/${cart_id}/`);
    request.method('GET');
    request.query().add('cart_token', cart_token);
    request.query().add('skip_rights', true);
    function handleResponse(status, data) {
        if (status === 200) {
            success(data);
        } else {
            error(data);
        }
    }
    function handleError() {
        error({message: 'could not connect to server',
                errorCode: 0});
    }
    request.responseHandler(handleResponse).errorHandler(handleError);
    request.send();
}

export function verifyPayment(cart_token,cart_id, success, error){
    var request = new MERCHI.Request(),
        data = new MERCHI.Dictionary();
    request.resource(`/stripe/payment_intent/cart/complete/${cart_id}/`);
    request.method('GET');
    request.query().add('cart_token', cart_token);
    request.query().add('skip_rights', true);
    function handleResponse(status, data) {
        if (status === 200) {
            success(data);
        } else {
            error(data);
        }
    }
    function handleError() {
        error({message: 'could not connect to server',
                errorCode: 0});
    }
    request.responseHandler(handleResponse).errorHandler(handleError);
    request.send();
}