import { useEffect, useState } from "react";
import { merchi as sdk_merchi } from "../../../sdk/javascript/merchi";
import VariationDisplayHandler from "../../components/variant-displays/variation-display-handler";
import React, { useContext } from "react";
import CartItem from "../../components/cart-item";
import MERCHI from "../../app/merchi";
import { useRouter } from 'next/router'
import { useForm } from "react-hook-form";
import { makeMerchiJsEnt } from "../../utils/entity-resolver";
import CartFab from "../../components/cart-fab";

export default function Cart() {
    const [cart, setCart] = React.useState();// Simple JSON
    const [cartEnt, setCartEnt] = React.useState(); //Merchi Class Entity
    const router = useRouter()
    const { register, handleSubmit, reset } = useForm();
    const embed = {
        receiverAddress:{},
        client:{},
        cartItems: {
            product: {},
            variations: {
                variationField: {}
            }
        }
    }

    function createCart() {
        const domain = new MERCHI.Domain().id(9);
        const ccart = new MERCHI.Cart();
        //ccart.client(user)
        ccart.domain(domain)
        ccart.create((response) => {
            setCartEnt(response)
            const c = MERCHI.toJson(response);
            //console.log(c);
            setCart(c)
            localStorage.setItem("cart", JSON.stringify({ id: c.id, token: c.token }))
            addItemToCart(c)
        },
            (status, data) => console.log(`Error ${status}: ${data}`),
            embed
            )
    }

    function onAddressSubmit(data){
        console.log("Address Submit")
        const address = makeMerchiJsEnt("Address",data)
        cartEnt.receiverAddress(address)
        cartEnt.patch(()=>{
            router.push("/cart/shipment")
        },
        (error)=>{
            console.log(error)
        })
    }

    // Fetch the cart based in local storage id and token
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("cart"));
        if (data) {
            const c = new MERCHI.Cart()
            c.id(data.id)
            c.token(data.token)
            c.get((data) => {
                setCartEnt(data)
                setCart( MERCHI.toJson(data))
                const availableAddress = MERCHI.toJson(data._receiverAddress)
                //console.log(availableAddress)
                reset(availableAddress) // Show the address in the Input
                //console.log(data)
            },
                (error) => console.log(JSON.stringify(error))
                , embed)
        } else {
            createCart()
        }
    }, [])

    return (
        <div>
            <h1>Cart</h1>
            {cart &&
                <>
                    {
                        cart.cartItems.map((cart_item) => (
                            <CartItem cart_item={cart_item} modify={true}/>
                        ))
                    }
                    <h3>Total Cart Amount: {cart.currency} {cart.totalCost}</h3>
                </>
            }
            
            <div>
                <h4>Shipping Address</h4>
                <form className="d-flex flex-column gap-3" onSubmit={handleSubmit(onAddressSubmit)}>
                    <input type="text" placeholder="Address Line 1" {...register("lineOne")}/>
                    <input type="text" placeholder="Address Line 2" {...register("lineTwo")}/>
                    <input type="text" placeholder="City" {...register("city")}/>
                    <input type="text" placeholder="State" {...register("state")}/>
                    <input type="text" placeholder="Country" {...register("country")}/>
                    <input type="text" placeholder="Postcode" {...register("postcode")}/>
                    <button type="submit">Choose Shipping Method</button>
                </form>
            </div>

            
            <CartFab/>
        </div>
    )
}