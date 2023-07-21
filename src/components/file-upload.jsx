import React from "react";
import { useForm, useController, UseControllerProps } from "react-hook-form"
import styles from './image-select.module.css'


export default function FileUpload(props) {
  const { field, fieldState } = useController(props);
  const variation_field = props.variation_field;

  const [file, setFile] = React.useState();
    function handleChange(e) {
        //console.log(e.target.files);
        setFile(URL.createObjectURL(e.target.files[0]));
    }

  return (
    <div>
      <div className={styles.info_banner}>
                <h4>{variation_field.name()}</h4>
                <p>{variation_field.placeholder()}</p>
            </div>
      <input {...field} placeholder={props.name} type="file" onChange={handleChange} />
      <img src={file} style={{height: 200}} />
    </div>
  )
}