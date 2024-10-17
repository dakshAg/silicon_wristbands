import VariationDisplayHandler from "./variant-displays/variation-display-handler";
import { merchi as sdk_merchi } from "merchi_sdk_js";
import { useRouter } from 'next/router'

export default function CartItem({ cart_item, modify }) {

    const MERCHI = sdk_merchi("https://api.staging.merchi.co/", "https://websockets.staging.merchi.co/");

    const { id, token } = JSON.parse(localStorage.getItem("cart"));

    const router = useRouter()

    function makeMerchiJsEnt(entName, data) {
        const jobEntity = MERCHI.fromJson(new MERCHI[entName](), data);
        return jobEntity;
    }

    function deleteItem() {
        const cartItemEnt = makeMerchiJsEnt("CartItem", cart_item)
        cartItemEnt.cart(new MERCHI.Cart().id(id).token(token))

        cartItemEnt.destroy((data) => {
            //console.log(data)
        }, (error) => {
            console.log(error)
        })
    }

    function editItem(){
        router.push(`cart/edit/${cart_item.id}`);
    }

    return (
        <div>
            {cart_item.product.name}
            {cart_item.variations.map((v) => (
                <VariationDisplayHandler variation={v} />
            ))}
            <h5>
                {cart_item.currency} {cart_item.totalCost}
            </h5>
            {
                modify &&
                <>
                    <button onClick={deleteItem}>Delete</button>
                    <button onClick={editItem}>Edit</button>
                </>
            }

        </div>
    );
}