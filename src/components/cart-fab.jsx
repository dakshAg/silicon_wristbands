import { useEffect } from "react";
import { merchi as sdk_merchi } from "merchi_sdk_js";
import React from "react";

export default function CartFab() {
  const MERCHI = sdk_merchi(
    "https://api.staging.merchi.co/",
    "https://websockets.staging.merchi.co/"
  );
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
    <div className="footer position-sticky bottom-0 end-0 me-4 d-flex justify-content-end">
      <a
        className="d-flex align-items-center p-3 bg-primary mb-4 rounded text-white text-decoration-none"
        href="/cart"
      >
        <h5>Cart</h5>
        <span className="badge badge-secondary">
          {cart && cart.cartItems().length}
        </span>
      </a>
    </div>
  );
}
