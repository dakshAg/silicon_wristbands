export default function ImageSelectDisplay({ variation }) {
    return (
        <p>{variation.variationField.name} :&nbsp;
            {variation.selectedOptions && variation.selectedOptions.map((option) => (
                <span>
                    {option.value}
                </span>
            ))}
        </p>
    );
}