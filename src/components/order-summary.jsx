import { useWatch } from "react-hook-form";
import { merchi as sdk_merchi } from "../../sdk/javascript/merchi";
import React from "react";
import styles from './order-summary.module.css'
import VariationDisplayHandler from "./variant-displays/variation-display-handler";
import { useDebouncedEffect } from "../utils/useDebouncedEffect";
export default function OrderSummary({ control, defaultJob }) {

    const [jobQuote, setJobQuote] = React.useState(null);

    function makeMerchiJsEnt(entName, data) {
        return MERCHI.fromJson(new MERCHI[entName](), data);
    }
    const value = useWatch({
        control,
        defaultValue: {}
    });

    const MERCHI = sdk_merchi("https://api.staging.merchi.co/", "https://websockets.staging.merchi.co/");
    useDebouncedEffect(() => {
        let mergedJob = { ...defaultJob, ...value }
        console.log(mergedJob)
        MERCHI.getJobQuote(
            makeMerchiJsEnt("Job", mergedJob),
            (data) => {
                //console.log(data);
                setJobQuote(data);
            },
            (e) => {
                console.error(e);
            }
        );
    }, [value], 1000);


    return (
        <div className={styles.stick}>
            <div className={styles.outer_box}>
                <div className={styles.blue_box}>
                    <h4>Order Summary</h4>
                </div>
                {jobQuote &&
                    <>
                        <h5>{jobQuote.product.name}</h5>
                        <div className={styles.info}>
                            {jobQuote.variations.map((variation) => (
                                <VariationDisplayHandler variation={variation}></VariationDisplayHandler>
                            ))}
                            <p>Quantity : {jobQuote.quantity}</p>

                            <h3>TOTAL: {jobQuote.currency} {jobQuote.totalCost}</h3>
                        </div>
                    </>
                }
            </div>
        </div>
    )
}