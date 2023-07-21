import * as React from "react"
import { useForm, useController, UseControllerProps } from "react-hook-form"
import styles from './image-select.module.css'


export default function TextInput(props) {
  const variation_field = props.variation_field;
  const variation_options = variation_field.options();
  //console.log(variation_options);
  const { field, fieldState } = useController(props);

  return (
    <div>
      <div className={styles.info_banner}>
                <h4>{variation_field.name()}</h4>
                <p>{variation_field.placeholder()}</p>
            </div>
      <input {...field} />
    </div>
  )
}