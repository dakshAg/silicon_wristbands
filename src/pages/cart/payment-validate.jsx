import { verifyPayment } from "../../utils/payment-helper";
import { useEffect } from "react";
import { merchi as sdk_merchi } from "../../../sdk/javascript/merchi";

export default function PaymentValidate() {
    const MERCHI = sdk_merchi("https://api.staging.merchi.co/", "https://websockets.staging.merchi.co/");
    
    useEffect(() => {
        const { id, token } = JSON.parse(localStorage.getItem("cart"));
        verifyPayment(token,id,(data)=>{
            //console.log(data)
        },(error)=>console.log(error))
    }, [])
    /*
    https://example.com/order/123/complete?
    payment_intent=pi_3NV44ZHIxn6Tpj0W07IFa4Wk
    payment_intent_client_secret=pi_3NV44ZHIxn6Tpj0W07IFa4Wk_secret_RmSRkdoVndTMzFPLwUIdFgn1T
    redirect_status=succeeded
    */
    return (
        <h1>Validating Payment</h1>
    )
}