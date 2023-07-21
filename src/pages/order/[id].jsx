import { useForm, useFieldArray } from "react-hook-form"
import { merchi as sdk_merchi } from "../../../sdk/javascript/merchi";
import MERCHI from "../../app/merchi"
import React from "react";
import { useEffect } from "react";
import '../../app/globals.css'
import { useRouter } from 'next/router'
import VariationHandler from "../../components/variation-handler";
import debounce from 'debounce';
import { JobContext } from "../_app";
import TopBar from "../../components/top-bar";
import { useContext } from "react";
import styles from './id.module.css'
import OrderSummary from "../../components/order-summary";
import CartFab from "../../components/cart-fab";
import { fetchSSR } from "../../utils/merchi-ssr";

export async function getServerSideProps({ req, res, params }) {
    const id = params.id
    const newProduct = new MERCHI.Product();
    console.log(`Id : ${id}`)
    newProduct.id(id);

    return fetchSSR(newProduct, {
        groupVariationFields: {},
        defaultJob: {},
        independentVariationFields: {
            options: {
                linkedFile: {}
            }
        }
    })
    
}


export default function Home(props) {
    function makeMerchiJsEnt(entName, data) {
        const jobEntity = MERCHI.fromJson(new MERCHI[entName](), data);
        return jobEntity;
    }


    const {
        register,
        setValue,
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm({ shouldUnregister: false, defaultValues: props.product })

    const { fields, replace } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "variations", // unique name for your Field Array
        keyName: "faux_id"
    });

    const router = useRouter()
    console.log(props)
    const [product, setProduct] = React.useState(makeMerchiJsEnt("Product", props.data));
    const { job, setJob } = useContext(JobContext);

    useEffect(() => {
        console.log(product)
        //console.log(defaultJob.variations)
        const variations = MERCHI.toJsonList(product.defaultJob().variations())
        replace(variations)
        console.log(variations)
    }, [product])

    const onSubmitQuote = (data) => {
        let mergedJob = { ...MERCHI.toJson(product._defaultJob), ...data }
        setJob(mergedJob)
        //console.log(mergedJob)
        router.push('/order/user-details?p=quote')
    }

    const onSubmitCart = (data) => {
        let mergedJob = { ...MERCHI.toJson(product._defaultJob), ...data }
        setJob(mergedJob)
        //console.log(mergedJob)
        router.push('/order/user-details?p=cart')
    }

    return (
        <>
            <TopBar />
            <main>
                <div className={styles.container}>
                    <form className={styles.form}>
                        <h1>{product ? product._name : "No Product"}</h1>

                        {
                            fields.map((field, index) => (
                                <div key={field.faux_id}>
                                    <VariationHandler variation_field={product?.independentVariationFields()[index]} name={`variations[${index}].value`} control={control} />
                                </div>
                            ))
                        }
                        <div>
                            <h3>Additional Comments</h3>
                            <input defaultValue="" {...register("additional_comments")} />
                        </div>

                        <div>
                            <h3>Quantity</h3>
                            <input defaultValue="" {...register("quantity", { required: true, min: product && product._minimum })} />
                        </div>

                        <div>
                            <button onClick={handleSubmit(onSubmitCart)}>Add to Cart</button>
                            <button onClick={handleSubmit(onSubmitQuote)}>Qet Quote</button>
                        </div>

                    </form>
                    {
                        product &&
                        <OrderSummary control={control} defaultJob={MERCHI.toJson(product._defaultJob)} />
                    }
                </div>
            </main>
            <CartFab />
        </>
    )
}