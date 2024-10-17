/*
A general component to handle all types of Variations, and return the custom Component based on the defined Type
*/


import { useForm, useController, UseControllerProps } from "react-hook-form"
import ImageSelectDisplay from "./image-select-display"
import TextInputDisplay from "./text-input-display"
import ColourPickerDisplay from "./colour-picker-display"
import { merchi as sdk_merchi } from "merchi_sdk_js"
import TextAreaDisplay from "./text-area-display"


export default function VariationDisplayHandler(props) {
    const MERCHI = sdk_merchi("https://api.staging.merchi.co/", "https://websockets.staging.merchi.co/");
    function makeMerchiJsEnt(entName, data) {
        const jobEntity = MERCHI.fromJson(new MERCHI[entName](), data);
    
        return jobEntity;
    }

    //console.log(props);
    const variation = makeMerchiJsEnt("Variation", props.variation);
    if (variation.isImageSelectField())
        return <ImageSelectDisplay {...props} />
    else if (variation.isTextField())
        return <TextInputDisplay {...props} />
    else if (variation.isTextAreaField())
        return <TextAreaDisplay {...props} />
    else if (variation.isColourPicker())
        return <ColourPickerDisplay {...props} />
    else if (variation.isFileUpload())
        return <TextInputDisplay {...props} />
    return <p>Not Supported Yet</p>
}