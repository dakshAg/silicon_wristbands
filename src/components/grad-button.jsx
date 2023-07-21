import { Button } from "reactstrap"

export default function GradButton({ colour, children }) {
    return (
        <button
            className={`p-3 rounded border-dark shadow-sm ${colour}`}
        >
            {children}
        </button>
    );
}