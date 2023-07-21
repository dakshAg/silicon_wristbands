import { useEffect, useState } from "react";
import { merchi as sdk_merchi } from "../../../sdk/javascript/merchi";
import VariationDisplayHandler from "../../components/variant-displays/variation-display-handler";
import React, { useContext } from "react";
import CartItem from "../../components/cart-item";
import { useRouter } from 'next/router'
import update from 'immutability-helper';
import { useForm } from "react-hook-form";
import CartFab from "../../components/cart-fab";

export default function Shipment() {
    const MERCHI = sdk_merchi("https://api.staging.merchi.co/", "https://websockets.staging.merchi.co/");
    const [cart, setCart] = React.useState();
    const router = useRouter()
    const [cartEnt, setCartEnt] = React.useState();
    const { register, handleSubmit, reset } = useForm();

    const embed = {
        receiverAddress: {},
        shipmentGroups:{
            quotes:{},
            selectedQuote:{}
        },
        cartItems: {
            product: {},
            variations: {
                variationField: {}
            }
        }
    }

    function makeMerchiJsEnt(entName, data) {
        const jobEntity = MERCHI.fromJson(new MERCHI[entName](), data);
        return jobEntity;
    }

    function onCartAvailable(cart) {
        //console.log(cart);
        cart.getShipmentGroupsAndQuotes((data) => {
            setCartEnt(data)
            const localEnt = MERCHI.toJson(data)
            //console.log(localEnt)
            setCart(localEnt)
        }, (status, error) => {
            //console.log(error)
        });
    }

    function updateShipmentMethod(index, quote, quoteEnt){
        setCart((c)=>{
            // Update the JSON cart's selectedQuote (preserving everything else)
            const nc = update(c,{
                shipmentGroups:{[index]: {selectedQuote: {$set: quote}}}
            })
            return nc;
        })
        // Just save the new selectedQuote in entity, doesn't need to update the entity
        cartEnt.shipmentGroups()[index].selectedQuote(quoteEnt)
        setCartEnt(cartEnt)
    }

    function updateCart(){
        // Save changes
        //console.log(cartEnt)
        cartEnt.patch((data)=>{
            //console.log(data)
            router.push("/cart/payment")
        },
        (error)=>{
            console.log(error)
        },embed)
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
        } else {

        }
    }, [])

    return (
        <main>
            <h1>Choose your Shipment Method</h1>
            {
                cart && cart.shipmentGroups.map((shipment_group, index) => (
                    <div>
                        <h3>Shipment Group #{shipment_group.id}</h3>
                        {
                            shipment_group.quotes.map((quote, quoteIndex) => (
                                <div className="d-flex gap-2">
                                    {
                                        shipment_group.selectedQuote.id == quote.id &&
                                        <p>Selected</p>
                                    }
                                    <p>{quote.shipmentMethod.name}</p>
                                    <p>{quote.totalCost}</p>
                                    <button onClick={() => {
                                        const qEnt = cartEnt.shipmentGroups()[index].quotes()[quoteIndex]
                                        updateShipmentMethod(index,quote,qEnt)
                                    }}>Choose</button>
                                </div>
                            )
                            )
                        }
                    </div>
                ))
            }
            <button onClick={updateCart}>
                Submit
            </button>
        </main>
    )
}