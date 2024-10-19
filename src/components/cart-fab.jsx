import { useEffect } from "react";
import MERCHI from "../app/merchi"
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

export default function CartFab() {
  const [cart, setCart] = React.useState();

  useEffect(() => {
    if (localStorage.getItem("cart")) {
      const { id, token } = JSON.parse(localStorage.getItem("cart"));
      const c = new MERCHI.Cart();
      c.id(id);
      c.token(token);
      c.get(
        (data) => setCart(data),
        (error) => console.log(error),
        { cartItems: {}, client: {} }
      );
    }
  }, []);

  return (
    <div className="position-sticky bottom-0 end-0 d-flex justify-content-end mr-4">
      <a
        className="d-flex align-items-center btn btn-lg btn-blue"
        href="/cart"
      >
        <FontAwesomeIcon icon={faShoppingCart} />
        <span className="badge badge-secondary">
          {cart && cart.cartItems().length}
        </span>
      </a>
    </div>
  );
}
