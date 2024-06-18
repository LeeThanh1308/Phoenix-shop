import { createContext, useState } from "react";

export const CartContext = createContext();
function CartProvider({ children }) {
  const [reRender, setRender] = useState(false);
  const handleSetReder = () => {
    setRender(!reRender);
  };
  return (
    <CartContext.Provider value={{ reRender, handleSetReder }}>
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;
