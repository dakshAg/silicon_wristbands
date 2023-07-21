import * as React from "react"
import { useForm, useController, UseControllerProps } from "react-hook-form"
import styles from './image-select.module.css'


export default function ColourPicker(props) {
  const { field, fieldState } = useController(props);
  const variation_field = props.variation_field;

  return (
    <div>
      <div className={styles.info_banner}>
                <h4>{variation_field._name}</h4>
                <p>{variation_field._placeholder}</p>
            </div>
      <input {...field} placeholder={props.name} type="color" />
    </div>
  )
}