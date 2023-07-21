import { Button } from "reactstrap"
import styles from "./grad-button.module.css"

export default function GradButton({ colour, children }) {
    return (
        <button
            className={`gradient-button ${colour}`}
        >
            {children}
        </button>
    );
}