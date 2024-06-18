import { useEffect, useState } from "react";
import Loading from "../../../components/Loading";
import AuthRequest from "../../../utils/axios/AuthRequest";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Toastify from "../../../components/Toast";

function LogoutPage() {
  const [isLoading, setIsLoading] = useState(true);
  const Navigate = useNavigate();
  useEffect(() => {
    setIsLoading(true);
    AuthRequest.get("accounts/logout")
      .then((res) => (res.status === 200 ? res.data : null))
      .then((data) => {
        if (data) {
          Toastify(1, data.message);
          Navigate("/");
          window.location.reload();
          localStorage.clear();
          Cookies.remove("Token");
          Cookies.remove("Logined");
        }
      })
      .catch((err) => {
        const message = err?.response?.data?.message;
        Toastify(3, message || "Có lỗi sảy ra vui lòng thử lại sau!");
        Navigate("/");
      });
  }, []);
  return <Loading status={isLoading} />;
}

export default LogoutPage;
