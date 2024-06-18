import config from "./../config";

import AdminPage from "./../pages/Admin";
import UserPage from "./../pages/Users";
import LoginPage from "./../pages/Auth/Login";
import RegisterPage from "./../pages/Register";

//ADMIN PAGE CHILD
import UsersPage from "./../pages/Admin/Users";
import ProductPage from "./../pages/Admin/Shop/Product";
import CategoryPage from "../pages/Admin/Category";

//USER PAGE PUBLIC CHILD
import HomePage from "./../pages/Users/Home";
import CartPage from "./../pages/Users/Cart";
import ProductsPage from "./../pages/Users/Products";
import NewsPage from "../pages/Users/News";
import SearchPage from "../pages/Users/Search";

//USER PAGE PRIVATE CHILD
import PayPage from "./../pages/Users/Pay";
import ProfilePage from "../pages/Users/Profile";
import SettingsPage from "../pages/Users/Settings";

//Auth Page
import VerifyEmail from "../pages/Auth/VerifyEmail";
import VerifyCode from "./../pages/Register/VerifyCode";
import LogoutPage from "../pages/Auth/Logout";
import ShopPage from "../pages/Admin/Shop";
import SliderPage from "../pages/Admin/Slider";
import HomeManagePage from "../pages/Admin/Home";
import EmployeePositions from "../pages/Admin/Shop/EmployeePositions";
import ProductsManagePage from "../pages/Admin/Products";
import HistoryPage from "../pages/Users/History";

const publicRoutes = [
  { path: config.verify + "/:id/:code", component: VerifyEmail },
  { path: config.login, component: LoginPage },
  {
    path: config.register,
    component: RegisterPage,
  },
  { path: config.registerVerify, component: VerifyCode },

  {
    path: config.users,
    component: UserPage,
    role: [],
    child: [
      { path: config.child.users.cart, component: CartPage },
      {
        path: config.child.users.products + "/:productId",
        component: ProductsPage,
      },
      { path: config.child.users.home, component: HomePage },
      { path: config.child.users.news, component: NewsPage },
      { path: config.child.users.search + "/:queryID", component: SearchPage },
      { path: config.child.users.profile + "/:usid", component: ProfilePage },
    ],
  },
];

const privateRoutes = [
  {
    //ADMIN PAGE
    path: config.manage,
    component: AdminPage,
    role: ["R1", "R2"],
    child: [
      {
        path: config.child.manage.product + "/:id",
        component: ProductPage,
      },
      { path: config.child.manage.products, component: ProductsManagePage },
      { path: config.child.manage.users, component: UsersPage },
      { path: config.child.manage.category, component: CategoryPage },
      { path: config.child.manage.shop, component: ShopPage },
      { path: config.child.manage.slider, component: SliderPage },
      { path: config.child.manage.home, component: HomeManagePage },
      { path: config.child.manage.positions, component: EmployeePositions },
    ],
  },
  {
    path: config.users,
    component: UserPage,
    role: [],
    child: [
      { path: config.child.users.cart, component: CartPage },
      {
        path: config.child.users.products + "/:productId",
        component: ProductsPage,
      },
      { path: config.child.users.home, component: HomePage },
      { path: config.child.users.pay, component: PayPage },
      { path: config.child.users.news, component: NewsPage },
      { path: config.child.users.settings, component: SettingsPage },
      { path: config.logout, component: LogoutPage },
      { path: config.child.users.history, component: HistoryPage },
      { path: config.child.users.search + "/:queryID", component: SearchPage },
      { path: config.child.users.profile + "/:usid", component: ProfilePage },
    ],
  },
];

export { publicRoutes, privateRoutes };
