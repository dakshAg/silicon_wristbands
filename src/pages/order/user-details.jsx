import { merchi as sdk_merchi } from "../../../sdk/javascript/merchi";
import { useForm, useFieldArray, Controller } from "react-hook-form"
import '../../app/globals.css'
import { TextField, Select, MenuItem, Button } from "@mui/material";
import { countryPhoneCodes } from "../../utils/country-codes";
import { JobContext } from "../_app";
import { useRouter } from 'next/router'
import { useContext } from "react";
import CartFab from "../../components/cart-fab";


export default function Home(props) {
    const MERCHI = sdk_merchi("https://api.staging.merchi.co/", "https://websockets.staging.merchi.co/");
    const router = useRouter();

    function redirect(){
        const p = router.query.p;
        if(p=="quote"){
            router.push('/order/quote');
        }else{
            router.push('/order/add-to-cart');
        }
    }

    const {
        register,
        setValue,
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm({ shouldUnregister: false, });

    function findUser(email, full_data) {
        MERCHI.getUserIdByEmail(email, (data) => {
            // console.log(data);
            localStorage.setItem("user", data.user_id);
            redirect();
        }, (status, data) => {
            console.log(`Error ${status}: ${data}`);
            createUser(full_data);
        })    
    }

    function createUser(data) {
        const em = new MERCHI.EmailAddress();
        em.emailAddress(data.email);

        const phn = new MERCHI.PhoneNumber();
        phn.number(data.phn_number);
        phn.code(data.country_code);

        const user = new MERCHI.User();
        user.name(data.name);
        user.emailAddresses([em]);
        user.phoneNumbers([phn]);
        user.publicCreate(
            (response) => {
                const u = MERCHI.toJson(response);
                // console.log(u);
                localStorage.setItem("user", u.id);
                redirect();
            },
            (status, data) => console.log(`Error ${status}: ${data}`)
        )
    }

    const onSubmit = (data) => {
        findUser(data.email, data);
    }

    const countryCodes = Object.entries(countryPhoneCodes);

    return (
        <main className="mx-20 mt-20">
            <h1>A Quick Few Details about you</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 w-1/2">
                <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <TextField id="outlined-basic" onChange={onChange} label="Name" variant="outlined" />
                    )}
                />

                <div className="d-flex gap-3">
                    <Controller
                        control={control}
                        name="country_code"
                        className="flex-fill"
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Country Code"
                                onChange={onChange}
                            >
                                {countryCodes.map((cc) => (
                                    <MenuItem value={cc[0]} key={cc[1].code}>{cc[1].text}</MenuItem>
                                ))}

                            </Select>
                        )}
                    />
                    <Controller
                        control={control}
                        className="flex-fill"
                        name="phn_number"
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                            <TextField id="outlined-basic" onChange={onChange} label="Phone Number" variant="outlined" />
                        )}
                    />

                </div>



                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <TextField id="outlined-basic" onChange={onChange} label="Email" variant="outlined" />
                    )}
                />

                <Button variant="contained" type="submit" >Next</Button>
            </form>

            <CartFab/>
        </main>
    )
}