import { useEffect, useState } from "react";
import { merchi as sdk_merchi } from "../../../sdk/javascript/merchi";
import VariationDisplayHandler from "../../components/variant-displays/variation-display-handler";
import { JobContext } from "../_app";
import React, { useContext } from "react";
import { useRouter } from "next/router";
import CartFab from "../../components/cart-fab";

export default function AddToCart() {
    const MERCHI = sdk_merchi("https://api.staging.merchi.co/", "https://websockets.staging.merchi.co/");
    const [cart, setCart] = useState()
    const [cartEnt, setCartEnt] = useState()
    const { job, setJob } = useContext(JobContext);
    const [jobQuote, setJobQuote] = React.useState(null);
    const router = useRouter();


    // Standard Embed for cart fetching
    const embed = {
        receiverAddress: {},
        shipmentGroups: {
            quotes: {},
            selectedQuote: {
                shipmentMethod: {}
            }
        },
        client: {},
        cartItems: {
            product: {
                domain: {
                    company: {}
                }
            },
            variations: {
                variationField: {}
            }
        }
    }

    function makeMerchiJsEnt(entName, data) {
        const jobEntity = MERCHI.fromJson(new MERCHI[entName](), data);
        return jobEntity;
    }

    function createCart() {
        const domain = new MERCHI.Domain().id(9);
        const ccart = new MERCHI.Cart();
        //ccart.client(user)
        ccart.domain(domain)
        ccart.create((response) => {
            setCartEnt(response)
            const c = MERCHI.toJson(response)
            console.log("Cart Created")
            setCart(c)
            localStorage.setItem("cart", JSON.stringify({ id: c.id, token: c.token }))
            addClientToCart(response)
        },
            (status, data) => console.log(`Error ${status}: ${data}`))
    }

    function addClientToCart(cartEnt) {
        const user = new MERCHI.User().id(localStorage.getItem("user"))
        cartEnt.client(user)
        cartEnt.patch((data) => {
            //console.log(`Cart Patched with Client ${data}`)
        },
            (error) => {
                console.log(error)
            }, embed)
    }

    function addItemToCart() {
        const cart_item = new MERCHI.CartItem()
        cart_item.quantity(job.quantity)
        cart_item.product(makeMerchiJsEnt("Product", job.product))
        cart_item.currency(job.currency)
        const variationEntities = job.variations.map((v) => makeMerchiJsEnt("Variation", v))
        cart_item.variations(variationEntities)

        cartEnt.cartItems([...cartEnt.cartItems(), cart_item])

        
        cartEnt.patch((response) => {
            //console.log(response)
            router.push('/cart');
        },
            (status, data) => console.log(`Error ${status}: ${data}`), undefined, 9)
    }



    React.useEffect(() => {
        //console.log(`Job: ${job}`)
        if (job) {
            MERCHI.getJobQuote(
                makeMerchiJsEnt("Job", job),
                (data) => {
                    //console.log(data)
                    setJobQuote(data)
                },
                (e) => {
                    console.error(e);
                }
            );
        }
    }, [])

    useEffect(() => {
        const storedCart = localStorage.getItem("cart")
        if (storedCart) {
            const { id, token } = JSON.parse(storedCart);
            const c = new MERCHI.Cart()
            c.id(id)
            c.token(token)
            c.get((data) => {
                setCartEnt(data)
                const jsonCart = MERCHI.toJson(data)
                setCart(jsonCart)
                //console.log(`Client: ${jsonCart.client}`)
                if (jsonCart.client === undefined) {
                    console.log("Cart has no Client. Adding")
                    addClientToCart(data)
                } else {
                    console.log("Cart has Client")
                }
            },
                (error) => console.log(error)
                , embed)
        } else {
            createCart()
        }
    }, [])
    return (
        <main>
            <div>
                <h1>Review Job</h1>
                {jobQuote && <div>
                    {jobQuote.variations.map((variation) => (
                        <VariationDisplayHandler variation={variation}></VariationDisplayHandler>
                    ))}

                    <h3>TOTAL: {jobQuote.currency} {jobQuote.totalCost}</h3>
                </div>}
                <button onClick={addItemToCart}>Add to Cart</button>
            </div>
            <CartFab />
        </main>
    )
}