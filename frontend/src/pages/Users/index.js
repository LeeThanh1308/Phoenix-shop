import Header from "../../Layout/components/Header";
import { Outlet } from "react-router-dom";
import FooterPage from "../../Layout/components/Footer";
import UserDataProvider from "../../hooks/useContext/UserDataContext";
import CartProvider from "../../hooks/useContext/CartContext";

function UsersPage() {
  return (
    <CartProvider>
      <UserDataProvider>
        <div className="w-full h-full mt-20 bg-white">
          {/* Header */}
          <div>
            <Header />
          </div>
          <div className="2xl:w-4/6 xl:w-2/3 lg:w-11/12 max-sm:mx-1 min-h-screen overflow-hidden 2xl:mx-auto xl:mx-auto md:mx-auto lg:mx-auto drop-shadow-md">
            <Outlet />
          </div>
          <div className="w-full pb-24 bg-black/95">
            <div className="sm:w-4/6 mx-auto">
              <FooterPage />
            </div>
          </div>
        </div>
      </UserDataProvider>
    </CartProvider>
  );
}

export default UsersPage;
