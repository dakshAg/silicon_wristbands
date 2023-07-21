export default function ColourPickerDisplay({ variation }) {
    return (
        <div className="d-flex">
            <p>{variation.variationField.name} :</p>
            <div style={{ background: variation.value, height: 20, width: 30}} className="ml-2">
            </div>
        </div>
    );
}