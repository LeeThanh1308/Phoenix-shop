const routes = {
  users: "/",
  manage: "/manage",
  login: "/login",
  register: "/signup",
  registerVerify: "/signup/verify",
  verify: "/verify",
  logout: "/logout",

  child: {
    manage: {
      home: "",
      users: "users",
      products: "products",
      category: "category",
      shop: "shop",
      positions: "shop/chuc-vu",
      product: "shop/product",
      slider: "slider",
    },
    users: {
      home: "/",
      cart: "/cart",
      products: "/products",
      history: "/history",
      pay: "/pay",
      news: "/news",
      search: "/search",
      posts: "/posts",
      settings: "/settings",
      profile: "/profile",
    },
  },
};

export default routes;
