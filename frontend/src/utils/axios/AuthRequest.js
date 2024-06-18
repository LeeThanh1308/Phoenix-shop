import axios from "axios";
import Cookies from "js-cookie";
import Toastify from "../../components/Toast";

const AuthRequest = axios.create({
  baseURL: process.env.REACT_APP_DOMAIN_API,
});

const refreshToken = (config) => {
  return new Promise(async (resolve, reject) => {
    axios
      .post(`${process.env.REACT_APP_DOMAIN_API}accounts/refresh`, null, {
        withCredentials: true,
      })
      .then((response) => (response?.status === 200 ? response?.data : null))
      .then(async (data) => {
        if (data?.accessToken) {
          Cookies.set("Token", data?.accessToken, {
            sameSite: "Strict",
            expires: (1 / 24 / 60 / 60) * data?.exp,
          });
          config.headers.Authorization = "Bearer " + data?.accessToken;
          return resolve(config);
        }
      })
      .catch((e) => {
        if (e?.response?.status === 403) {
          Toastify(0, "Phiên đăng nhập đã hết hạn vui lòng đăng nhập lại.");
          Cookies.remove("Token");
          Cookies.remove("Logined");
          window.location.assign("/");
        }
        reject(config);
      });
  });
};

AuthRequest.interceptors.request.use(
  async function (config) {
    // Do something before request is sent

    const Token = Cookies.get("Token");
    const Logined = Cookies.get("Logined");
    if (Logined && !Token) {
      return await refreshToken(config);
    } else {
      config.headers.Authorization = "Bearer " + Token;
      return config;
    }
  },
  function (error) {
    // Do something with request error

    return Promise.reject(error);
  }
);

// Add a response interceptor
AuthRequest.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response;
  },
  async function (error) {
    // Do something with response error
    "-----------------------------------Auth Error Response-----------------------------------------------";
    // if (error?.response?.status === 403) {
    //   Toastify(0, "Phiên đăng nhập đã hết hạn vui lòng đăng nhập lại.");
    //   Cookies.remove("Token");
    //   Cookies.remove("Logined");
    //   window.location.assign("/");
    return Promise.reject(error);
    // } else if (error.response) {
    //   Toastify(
    //     3,
    //     error?.response?.data?.message ||
    //       "Có lỗi xảy ra xin vui lòng thử lại sau"
    //   );
    //   return Promise.reject(error);
    // }
  }
);

export default AuthRequest;
