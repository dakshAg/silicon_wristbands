import { useWatch } from "react-hook-form";
import { merchi as sdk_merchi } from "../../sdk/javascript/merchi";
import React from "react";
import styles from './order-summary.module.css'
import VariationDisplayHandler from "./variant-displays/variation-display-handler";
import { useDebouncedEffect } from "../utils/useDebouncedEffect";
export default function CartItemSummary({ control, cart_item }) {

    const [cartItem, setCartItem] = React.useState(null);

    function makeMerchiJsEnt(entName, data) {
        return MERCHI.fromJson(new MERCHI[entName](), data);
    }
    const value = useWatch({
        control,
        defaultValue: {}
    });

    const MERCHI = sdk_merchi("https://api.staging.merchi.co/", "https://websockets.staging.merchi.co/");
    useDebouncedEffect(() => {
        makeMerchiJsEnt("CartItem", value).calculate((data)=>{
            //console.log(data)
            setCartItem(MERCHI.toJson(data))
        },(error)=>{
            console.log(error)
        })

    }, [value], 1000);


    return (
        <div className={styles.stick}>
            <div className={styles.outer_box}>
                <div className={styles.blue_box}>
                    <h4>Order Summary</h4>
                </div>
                {cartItem &&
                    <>
                        <h5>{cartItem.product.name}</h5>
                        <div className={styles.info}>
                            {cartItem.variations.map((variation) => (
                                <VariationDisplayHandler variation={variation}></VariationDisplayHandler>
                            ))}
                            <p>Quantity : {cartItem.quantity}</p>

                            <h3>TOTAL: {cartItem.currency} {cartItem.totalCost}</h3>
                        </div>
                    </>
                }
            </div>
        </div>
    )
}