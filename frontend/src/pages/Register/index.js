import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Toast from "./../../components/Toast";
import Cookies from "js-cookie";
import HttpRequest from "../../utils/axios/HttpRequest";
import Loading from "../../components/Loading";

function RegsisterPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [tokenID, setTokenID] = useState(Cookies.get("tokenID"));
  const [dataForm, setDataForm] = useState({
    username: "",
    gender: "",
    password: "",
    birthday: "",
    reEnterPass: "",
    phone: "",
    email: "",
  });
  const [warnForm, setWarnForm] = useState({
    username: null,
    gender: null,
    password: null,
    birthday: null,
    reEnterPass: null,
    phone: null,
    email: null,
    avatar: null,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSetWarning = (key, value) => {
    setWarnForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  let handleValidations = (e) => {
    let type = e.type;
    if (type === "blur") {
      let key = e.target.name;
      switch (key) {
        case "username":
          if (!dataForm[key]) {
            handleSetWarning(key, "Trường này không được để trống");
          } else {
            if (
              /^[a-zA-Z\sáàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴ]+$/.test(
                dataForm[key]
              )
            ) {
              handleSetWarning(key, null);
            } else {
              handleSetWarning(key, "Tên không chứa số và ký tự đặc biệt!");
            }
          }
          break;
        case "reEnterPass":
          if (!dataForm[key]) {
            handleSetWarning(key, "Trường không được để trống");
          } else {
            if (dataForm.password === dataForm.reEnterPass) {
              handleSetWarning(key, null);
            } else {
              handleSetWarning(key, "Mật khẩu nhập lại không khớp!");
            }
          }
          break;
        case "password":
          if (dataForm[key]) {
            if (dataForm[key].length >= 6) {
              handleSetWarning(key, null);
            } else {
              handleSetWarning(key, "Mật khẩu tối thiểu 6 ký tự");
            }
          } else {
            handleSetWarning(key, "Trường không được để trống");
          }
          break;
        case "birthday":
          if (dataForm[key] === "") {
            handleSetWarning(key, "Thông tin không hợp lệ!");
          } else if (!dataForm[key]) {
            handleSetWarning(key, "Trường này không được để trống");
          } else {
            const birthdateDate = new Date(dataForm[key]);
            const currentDate = new Date();
            currentDate.setFullYear(currentDate.getFullYear());
            if (currentDate >= birthdateDate) {
              handleSetWarning(key, null);
            } else {
              handleSetWarning(key, "Thông tin không hợp lệ!");
            }
          }
          break;
        case "gender":
          if (!dataForm[key]) {
            handleSetWarning(key, "Trường này không được để trống");
          } else {
            handleSetWarning(key, null);
          }
          break;
        case "phone":
          if (!dataForm[key]) {
            handleSetWarning(key, "Trường này không được để trống");
          } else {
            if (
              /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(dataForm.phone)
            ) {
              handleSetWarning(key, null);
            } else {
              handleSetWarning(key, "Số điện thoại không hợp lệ!");
            }
          }
          break;
        case "email":
          if (!dataForm[key]) {
            handleSetWarning(key, "Trường này không được để trống");
          } else {
            if (
              /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
                dataForm[key]
              )
            ) {
              handleSetWarning(key, null);
            } else {
              handleSetWarning(key, "Email không hợp lệ.");
            }
          }
          break;
        case "avatar":
          if (dataForm[key]) {
            const valid = /.(jpg|jpeg|png|gif|bmp|svg|webp|tiff|ico)$/.test(
              dataForm.avatar.name
            );
            if (valid) {
              handleSetWarning(key, null);
            } else {
              handleSetWarning(key, "Ảnh không hợp lệ!");
            }
          }
          break;
        default:
          break;
      }
    } else if (type === "change") {
      let name = e.target.name;
      let value = e.target.value;
      // console.log(name, value);
      switch (name) {
        case "username":
          if (
            /^[a-zA-Z\sáàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴ]+$/.test(
              value
            )
          ) {
            handleSetWarning(name, null);
          }
          break;
        case "reEnterPass":
          if (dataForm.password === value) {
            handleSetWarning(name, null);
          }
          break;
        case "password":
          if (value.length >= 6) {
            handleSetWarning(name, null);
          } else {
            handleSetWarning(name, "Mật khẩu tối thiểu 6 ký tự");
          }
          break;
        case "birthday":
          const birthdateDate = new Date(value);
          const currentDate = new Date();
          currentDate.setFullYear(currentDate.getFullYear());
          if (currentDate >= birthdateDate) {
            handleSetWarning(name, null);
          }
          break;
        case "gender":
          if (value) {
            handleSetWarning(name, null);
          }
          break;
        case "phone":
          if (/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(value)) {
            handleSetWarning(name, null);
          } else {
            handleSetWarning(name, "Số điện thoại không hợp lệ!");
          }

          break;
        case "email":
          if (
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
              value
            )
          ) {
            handleSetWarning(name, null);
          } else {
            handleSetWarning(name, "Email không hợp lệ.");
          }

          break;
        case "avatar":
          if (value) {
            handleSetWarning(name, null);
          }
          break;
        default:
          break;
      }
    } else {
      let message = {};
      Object.keys(dataForm).map((key, value) => {
        switch (key) {
          case "username":
            if (!dataForm[key]) {
              message[key] = "Trường này không được để trống";
            } else {
              if (
                /^[a-zA-Z\sáàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴ]+$/.test(
                  dataForm[key]
                )
              ) {
                message[key] = null;
              } else {
                message[key] = "Tên không chứa số và ký tự đặc biệt!";
              }
            }
            break;
          case "reEnterPass":
            if (!dataForm[key]) {
              message[key] = "Trường không được để trống";
            } else {
              if (dataForm.password === dataForm.reEnterPass) {
                message[key] = null;
              } else {
                message[key] = "Mật khẩu nhập lại không khớp!";
              }
            }
            break;
          case "password":
            if (dataForm[key]) {
              if (dataForm[key].length >= 6) {
                message[key] = null;
              } else {
                message[key] = "Mật khẩu tối thiểu 6 ký tự";
              }
            } else {
              message[key] = "Trường không được để trống";
            }
            break;
          case "birthday":
            if (dataForm[key] === "") {
              message[key] = "Thông tin không hợp lệ!";
            } else if (!dataForm[key]) {
              message[key] = "Trường này không được để trống";
            } else {
              const birthdateDate = new Date(dataForm[key]);
              const currentDate = new Date();
              currentDate.setFullYear(currentDate.getFullYear());
              if (currentDate >= birthdateDate) {
                message[key] = null;
              } else {
                message[key] = "Thông tin không hợp lệ!";
              }
            }
            break;
          case "gender":
            if (!dataForm[key]) {
              message[key] = "Trường này không được để trống";
            } else {
              message[key] = null;
            }
            break;
          case "phone":
            if (!dataForm[key]) {
              message[key] = "Trường này không được để trống";
            } else {
              if (
                /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(dataForm.phone)
              ) {
                message[key] = null;
              } else {
                message[key] = "Số điện thoại không hợp lệ!";
              }
            }
            break;
          case "email":
            if (!dataForm[key]) {
              message[key] = "Trường này không được để trống";
            } else {
              if (
                /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
                  dataForm[key]
                )
              ) {
                message[key] = null;
              } else {
                message[key] = "Email không hợp lệ.";
              }
            }
            break;
          case "avatar":
            if (value) {
              message[key] = null;
            } else {
              message[key] = "Ảnh không hợp lệ!";
            }
            break;
          default:
            break;
        }
        return null;
      });
      setWarnForm(message);
      if (
        !message.username &&
        !message.password &&
        !message.birthday &&
        !message.email &&
        !message.gender &&
        !message.phone &&
        !message.reEnterPass
      )
        handleSubmitForm();
    }
  };

  function handleSubmitForm() {
    // console.log(warnForm);
    if (
      dataForm.username &&
      dataForm.password &&
      dataForm.birthday &&
      dataForm.email &&
      dataForm.gender &&
      dataForm.phone
    )
      setIsLoading(true);
    HttpRequest.post("/accounts/signup", {
      ...dataForm,
      fullname: dataForm.username,
    })
      .then((response) => response.data)
      .then(async (data) => {
        if (data.id) {
          const token = await Cookies.set("tokenID", data.id, {
            expires: (1 / 24 / 60) * 60,
          });
          setTokenID(token);
        } else if (data.field && data.message) {
          setWarnForm((prev) => ({
            ...prev,
            [data.field]: data.message,
          }));
        } else {
          setWarnForm((prev) => ({
            ...prev,
            ...data.field,
          }));
        }
      })
      .catch((error) => {
        if (error.response.data.message) {
          Toast(3, error.response.data.message.join(""));
        } else {
          Toast(3, "Có lỗi sảy ra vui lòng thử lại sau!");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
  useEffect(() => {
    if (tokenID) navigate("/signup/verify");
  }, [tokenID]);

  return (
    <div className="w-full h-screen flex text-center relative">
      <Loading status={isLoading}>
        <div className="w-3/12 bg-slate-50 text-slate-950 m-auto p-4 rounded-md shadow-sm shadow-black">
          <div>
            <Link to="/">
              <div className=" w-20 h-20 mx-auto">
                <img
                  src={`${process.env.REACT_APP_DOMAIN_API}${process.env.REACT_APP_URL_AVATAR}logo.png`}
                  className="w-full h-full"
                  alt=""
                />
              </div>
            </Link>
            <h2 className="text-3xl">Đăng ký tài khoản.</h2>
            <div className="mt-4 mb-3 w-11/12 mx-auto">
              <div className="mb-2 w-full mr-1">
                <input
                  onBlur={(e) => handleValidations(e)}
                  value={dataForm.username}
                  onChange={(e) => {
                    handleValidations(e);
                    setDataForm((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }));
                  }}
                  type="text"
                  name="username"
                  placeholder="Họ và tên"
                  className={`p-2 rounded-md w-full border border-solid outline-none placeholder:italic bg-slate-50/0 ${
                    !warnForm.username ? null : "border-rose-500"
                  }`}
                />
                <p className="text-rose-700 indent-1 warn w-full mb-1">
                  {warnForm.username}
                </p>
              </div>

              <div className="mb-2 w-full mr-1">
                <input
                  onBlur={(e) => handleValidations(e)}
                  value={dataForm.birthday}
                  onChange={(e) => {
                    handleValidations(e);
                    setDataForm((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }));
                  }}
                  type="date"
                  name="birthday"
                  className={`p-2 rounded-md w-full border border-solid outline-none placeholder:italic bg-slate-50/0 ${
                    !warnForm.birthday ? null : "border-rose-500"
                  }`}
                />
                <p className="text-rose-700 indent-1 warn w-full mb-1">
                  {warnForm.birthday}
                </p>
              </div>

              <div className="w-full mx-auto mb-2">
                <select
                  name="gender"
                  className={`w-full p-2 border border-solid rounded-md bg-slate-50/0 text-gray-400 ${
                    !warnForm.gender ? null : "border-rose-500"
                  }`}
                  onChange={(e) => {
                    handleValidations(e);
                    setDataForm((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }));
                  }}
                  defaultValue={dataForm.gender ? dataForm.gender : "default"}
                >
                  <option value="default" disabled hidden className="">
                    Giới tính
                  </option>
                  <option value="x">Nam</option>
                  <option value="y">Nữ</option>
                  <option value="z">Khác</option>
                </select>
                <p className="text-rose-700 indent-1 warn w-full mb-1">
                  {warnForm.gender}
                </p>
              </div>

              <div className="w-full flex justify-between">
                <div className="mb-2 w-3/6 mr-1 relative">
                  <input
                    onBlur={(e) => handleValidations(e)}
                    value={dataForm.password}
                    onChange={(e) => {
                      handleValidations(e);
                      setDataForm((prev) => ({
                        ...prev,
                        [e.target.name]: e.target.value,
                      }));
                    }}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Mật khẩu"
                    className={`p-2 rounded-md w-full border border-solid outline-none placeholder:italic bg-slate-50/0 ${
                      !warnForm.password ? null : "border-rose-500"
                    }`}
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

                  <p className="text-rose-700 indent-1 warn w-full mb-1">
                    {warnForm.password}
                  </p>
                </div>

                <div className="w-3/6 mx-auto mb-2">
                  <input
                    onBlur={(e) => handleValidations(e)}
                    onChange={(e) => {
                      handleValidations(e);
                      setDataForm((prev) => ({
                        ...prev,
                        [e.target.name]: e.target.value,
                      }));
                    }}
                    value={dataForm.reEnterPass}
                    type="password"
                    name="reEnterPass"
                    placeholder="Nhập lại mật khẩu"
                    className={`p-2 rounded-md w-full border border-solid outline-none placeholder:italic bg-slate-50/0 text-slate-950 ${
                      !warnForm.reEnterPass ? null : "border-rose-500"
                    }`}
                  />
                  <p className="text-rose-700 indent-1 warn w-full mb-1">
                    {warnForm.reEnterPass}
                  </p>
                </div>
              </div>

              <div className="w-full flex justify-between">
                <div className="mb-2 w-3/6 mr-1">
                  <div className="w-full mx-auto mb-2">
                    <input
                      onBlur={(e) => handleValidations(e)}
                      value={dataForm.phone}
                      onChange={(e) => {
                        handleValidations(e);
                        setDataForm((prev) => ({
                          ...prev,
                          [e.target.name]: e.target.value,
                        }));
                      }}
                      type="text"
                      name="phone"
                      placeholder="Số điện thoại"
                      className={`p-2 rounded-md w-full border border-solid outline-none placeholder:italic bg-slate-50/0 text-slate-950 ${
                        !warnForm.phone ? null : "border-rose-500"
                      }`}
                    />
                    <p className="text-rose-700 indent-1 warn w-full mb-1">
                      {warnForm.phone}
                    </p>
                  </div>
                </div>
                <div className="mb-2 w-3/6">
                  <div className="w-full mx-auto mb-2">
                    <input
                      onBlur={(e) => handleValidations(e)}
                      value={dataForm.email}
                      onChange={(e) => {
                        handleValidations(e);
                        setDataForm((prev) => ({
                          ...prev,
                          [e.target.name]: e.target.value,
                        }));
                      }}
                      type="email"
                      name="email"
                      placeholder="Email"
                      className={`p-2 rounded-md w-full border border-solid outline-none placeholder:italic bg-slate-50/0 text-slate-950 ${
                        !warnForm.email ? null : "border-rose-500"
                      }`}
                    />
                    <p className="text-rose-700 indent-1 warn w-full mb-1">
                      {warnForm.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={(e) => {
                handleValidations(e);
              }}
              className="px-4 py-1 rounded-md hover:opacity-75 bg-rose-500"
            >
              Đăng ký
            </button>
            <div className="mt-3 py-1">
              <p className="text-sm cursor-default">
                Bạn đã có tài khoản?{" "}
                <Link to="/login">
                  <span className="text-blue-500 cursor-pointer">
                    Đăng nhập.
                  </span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </Loading>
    </div>
  );
}

export default RegsisterPage;
