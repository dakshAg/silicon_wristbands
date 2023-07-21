import { useEffect, useState } from "react";
import { merchi as sdk_merchi } from "../../../sdk/javascript/merchi";
import VariationDisplayHandler from "../../components/variant-displays/variation-display-handler";
import React, { useContext } from "react";
import CartItem from "../../components/cart-item";
import { useRouter } from 'next/router'
import update from 'immutability-helper';
import { useForm } from "react-hook-form";
import CheckoutForm from "../../components/checkout-form";
import Stripe from "stripe";
import CartFab from "../../components/cart-fab";
import { Elements } from '@stripe/react-stripe-js';
import { createPaymentIntent } from "../../utils/payment-helper";
import { loadStripe } from '@stripe/stripe-js';


export default function Payment() {
    const MERCHI = sdk_merchi("https://api.staging.merchi.co/", "https://websockets.staging.merchi.co/");
    const [cart, setCart] = React.useState(); // Simple JSON
    const router = useRouter()
    const [cartEnt, setCartEnt] = React.useState(); // Merchi Entity
    const [options, setOptions] = React.useState()
    const [stripePromise, setStripePromise] = React.useState()

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
                domain:{
                    company:{}
                }
            },
            variations: {
                variationField: {}
            }
        }
    }

    function onCartAvailable(cart) {
       // console.log(cart);
        setCartEnt(cart)
        const localEnt = MERCHI.toJson(cart)
        //console.log(localEnt)
        setCart(localEnt)
        const stripePK = localEnt.cartItems[0].product.domain.company.stripePublishableKey
        //console.log(stripePK)
        setStripePromise(loadStripe(stripePK))
    }

    useEffect(() => {
        const { id, token } = JSON.parse(localStorage.getItem("cart"));
        if (id) {
            const c = new MERCHI.Cart()
            c.id(id)
            c.token(token)
            c.get(onCartAvailable,
                (error) => console.log(error)
                , embed);

            createPaymentIntent(token, id, (data) => {
                const opt = {
                    // passing the client secret obtained from the server
                    clientSecret: data.stripeClientSecret,
                };
                setOptions(opt)
                //console.log(data)
            }, (error) => { console.log(error) })
        } else {

        }
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
                        {
                            options && stripePromise &&
                            <Elements stripe={stripePromise} options={options}>
                                <CheckoutForm />
                            </Elements>
                        }

                        <h3>Total Cart Amount: {cart.currency} {cart.totalCost}</h3>
                    </>
                }
            </div>
        </main>
    )
}