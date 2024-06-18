import { createContext, useState } from "react";

export const UserDataContext = createContext();
function UserDataProvider({ children }) {
  const [reRenderUser, setReRenderUser] = useState(false);

  return (
    <UserDataContext.Provider value={{ reRenderUser, setReRenderUser }}>
      {children}
    </UserDataContext.Provider>
  );
}

export default UserDataProvider;
