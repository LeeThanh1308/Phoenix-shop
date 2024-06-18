import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import Toast from "../../../components/Toast";
import Cookies from "js-cookie";
import HttpRequest from "../../../utils/axios/HttpRequest";
import Loading from "../../../components/Loading";
import VerifyComponent from "./../../../components/VerifyComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoginedContext } from "../../../hooks/useContext/LoginedContext";

function LoginPage() {
  const navigate = useNavigate();
  const { setStatusLogined } = useContext(LoginedContext);
  const [dataForm, setDataForm] = useState({
    email: "",
    password: "",
  });
  const [dataForget, setDataForget] = useState({
    email: "",
    phone: "",
  });
  const [warnForget, setWarningForget] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isFormLogin, setIsFormLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrorMessage] = useState("");
  const [dataVeifyCode, setDataVeifyCode] = useState({
    email: "",
    expRefreshToken: "",
    expVerify: "",
    total: "",
  });
  const [countDownVerify, setCountDownVerify] = useState();
  const [dataForgetPassword, setDataForgetPassword] = useState({
    password: "",
    rePassword: "",
    phone: "",
  });
  const [isRender, setIsRender] = useState(false);
  const [renderForm, setRenderForm] = useState({});
  const [countDownForget, setCountDownForget] = useState();

  useEffect(() => {
    const Token = Cookies.get("Token");
    setWarningForget("");
    setErrorMessage("");
    if (!Token) {
      setRenderForm({ forget: true });
    }
    if (isFormLogin) {
      setDataForget({
        email: "",
        phone: "",
      });
      setCountDownForget(0);
      setDataForgetPassword({});
    } else {
      setDataForm({});
    }
    if (Token && !isFormLogin && renderForm.forget) {
      setRenderForm({ forget: false });
    }
  }, [isFormLogin]);

  useEffect(() => {
    setDataForget({});
    setDataVeifyCode({});
  }, [renderForm]);

  useLayoutEffect(() => {
    if (countDownVerify) {
      const timerId = setTimeout(() => {
        if (countDownVerify > 0) {
          setCountDownVerify(countDownVerify - 1);
        } else {
          setRenderForm({ forget: true });
        }
      }, 1000);

      return () => clearTimeout(timerId);
    }
  }, [countDownVerify]);

  useLayoutEffect(() => {
    if (renderForm.code || !isFormLogin) {
      const verifyID = Cookies.get("Token");
      if (verifyID) {
        setIsLoading(true);
        HttpRequest.get("verifications/checkVerify/" + verifyID)
          .then((data) => data.data)
          .then((data) => {
            if (data.email) {
              const { expVerify, ...args } = data;
              // console.log(expVerify, args);
              setDataVeifyCode(args);
              setCountDownVerify(expVerify);
            }
          })
          .catch((error) => {
            Cookies.remove("Token");
            setRenderForm({});
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }
  }, [renderForm, isRender, isFormLogin]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (countDownForget > 0) {
        setCountDownForget(countDownForget - 1);
      } else {
        clearTimeout(timerId);
      }
    }, 1000);
    return () => {
      clearTimeout(timerId);
    };
  }, [countDownForget]);

  const handleSubmitForm = () => {
    if (dataForm.email && dataForm.password) {
      setIsLoading(true);
      setErrorMessage("");
      HttpRequest.post("accounts/login", dataForm, {
        withCredentials: true,
      })
        .then((response) => response.data)
        .then((data) => {
          if (data?.token) {
            setErrorMessage("");
            Cookies.set("Token", data?.token?.token, {
              sameSite: "Strict",
              expires: (1 / 24 / 60 / 60) * data?.token?.exp,
            });
            Cookies.set("Logined", 1, {
              sameSite: "Strict",
              expires: (1 / 24 / 60 / 60) * data?.exp,
            });
            Toast(1, data.message);
            setStatusLogined(true);
            navigate("/");
          }
        })
        .catch((err) => {
          const message = err?.response?.data?.message;
          if (message) {
            setErrorMessage(message);
          } else {
            Toast(3, "Có lỗi sảy ra vui lòng thử lại sau!");
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setErrorMessage("Email password không được để trống!");
    }
  };

  const handleSubmitForget = () => {
    if (dataForget.email && dataForget.phone && !warnForget) {
      setIsLoading(true);
      HttpRequest.post("accounts/forget", {
        email: dataForget.email,
        phone: dataForget.phone,
      })
        .then((response) => response.data)
        .then((data) => {
          if (data?.message) {
            setWarningForget(data.message);
          }
          if (data?.field) {
            if (data.field.exp) {
              setCountDownForget(data.field.exp);
            } else {
              setWarningForget(data.field.message);
              setCountDownForget(0);
            }
          }
          if (data.token) {
            Cookies.set("Token", data.token, { sameSite: "strict" });
            setIsLoading(true);
            setIsLoading(false);
            setRenderForm({ code: true });
          }
        })
        .catch((e) => {
          Toast(
            0,
            e?.response?.data?.message ||
              "Có lỗi xảy ra xin vui lòng thử lại sau."
          );
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setWarningForget("Email, số điện thoại không được để trống!");
    }
  };

  function formartHouseMinutesSeconds(seconds) {
    const house = Math.floor(seconds / 60 / 60);
    const minutes = Math.floor(seconds / 60 - house * 60);
    const second = seconds % 60;

    return `${house < 10 ? "0" + house : house}:${
      minutes < 10 ? "0" + minutes : minutes
    }:${second < 10 ? "0" + second : second}`;
  }

  const handleRefreshCode = async () => {
    setIsLoading(true);
    const verifyID = Cookies.get("Token");
    HttpRequest.get("verifications/refresh/" + verifyID)
      .then((response) => response.data)
      .then((data) => {
        if (data.message && data.data) {
          Toast(1, data.message);
          const { expVerify, ...args } = data.data;
          setDataVeifyCode(args);
          setCountDownVerify(expVerify);
        }
      })
      .catch((error) => {
        Toast(0, error.response.data.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSubmitVerifyCode = (code) => {
    const id = Cookies.get("Token");
    if (!id) {
      setIsFormLogin(true);
    }
    setIsLoading(true);
    HttpRequest.post(`verifications/accounts/${id}/${code}`, {
      password: dataForgetPassword.password,
    })
      .then((data) => data.data)
      .then((data) => {
        if (data.errCode) {
          Toast(1, data.message);
          setIsFormLogin(true);
        }
      })
      .catch((err) => {
        Toast(
          0,
          err?.response?.data?.message ||
            "Có lỗi xảy ra xin vui lòng thử lại sau."
        );
        if (err.response.data.message) {
          setIsRender(!isRender);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSubmitChangePass = () => {
    if (dataForgetPassword.password?.length < 6) {
      setDataForgetPassword((prev) => ({
        ...prev,
        warn: "Mật khẩu tối thiểu 6 ký tự.",
      }));
    } else if (!dataForgetPassword.password || !dataForgetPassword.rePassword) {
      setDataForgetPassword((prev) => ({
        ...prev,
        warn: dataForgetPassword.password
          ? "Nhập lại mật khẩu không được để trống!"
          : "Mật khẩu không được để trống!",
      }));
      return false;
    } else if (dataForgetPassword.password !== dataForgetPassword.rePassword) {
      setDataForgetPassword((prev) => ({
        ...prev,
        warn: "Mật khẩu nhập lại không khớp.",
      }));
      return false;
    } else if (dataForgetPassword.password && dataForgetPassword.rePassword) {
      return true;
    }
  };

  return (
    <div
      className="w-full h-screen flex"
      style={{
        backgroundImage: `url('${process.env.REACT_APP_DOMAIN_API}${process.env.REACT_APP_URL_AVATAR}login.png')`,
      }}
    >
      <Loading status={isLoading}>
        <div className="w-96 text-center text-slate-50 m-auto p-4 rounded-md shadow-2xl shadow-black relative ">
          <div className="pb-4 mt-6">
            <div className=" w-20 h-20 mx-auto">
              <Link to="/">
                <img
                  src={`${process.env.REACT_APP_DOMAIN_API}${process.env.REACT_APP_URL_AVATAR}logo.png`}
                  className="w-full h-full logo"
                  alt=""
                />
              </Link>
            </div>
            {isFormLogin ? (
              <>
                <h2 className="text-3xl">Đăng nhập</h2>
                <div
                  className="mt-4 mb-3"
                  onKeyUp={(e) => {
                    if (e.key.toLocaleLowerCase() === "enter") {
                      handleSubmitForm();
                    }
                  }}
                >
                  <div className="w-4/5 mx-auto mb-2">
                    <input
                      className="p-2 rounded-md bg-transparent w-full border border-solid border-slate-50/0 hover:border-slate-50 focus:border-slate-50 outline-none placeholder:italic placeholder:text-slate-100"
                      type="text"
                      placeholder="Email"
                      value={dataForm.email}
                      onChange={(e) => {
                        setDataForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }));
                        setErrorMessage("");
                      }}
                    />
                  </div>
                  <div className="w-4/5 mx-auto mb-1 relative">
                    <input
                      className="p-2 rounded-md bg-transparent w-full border border-solid border-slate-50/0 hover:border-slate-50 focus:border-slate-50 outline-none placeholder:italic placeholder:text-slate-100"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mật khẩu"
                      value={dataForm.password}
                      onChange={(e) => {
                        setDataForm((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }));
                        setErrorMessage("");
                      }}
                    />
                    {showPassword ? (
                      <i
                        className="fa-solid fa-eye absolute right-2 top-3"
                        onClick={(e) => setShowPassword(!showPassword)}
                      ></i>
                    ) : (
                      <i
                        className="fa-regular fa-eye-slash absolute right-2 top-3"
                        onClick={(e) => setShowPassword(!showPassword)}
                      ></i>
                    )}
                  </div>
                  <div>
                    <span className="text-xs text-slate-100">{errMessage}</span>
                  </div>
                </div>

                <button
                  onClick={handleSubmitForm}
                  className="border border-solid px-4 py-1 rounded-md hover:opacity-75"
                >
                  Xác nhận
                </button>
                <div className="mt-3 p-1">
                  <p className="text-sm cursor-default">
                    Bạn chưa có tài khoản?{" "}
                    <Link to="/signup">
                      <span className="text-blue-400 cursor-pointer">
                        Đăng ký
                      </span>
                    </Link>
                  </p>
                </div>
                <div className="p-1">
                  <p
                    className="text-sm cursor-default"
                    onClick={() => setIsFormLogin(false)}
                  >
                    <span className="text-blue-400 cursor-pointer">
                      Bạn quên mật khẩu ư?{" "}
                    </span>
                  </p>
                </div>
              </>
            ) : (
              <>
                <div
                  className=" absolute top-1 left-1 w-10 h-10 rounded-full hover:bg-white flex items-center justify-center hover:text-black cursor-pointer"
                  onClick={() => {
                    setIsFormLogin(true);
                    setErrorMessage("");
                  }}
                  onChange={() => {
                    if (countDownForget > 0) setCountDownForget(0);
                  }}
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-left-long"
                    className=" text-2xl"
                  />
                </div>
                {renderForm?.forget ? (
                  <>
                    <h2 className="text-3xl">Lấy lại mật khẩu</h2>
                    <div className="mt-4 mb-3">
                      <div className="w-4/5 mx-auto mb-2">
                        <input
                          className="p-2 rounded-md bg-transparent w-full border border-solid border-slate-50/0 hover:border-slate-50 focus:border-slate-50 outline-none placeholder:italic placeholder:text-slate-100"
                          type="text"
                          placeholder="Email"
                          value={dataForget.email}
                          onChange={(e) => {
                            setWarningForget("");
                            setDataForget((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }));
                          }}
                        />
                      </div>
                    </div>

                    <div
                      className="mt-4 mb-3"
                      onKeyUp={(e) => {
                        if (e.key.toLocaleLowerCase() === "enter") {
                          handleSubmitForget();
                        }
                      }}
                    >
                      <div className="w-4/5 mx-auto mb-1 relative">
                        <input
                          className="p-2 rounded-md bg-transparent w-full border border-solid border-slate-50/0 hover:border-slate-50 focus:border-slate-50 outline-none placeholder:italic placeholder:text-slate-100"
                          type="text"
                          placeholder="Số điện thoại"
                          value={dataForget.phone}
                          onChange={(e) => {
                            setWarningForget("");
                            setDataForget((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }));
                          }}
                        />
                      </div>
                      <div>
                        <span className="text-xs text-slate-100 font-bold">
                          {`${
                            !warnForget
                              ? countDownForget > 0
                                ? "Vui lòng thử lại sau " +
                                  formartHouseMinutesSeconds(countDownForget)
                                : ""
                              : warnForget
                          }`}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleSubmitForget}
                      className="border border-solid px-4 py-1 rounded-md hover:opacity-75"
                    >
                      Xác nhận
                    </button>
                  </>
                ) : (
                  <div>
                    <h2 className="text-3xl">Nhập mã xác minh</h2>
                    <p className=" text-sm font-thin text-white mt-1">
                      Nhập mã xác minh gồm 6 chữ số mà chúng tôi đã gửi tới
                      email {dataVeifyCode.email}, mã sẽ hết hạn sau{" "}
                      <span className="text-green-500 font-bold">
                        {formartHouseMinutesSeconds(countDownVerify || 0)}
                      </span>
                    </p>
                    <div className="">
                      <div className="mt-4 mb-3">
                        <div className="w-4/5 mx-auto mb-1 relative">
                          <input
                            className="p-2 rounded-md bg-transparent w-full border border-solid border-slate-50/0 hover:border-slate-50 focus:border-slate-50 outline-none placeholder:italic placeholder:text-slate-100"
                            type={showPassword ? "text" : "password"}
                            placeholder="Nhập mật khẩu mới"
                            value={dataForgetPassword.password}
                            onChange={(e) => {
                              setDataForgetPassword((prev) => ({
                                ...prev,
                                warn: "",
                                password: e.target.value,
                              }));
                            }}
                          />
                          {showPassword ? (
                            <i
                              className="fa-solid fa-eye absolute right-2 top-3"
                              onClick={(e) => setShowPassword(!showPassword)}
                            ></i>
                          ) : (
                            <i
                              className="fa-regular fa-eye-slash absolute right-2 top-3"
                              onClick={(e) => setShowPassword(!showPassword)}
                            ></i>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 mb-3">
                        <div className="w-4/5 mx-auto mb-1 relative">
                          <input
                            className="p-2 rounded-md bg-transparent w-full border border-solid border-slate-50/0 hover:border-slate-50 focus:border-slate-50 outline-none placeholder:italic placeholder:text-slate-100"
                            type={"password"}
                            placeholder="Nhập lại mật khẩu"
                            value={dataForgetPassword.rePassword}
                            onChange={(e) => {
                              setDataForgetPassword((prev) => ({
                                ...prev,
                                warn: "",
                                rePassword: e.target.value,
                              }));
                            }}
                          />
                        </div>
                        <p className="text-xs text-slate-100">
                          {dataForgetPassword.warn}
                        </p>
                      </div>
                    </div>
                    <VerifyComponent
                      classx=" text-black"
                      getValue={(value) => {
                        if (handleSubmitChangePass()) {
                          handleSubmitVerifyCode(value);
                        }
                      }}
                      onExpired={() => {
                        setIsFormLogin(true);
                        setRenderForm({});
                      }}
                      totalVerify={dataVeifyCode.total}
                      textBtnSuccess="Đổi mật khẩu"
                      expRefresh={dataVeifyCode.expRefreshToken}
                      clickRefresh={handleRefreshCode}
                      onEnter={(value) => {
                        if (handleSubmitChangePass()) {
                          handleSubmitVerifyCode(value);
                        }
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Loading>
    </div>
  );
}

export default LoginPage;
