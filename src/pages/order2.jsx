import { useForm } from "react-hook-form"
import { merchi as sdk_merchi } from "../../sdk/javascript/merchi";
import React from "react";
import '../app/globals.css'

export default function Home({ props }) {
const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
} = useForm();

const [products, setProducts] = React.useState(null);

const gotProducts = (ps) => {
    //console.log(ps);
    setProducts(ps);
};

const errorProducts = () => { };

const MERCHI = sdk_merchi("https://api.staging.merchi.co/", "https://websockets.staging.merchi.co/");
    
React.useEffect(() => {
    MERCHI.products.get(gotProducts, errorProducts, {
        publicOnly: true,
        inDomain:9,
        embed:{
            groupVariationFields:{},
            independentVariationFields:{},
            featureImage:{}
        }
    });
}, []);

const onSubmit = (data) => console.log(data);

console.log(watch("example")); // watch input value by passing the name of it

return (
    <main>
        <div className="container">
            <form onSubmit={handleSubmit(onSubmit)}>
                <h3>Choose a Wristband</h3>
                <p>Please select a wristband type from the options below</p>
                <div>

                </div>

                <h3>Choose a Style</h3>
                <p>Please select a wristband style from the options below</p>
                <div>

                </div>

                <h3>Choose a Size</h3>
                <p>Please select the size of wristband</p>
                <div>

                </div>

                <h3>Quantity</h3>
                <input defaultValue="100" {...register("quantity")} />

                <h3>Wristband Text</h3>
                <input defaultValue="" {...register("wristband_text")} />

                <h3>Additional Comments</h3>
                <input defaultValue="" {...register("additional_comments")} />

                {/* register your input into the hook by invoking the "register" function */}
                <input defaultValue="test" {...register("example")} />

                {/* include validation with required or other standard HTML validation rules */}
                <input {...register("exampleRequired", { required: true })} />
                {/* errors will return when field validation fails  */}
                {errors.exampleRequired && <span>This field is required</span>}
                <div className="grid_container">
                    {products && products.map((product) => (
                        <div className="grid_item">
                            <img src={product.productPrimaryImage()} alt="" />
                            <h4>{product._name}</h4>
                            <p>{product.description}</p>
                        </div>
                    ))}
                </div>
                <input type="submit" />
            </form>
        </div>
    </main>
)
}