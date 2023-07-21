export default function TextAreaDisplay({ variation }) {
    return (<p>{variation.variationField.name} : {variation.value}
    </p>);
}