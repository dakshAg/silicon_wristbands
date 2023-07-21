import { useRouter,useContext } from 'next/router'
import React from "react";
import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form"
import CartFab from '../../../components/cart-fab';
import VariationHandler from '../../../components/variation-handler';
import TopBar from '../../../components/top-bar';
import CartItemSummary from '../../../components/cart-item-summary';
import { makeMerchiJsEnt } from '../../../utils/entity-resolver';
import { merchi as sdk_merchi } from "../../../../sdk/javascript/merchi";

export default function EditCartItem(){
    const {
        register,
        setValue,
        handleSubmit,
        reset,
        control,
        watch,
        formState: { errors },
    } = useForm({ shouldUnregister: false, })

    const router = useRouter()

    const [cartItem, setCartItem] = React.useState(null);
    const [cartItemEnt, setCartItemEnt] = React.useState(null);

    const { fields, replace } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "variations", // unique name for your Field Array
        keyName: "faux_id"
    });

    const MERCHI = sdk_merchi("https://api.staging.merchi.co/", "https://websockets.staging.merchi.co/");


    useEffect(() => {
        const cartItemId = router.query.id

        if(cartItemId==null){
            console.log("No Item Id")
            return;
        }
        const cartItem = new MERCHI.CartItem();
        //console.log(`Id : ${cartItemId}`)
        cartItem.id(cartItemId);

        const { id, token } = JSON.parse(localStorage.getItem("cart"));
        const c = new MERCHI.Cart().id(id).token(token)
        cartItem.cart(c)

        cartItem.get(
            (p) => {
                //console.log(p)
                const ci = MERCHI.toJson(p)
                //console.log(ci)

                setCartItem(ci)
                setCartItemEnt(p)
                replace(MERCHI.toJsonList(p.variations()))
                reset(ci)
            },
            (error) => {console.log(error)},
            {
                variations:{},
                product:{
                    independentVariationFields:{
                        options:{
                            linkedFile:{}
                        }
                    }
                }
            }
        );
    }, [router])


    const onSubmitQuote = (data) => {
        let mergedJob = { ...MERCHI.toJson(product._defaultJob), ...data }
        setJob(mergedJob)
        //console.log(mergedJob)
        router.push('/order/user-details?p=quote')
    }

    const onSubmitCart = (data) => {
        const slimCartItem = new MERCHI.CartItem()
        const { id, token } = JSON.parse(localStorage.getItem("cart"));
        slimCartItem.cart(new MERCHI.Cart().id(id).token(token))
        slimCartItem.quantity(data.quantity)
        slimCartItem.id(data.id)
        const variationEntities = data.variations.map((v) => makeMerchiJsEnt("Variation", v))
        slimCartItem.variations(variationEntities)
        slimCartItem.patch((data)=>{
            //console.log(data)
            router.push('/cart')
        },(error)=>{
            console.log(error)
        })
    }

    return (
        <>
            <TopBar/>
            <main>
                <div>
                    <form>
                        <h1>{cartItem ? cartItem.name : "No Product"}</h1>

                        {
                            fields.map((field, index) => (
                                <div key={field.faux_id}>
                                    <VariationHandler variation_field={cartItemEnt?.product().independentVariationFields()[index]} name={`variations[${index}].value`} control={control} />
                                </div>
                            ))
                        }
                        <div>
                            <h3>Additional Comments</h3>
                            <input {...register("additional_comments")} />
                        </div>

                        <div>
                            <h3>Quantity</h3>
                            <input {...register("quantity")} />
                        </div>

                        <div>
                           <button onClick={handleSubmit(onSubmitCart)}>Save Changes</button>
                        </div>

                    </form>
                    {
                        cartItem &&
                        <CartItemSummary control={control} cart_item={cartItemEnt} />
                    }
                </div>
            </main>
            <CartFab/>
        </>
    )
}