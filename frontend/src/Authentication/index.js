import { useContext, useEffect, useState } from "react";
import Loading from "../components/Loading";
import AuthRequest from "../utils/axios/AuthRequest";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Toastify from "../components/Toast";
import { LoginedContext } from "../hooks/useContext/LoginedContext";

function Authentication({ role, children }) {
  const [isLoading, setIsLoading] = useState(true);
  const { setStatusLogined } = useContext(LoginedContext);
  const navigate = useNavigate();
  useEffect(() => {
    //ClassApi
    AuthRequest.post("accounts/permissions", { access: role })
      .then((response) => {
        if (response.status === 200) {
          setIsLoading(false);
        }
      })
      .catch((e) => {
        if (e.response.status === 403) {
          setStatusLogined(false);
          Cookies.remove("Token");
          Cookies.remove("Logined");
          Toastify(0, "Phiên đăng nhập đã hết hạn vui lòng đăng nhập lại.");
        }
        navigate("/");
      });
  }, []);
  return (
    <Loading status={isLoading} className="bg-white">
      {children}
    </Loading>
  );
}

export default Authentication;
