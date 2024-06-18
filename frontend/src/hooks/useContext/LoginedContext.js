import { createContext, useState } from "react";
import Cookies from "js-cookie";

export const LoginedContext = createContext();

function LoginedProvider({ children }) {
  const Logined = Cookies.get("Logined");
  const [statusLogined, setStatusLogined] = useState(Logined ? true : false);
  return (
    <LoginedContext.Provider value={{ statusLogined, setStatusLogined }}>
      {children}
    </LoginedContext.Provider>
  );
}

export default LoginedProvider;
