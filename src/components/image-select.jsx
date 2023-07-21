import { useForm, useController, UseControllerProps } from "react-hook-form"
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './image-select.module.css'

export default function ImageSelect(props) {
    const variation_field = props.variation_field;
    const variation_options = variation_field._options;
    console.log(variation_options);

    const { field, fieldState } = useController(props);

    function onImageSelect(variation_option) {
        console.log(variation_option._value);

    }
    return (
        <>
            <div className={styles.info_banner}>
                <h4>{variation_field._name}</h4>
                <p>{variation_field._placeholder}</p>
            </div>

            <div className="d-flex flex-wrap align-items-center">
                {
                    variation_options.map((variation_option) => (
                        <label className={styles.container} key={variation_option._id} onClick={(e) => {
                            onImageSelect(variation_option)
                        }}>
                            <input className={styles.inp} type="radio" id="html" {...field} value={variation_option._id}></input>
                            <span className={styles.checkmark}>
                                <img src={variation_option._linkedFile._viewUrl} alt="" />
                                <h4>{variation_option._value}</h4></span>
                        </label>
                    ))
                }
            </div>
        </>
    )
}