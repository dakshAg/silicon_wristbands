import { useEffect, useState } from "react";
import { merchi as sdk_merchi } from "../../../sdk/javascript/merchi";
import VariationDisplayHandler from "../../components/variant-displays/variation-display-handler";
import React, { useContext } from "react";
import CartItem from "../../components/cart-item";
import { useRouter } from 'next/router'
import update from 'immutability-helper';
import { useForm } from "react-hook-form";
import Stripe from "stripe";
import CartFab from "../../components/cart-fab";
import { createPaymentIntent } from "../../utils/payment-helper";

export default function Payment() {
    const MERCHI = sdk_merchi("https://api.staging.merchi.co/", "https://websockets.staging.merchi.co/");
    const [cart, setCart] = React.useState();
    const router = useRouter()
    const [cartEnt, setCartEnt] = React.useState();

    const embed = {
        receiverAddress: {},
        shipmentGroups: {
            quotes: {},
            selectedQuote: {
                shipmentMethod:{}
            }
        },
        invoice:{},
        cartItems: {
            product: {},
            variations: {
                variationField: {}
            }
        }
    }

    async function payNow() {
        const stripe = Stripe("sk_test_wsFx86XDJWwmE4dMskBgJYrt")
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: cart.currency,
                        product_data: {
                            name: 'Merch',
                        },
                        unit_amount_decimal: Math.round(cart.totalCost * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'http://localhost:3000/cart/payment-success',
            cancel_url: 'http://localhost:3000/cart/payment-failed',
        });

        router.push(session.url);
    }

    function onCartAvailable(cart) {
        //console.log(cart);
        setCartEnt(cart)
        const localEnt = MERCHI.toJson(cart)
        //console.log(localEnt)
        setCart(localEnt)
    }

    function makeMerchiJsEnt(entName, data) {
        const jobEntity = MERCHI.fromJson(new MERCHI[entName](), data);
        return jobEntity;
    }

    useEffect(() => {
        const { id, token } = JSON.parse(localStorage.getItem("cart"));
        if (id) {
            const c = new MERCHI.Cart()
            c.id(id)
            c.token(token)
            c.get(onCartAvailable,
                (error) => console.log(error)
                , embed)
        }
        createPaymentIntent(token,id,(success)=>{console.log(success),(error)=>{console.log(error)}})
    }, [])

    return (
        <main>
            <div>
                <h1>Order Summary</h1>
                {cart &&
                    <>
                        {
                            cart.cartItems.map((cart_item) => (
                                <CartItem cart_item={cart_item} />
                            ))
                        }
                        <h2>Shipment</h2>
                        {
                            cart && cart.shipmentGroups.map((shipment_group, index) => (
                                <div>
                                    <h3>Shipment Group #{shipment_group.id}</h3>
                                    {shipment_group.selectedQuote.name}
                                    {shipment_group.selectedQuote.totalCost}
                                </div>
                            ))
                        }
                        <h3>Total Cart Amount: {cart.currency} {cart.totalCost}</h3>
                    </>
                }
                <button onClick={payNow}>Pay Now</button>
            </div>
        </main>
    )
}