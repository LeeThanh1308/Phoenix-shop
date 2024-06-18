import { useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import Toast from "./../../../components/Toast";
import { Upload, Button } from "antd";
import { UserOutlined, KeyOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import AuthRequest from "./../../../utils/axios/AuthRequest";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../../../hooks/useContext/UserDataContext";
import Loading from "../../../components/Loading";
import { LoginedContext } from "../../../hooks/useContext/LoginedContext";

function SettingPage() {
  const Navigate = useNavigate();
  const { reRenderUser, setReRenderUser } = useContext(UserDataContext);
  const { setStatusLogined } = useContext(LoginedContext);
  const [isLoading, setIsLoading] = useState(false);
  const [dataForm, setDataForm] = useState({
    fullname: "",
    gender: "",
    password: "",
    birthday: "",
    phone: "",
    email: "",
    avatar: "",
  });
  const [prevDataForm, setPrevDataForm] = useState();
  const [renderUI, setRenderUI] = useState(false);
  const [warnForm, setWarnForm] = useState({
    fullname: "",
    gender: "",
    password: "",
    birthday: "",
    phone: "",
    email: "",
    avatar: "",
  });
  const [showForm, setShowForm] = useState({
    showInfo: true,
  });
  const [dataFormPass, setDataFormPass] = useState({ showPassword: false });
  const [fileList, setFileList] = useState([]);

  const onChange = ({ fileList: newFileList }) => {
    // console.log({ fileList, newFileList });
    if (fileList[0]?.status === "removed") {
      setFileList(newFileList);
    } else {
      setFileList(newFileList);
      setDataForm((prev) => ({
        ...prev,
        avatar: fileList,
      }));
    }
  };
  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      Toast(0, "You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      Toast(0, "Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleSetWarning = (key, value) => {
    setWarnForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  let handleValidations = (e) => {
    // console.log(e);
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
        default:
          break;
      }
    } else {
      let message = {};
      Object.keys(dataForm).map((key, value) => {
        switch (key) {
          case "fullname":
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
          default:
            break;
        }
        return null;
      });
      setWarnForm(message);
      if (
        !message.fullname &&
        !message.password &&
        !message.birthday &&
        !message.email &&
        !message.gender &&
        !message.phone
      ) {
        handleSubmitForm();
      }
    }
  };

  function handleSubmitForm() {
    if (
      fileList ||
      (dataForm.fullname &&
        dataForm.password &&
        dataForm.birthday &&
        dataForm.email &&
        dataForm.gender &&
        dataForm.phone &&
        JSON.stringify(dataForm) !== JSON.stringify(prevDataForm))
    ) {
      setIsLoading(true);
      const { originFileObj } = dataForm.avatar[0];
      AuthRequest.post(
        "accounts/info",
        {
          ...dataForm,
          avatar: originFileObj,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
        .then((response) => response.data)
        .then((data) => {
          if (data.message) {
            Toast(1, data.message);
            setReRenderUser(!reRenderUser);
            setRenderUI(!renderUI);
          }
        })
        .catch((error) => {})
        .finally(() => {
          setIsLoading(false);
        });
    }
  }

  const handleValidateChangePass = () => {
    if (dataFormPass?.newPassword?.length < 6) {
      setDataFormPass((prev) => ({
        ...prev,
        warnNewPass: "Mật khẩu tối thiểu 6 ký tự.",
      }));
    }
    if (
      !dataFormPass?.newPassword ||
      !dataFormPass?.rePassword | !dataFormPass?.prevPassword
    ) {
      setDataFormPass((prev) => ({
        ...prev,
        warnPrevPass: dataFormPass?.prevPassword
          ? ""
          : "Trường này không được để trống!",
        warnNewPass: dataFormPass?.newPassword
          ? ""
          : "Trường này không được để trống!",
        warnRePass: dataFormPass?.rePassword
          ? ""
          : "Trường này không được để trống!",
      }));
      return false;
    }
    if (dataFormPass?.newPassword !== dataFormPass?.rePassword) {
      setDataFormPass((prev) => ({
        ...prev,
        warnRePass: "Mật khẩu nhập lại không khớp.",
      }));
      return false;
    }
    if (
      dataFormPass?.newPassword === dataFormPass?.rePassword &&
      dataFormPass?.prevPassword
    ) {
      return true;
    }
  };

  const handleSubmitChangePass = () => {
    setIsLoading(true);
    AuthRequest.post("accounts/change-password", {
      pass: dataFormPass?.prevPassword + "</>+" + dataFormPass?.newPassword,
    })
      .then((response) => response.data)
      .then((data) => {
        if (data?.field) {
          setDataFormPass((prev) => ({
            ...prev,
            warnPrevPass: data?.field?.password,
          }));
        }
        if (data?.message) {
          Toast(1, data?.message);
          Cookies.remove("Logined");
          Cookies.remove("Token");
          setStatusLogined(false);
          Navigate("/");
        }
      })
      .catch((error) => error)
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    AuthRequest.get("accounts/info")
      .then((response) => response.data)
      .then((data) => {
        if (data.email) {
          setDataForm(data);
          setPrevDataForm(data);
        }
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
  }, [renderUI]);

  return (
    <div className="w-full h-full bg-white pt-3 flex relative">
      <Loading status={isLoading}>
        <div className=" w-1/3 px-10">
          <div className="text-3xl mb-2">Cài đặt</div>
          <div
            className={`text-md w-2/3 py-3 px-2 mb-2 rounded ${
              showForm?.showInfo ? " shadow font-bold" : "cursor-pointer"
            }`}
            onClick={() =>
              showForm?.showInfo ? null : setShowForm({ showInfo: true })
            }
          >
            <UserOutlined /> Thông tin cá nhân
          </div>
          <div
            className={`text-md w-2/3 py-3 px-2 mb-2 rounded ${
              showForm?.changePass ? " shadow font-bold" : "cursor-pointer"
            }`}
            onClick={() =>
              showForm?.changePass ? null : setShowForm({ changePass: true })
            }
          >
            <KeyOutlined /> Đổi mật khẩu
          </div>
        </div>
        <div className="w-2/3 shadow shadow-black/60 rounded-lg p-4">
          {showForm?.showInfo ? (
            <>
              <div className="text-xl border-b pb-2">Thông tin cá nhân</div>
              <div className="">
                <div className=" bg-black/90 z-10">
                  <div className="w-full bg-white mx-auto p-4 relative">
                    <div className="w-full text-slate-950">
                      <div className="flex justify-between items-center">
                        <div className="font-bold text-base">
                          Sửa thông tin cá nhân
                        </div>
                      </div>
                      <div>
                        <div className="mt-4 mb-3 w-11/12 mx-auto">
                          <div className="w-full flex justify-between items-center mt-5 my-4">
                            <div className="2/12 font-bold text-base">
                              Họ và tên:
                            </div>
                            <div className="w-10/12">
                              <input
                                onBlur={(e) => handleValidations(e)}
                                onChange={(e) =>
                                  setDataForm((prev) => ({
                                    ...prev,
                                    [e.target.name]: e.target.value,
                                  }))
                                }
                                type="text"
                                name="fullname"
                                value={dataForm.fullname}
                                placeholder="Họ và tên"
                                className={`p-2 rounded-md w-full  border-b border-none hover:border-solid outline-none placeholder:italic bg-slate-50/0 ${
                                  !warnForm.fullname ? null : "border-rose-500"
                                }`}
                              />
                              <p className="text-rose-700 indent-1 warn w-full mb-1">
                                {warnForm.fullname}
                              </p>
                            </div>
                          </div>

                          <div className="w-full flex justify-between items-center mt-5 my-4">
                            <div className="2/12 font-bold text-base">
                              Ngày sinh:
                            </div>
                            <div className="w-10/12">
                              <input
                                onBlur={(e) => handleValidations(e)}
                                onChange={(e) =>
                                  setDataForm((prev) => ({
                                    ...prev,
                                    [e.target.name]: e.target.value,
                                  }))
                                }
                                type="date"
                                name="birthday"
                                placeholder="Ngày sinh"
                                value={dataForm.birthday}
                                className={`p-2 rounded-md w-full border-b outline-none border-none hover:border-solid placeholder:italic bg-slate-50/0 ${
                                  !warnForm.birthday ? null : "border-rose-500"
                                }`}
                              />
                              <p className="text-rose-700 indent-1 warn w-full mb-1">
                                {warnForm.birthday}
                              </p>
                            </div>
                          </div>
                          <div className="w-full flex justify-between items-center mt-5 my-4">
                            <div className="2/12 font-bold text-base">
                              Giới tính:
                            </div>
                            <div className="w-10/12">
                              <select
                                name="gender"
                                className={`w-full p-2  border-b border-none hover:border-solid rounded-md bg-slate-50/0 text-gray-400 ${
                                  !warnForm.gender ? null : "border-rose-500"
                                }`}
                                onChange={(e) =>
                                  setDataForm((prev) => ({
                                    ...prev,
                                    [e.target.name]: e.target.value,
                                  }))
                                }
                                value={dataForm.value}
                                defaultValue={dataForm.gender}
                              >
                                <option
                                  value="default"
                                  disabled
                                  hidden
                                  className=""
                                >
                                  Giới tính
                                </option>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                                <option value="Khác">Khác</option>
                              </select>
                              <p className="text-rose-700 indent-1 warn w-full mb-1">
                                {warnForm.gender}
                              </p>
                            </div>
                          </div>
                          <div className="w-full flex justify-between items-center mt-5 my-4">
                            <div className="2/12 font-bold text-base">
                              Email:
                            </div>
                            <div className="w-10/12">
                              <div>
                                <p>{dataForm.email || "00000"}</p>
                              </div>
                            </div>
                          </div>
                          <div className="w-full flex justify-between items-center mt-5 my-4">
                            <div className="2/12 font-bold text-base">
                              Số điện thoại:
                            </div>
                            <div className="w-10/12">
                              <div>
                                <p>{dataForm.phone || "00000"}</p>
                              </div>
                            </div>
                          </div>

                          <div className="w-full flex justify-between items-center mt-5 my-4 border-solid border-b">
                            <div className="2/12 font-bold text-base">
                              UserID:
                            </div>
                            <div className="w-10/12">
                              <div>
                                <p>{dataForm.usid || "00000"}</p>
                              </div>
                            </div>
                          </div>

                          <div className="w-full  mt-5 my-4 relative">
                            <div className="2/12 font-bold text-base mb-4">
                              Avatar:
                            </div>
                            <div className="flex justify-center items-top">
                              {!showForm?.avatar ? (
                                <img
                                  src={`${process.env.REACT_APP_DOMAIN_API}${process.env.REACT_APP_URL_AVATAR}${dataForm?.avatar}`}
                                  alt="avatar"
                                  className="w-28 h-28 rounded-full"
                                />
                              ) : null}
                              {!showForm?.avatar ? (
                                <Button
                                  className=" absolute top-0 right-0"
                                  onClick={() =>
                                    setShowForm((prev) => ({
                                      ...prev,
                                      avatar: true,
                                    }))
                                  }
                                >
                                  Chỉnh sửa
                                </Button>
                              ) : (
                                <div className=" w-fit h-fit">
                                  <ImgCrop
                                    rotationSlider={false}
                                    zoomSlider={false}
                                    quality={1}
                                    cropShape="round"
                                  >
                                    <Upload
                                      listType="picture-circle"
                                      className="avatar-uploader"
                                      fileList={fileList}
                                      onChange={onChange}
                                      beforeUpload={beforeUpload}
                                      onPreview={onPreview}
                                    >
                                      {fileList.length < 1 &&
                                        "+ Upload avatars"}
                                    </Upload>
                                  </ImgCrop>
                                </div>
                              )}
                            </div>
                          </div>

                          {JSON.stringify(dataForm) ===
                          JSON.stringify(prevDataForm) ? null : (
                            <div className="mt-4 flex justify-end">
                              <button
                                onClick={handleValidations}
                                className="px-4 py-1 rounded-md hover:opacity-75 bg-sky-500 text-white font-bold"
                              >
                                Cập nhật
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}

          {showForm?.changePass ? (
            <div className="">
              <div className="text-xl border-b pb-2">Đổi mật khẩu.</div>
              <div className="">
                <div className="mt-4 mb-3">
                  <div className="w-4/5 mx-auto mb-1 relative">
                    <input
                      className={`p-2 rounded-md bg-transparent w-full border border-solid shadow outline-none placeholder:italic placeholder:text-black ${
                        dataFormPass?.warnPrevPass ? " border-red-500" : null
                      }`}
                      type={dataFormPass?.showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu cũ"
                      value={dataFormPass?.prevPassword}
                      onChange={(e) => {
                        setDataFormPass((prev) => ({
                          ...prev,
                          warnPrevPass: "",
                          prevPassword: e.target.value,
                        }));
                      }}
                    />
                    <p className="text-rose-700 indent-1 warn w-full mb-1">
                      {dataFormPass?.warnPrevPass}
                    </p>
                    {dataFormPass.showPassword ? (
                      <i
                        className="fa-solid fa-eye absolute right-2 top-3"
                        onClick={(e) =>
                          setDataFormPass((prev) => ({
                            ...prev,
                            showPassword: false,
                          }))
                        }
                      ></i>
                    ) : (
                      <i
                        className="fa-regular fa-eye-slash absolute right-2 top-3"
                        onClick={(e) =>
                          setDataFormPass((prev) => ({
                            ...prev,
                            showPassword: true,
                          }))
                        }
                      ></i>
                    )}
                  </div>
                </div>
                <div className="mt-4 mb-3">
                  <div className="w-4/5 mx-auto mb-1 relative">
                    <input
                      className={`p-2 rounded-md bg-transparent w-full border border-solid shadow outline-none placeholder:italic placeholder:text-black ${
                        dataFormPass?.warnNewPass ? " border-red-500" : null
                      }`}
                      type={dataFormPass?.showPasswordNew ? "text" : "password"}
                      placeholder="Nhập mật khẩu mới"
                      value={dataFormPass?.newPassword}
                      onChange={(e) => {
                        setDataFormPass((prev) => ({
                          ...prev,
                          warnNewPass: "",
                          newPassword: e.target.value,
                        }));
                      }}
                    />
                    <p className="text-rose-700 indent-1 warn w-full mb-1">
                      {dataFormPass?.warnNewPass}
                    </p>
                    {dataFormPass?.showPasswordNew ? (
                      <i
                        className="fa-solid fa-eye absolute right-2 top-3"
                        onClick={(e) =>
                          setDataFormPass((prev) => ({
                            ...prev,
                            showPasswordNew: false,
                          }))
                        }
                      ></i>
                    ) : (
                      <i
                        className="fa-regular fa-eye-slash absolute right-2 top-3"
                        onClick={(e) =>
                          setDataFormPass((prev) => ({
                            ...prev,
                            showPasswordNew: true,
                          }))
                        }
                      ></i>
                    )}
                  </div>
                </div>
                <div className="mt-4 mb-3">
                  <div className="w-4/5 mx-auto mb-1 relative">
                    <input
                      className={`p-2 rounded-md bg-transparent w-full border border-solid shadow outline-none placeholder:italic placeholder:text-black ${
                        dataFormPass.warnRePass ? " border-red-500" : null
                      }`}
                      type={"password"}
                      placeholder="Nhập lại mật khẩu"
                      value={dataFormPass?.rePassword}
                      onChange={(e) => {
                        setDataFormPass((prev) => ({
                          ...prev,
                          warnRePass: "",
                          rePassword: e.target.value,
                        }));
                      }}
                    />
                    <p className="text-rose-700 indent-1 warn w-full mb-1">
                      {dataFormPass?.warnRePass}
                    </p>
                  </div>
                </div>
                <div className="mt-4 mb-3">
                  <div className="w-4/5 mx-auto mb-1 relative">
                    <button
                      onClick={() => {
                        if (handleValidateChangePass()) {
                          handleSubmitChangePass();
                        }
                      }}
                      className="border border-solid px-4 py-1 rounded-md hover:opacity-75 flex items-end bg-green-500 text-white"
                    >
                      Đổi mật khẩu.
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </Loading>
    </div>
  );
}

export default SettingPage;
