/*
A general component to handle all types of Variations, and return the custom Component based on the defined Type
*/

import ImageSelect from "./image-select"
import { useForm, useController, UseControllerProps } from "react-hook-form"
import TextInput from "./text-input";
import ColourPicker from "./colour-picker";
import FileUpload from "./file-upload";
export default function VariationHandler(props) {
    const { field, fieldState } = useController(props)

    function onChange(variation_option) {
        //console.log(variation_option._value);
        const variation = variation_field.buildEmptyVariation();
        variation.selectedOptions([variation_option]);
        onUpdate(variation);
    }
    if (props.variation_field.isImageSelectType())
        return <ImageSelect {...props} />
    else if (props.variation_field.isTextType())
        return <TextInput {...props} />
    else if (props.variation_field.isColourPickerType())
        return <ColourPicker {...props} />
    else if (props.variation_field.isFileInput())
        return <FileUpload {...props} />
    return <p>Not Supported Yet</p>
}