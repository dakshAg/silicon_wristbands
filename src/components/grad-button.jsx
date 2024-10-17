import { Button } from "reactstrap"

export default function GradButton({ colour, children }) {
    return (
        <button
            className={`gradient-button ${colour}`}
        >
            {children}
        </button>
    );
}