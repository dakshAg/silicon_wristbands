export default function TextInputDisplay({ variation }) {
    return (<p>{variation.variationField.name} : {variation.value}
    </p>);
}