import { JobContext } from "../_app";
import { merchi as sdk_merchi } from "../../../sdk/javascript/merchi";
import React, { useContext } from "react";
import VariationDisplayHandler from "../../components/variant-displays/variation-display-handler";
import { useRouter } from 'next/router'
import CartFab from "../../components/cart-fab";


export default function Home(props) {
    const MERCHI = sdk_merchi("https://api.staging.merchi.co/", "https://websockets.staging.merchi.co/");
    const [user, setUser] = React.useState()
    const [cart, setCart] = React.useState()
    const { job, setJob } = useContext(JobContext);
    const [jobQuote, setJobQuote] = React.useState(null);
    const router = useRouter()

    // console.log(user)
    // console.log(job)

    function makeMerchiJsEnt(entName, data) {
        const jobEntity = MERCHI.fromJson(new MERCHI[entName](), data);
        return jobEntity;
    }

    function placeOrder(e) {
        const domain = new MERCHI.Domain().id(9)
        // console.log(user)
        const jobEntity = makeMerchiJsEnt("Job", job)
        jobEntity.costPerUnit(null);
        jobEntity.cost(null)
        jobEntity.taxAmount(null)
        jobEntity.domain(domain)
        jobEntity.client(user)
        jobEntity.cost(null)
        // console.log(jobEntity)
        jobEntity.publicCreate((data) => {
            // console.log(data)
            router.push("/order/placed")
        }, (error) => console.log(error))
    }

    React.useEffect(() => {
        if (job) {
            MERCHI.getJobQuote(
                makeMerchiJsEnt("Job", job),
                (data) => {
                    // console.log(data)
                    setJobQuote(data)
                },
                (e) => {
                    console.error(e);
                }
            );
        }

        const user = new MERCHI.User().id(localStorage.getItem("user"))
        setUser(user)
    }, [])

    return (
        <main>
            <h1>Confirm - Quote Summary</h1>

            {/*user &&
                <div>
                    <h3>Customer Details</h3>
                    <p>{user.name}</p>
                    <p>{user.phoneNumbers && user.phoneNumbers.map((phnNumber) => (
                        <span>{phnNumber.localFormatNumber}</span>
                    ))}</p>
                    <p>{user.emailAddresses && user.emailAddresses.map((email) => (
                        <span>{email.emailAddress}</span>
                    ))}</p>
                </div>

                    */}

            <div>
                <h3>Order Summary</h3>
                {jobQuote &&
                    <div>
                        {jobQuote.variations.map((variation) => (
                            <VariationDisplayHandler variation={variation}></VariationDisplayHandler>
                        ))}

                        <h3>TOTAL: {jobQuote.currency} {jobQuote.totalCost}</h3>
                    </div>
                }
            </div>

            <button onClick={placeOrder}>Place Order</button>

            <CartFab/>
        </main>
    )
}