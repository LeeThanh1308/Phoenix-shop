import {
  SearchOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import Highlighter from "react-highlight-words";
import { Button, Input, Space, Table, Statistic } from "antd";
import moment from "moment";
import Toast from "./../../../components/Toast";
import AuthRequest from "../../../utils/axios/AuthRequest";
import Loading from "./../../../components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function UserPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [reClose, setReClose] = useState(false);
  const [renderUI, setRenderUI] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [roles, setRoles] = useState([]);
  const [dataForm, setDataForm] = useState({
    fullname: "",
    gender: "",
    password: "",
    birthday: "",
    phone: "",
    email: "",
    roles: { id: "" },
  });
  const [warnForm, setWarnForm] = useState({
    fullname: "",
    gender: "",
    password: "",
    birthday: "",
    reEnterPass: "",
    phone: "",
    email: "",
  });
  const [dataColum, setDataColum] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  useLayoutEffect(() => {
    if (showAddUser || !showEditUser)
      setDataForm({
        fullname: "",
        gender: "",
        password: "",
        birthday: "",
        phone: "",
        email: "",
        role: "",
        avatar: "",
      });
    if (showAddUser || showEditUser)
      setWarnForm({
        fullname: "",
        gender: "",
        password: "",
        birthday: "",
        phone: "",
        email: "",
        role: "",
        avatar: "",
      });
  }, [showAddUser, showEditUser]);

  useEffect(() => {
    setIsLoading(true);
    AuthRequest.get("accounts/users")
      .then((response) => response.data)
      .then((response) => {
        setDataColum(response.data || []);
        setTotalUsers(response.users || []);
        setRoles(response.roleSet || []);
      })
      .catch((e) => {})
      .finally(() => {
        setIsLoading(false);
      });
  }, [renderUI]);
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
        case "fullname":
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
            }
          }
          break;
        default:
          break;
      }
    } else {
      let message = {};
      Object.keys(dataForm).map((key) => {
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
          case "avatar":
            if (dataForm[key]) {
              const valid = /.(jpg|jpeg|png|gif|bmp|svg|webp|tiff|ico)$/.test(
                dataForm.avatar.name
              );
              if (valid) {
                message[key] = null;
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
      )
        handleSubmitForm();
    }
  };

  function handleSubmitForm() {
    if (
      dataForm.fullname &&
      dataForm.birthday &&
      dataForm.email &&
      dataForm.gender &&
      dataForm.phone
    ) {
      if (showAddUser) {
        setIsLoading(true);
        AuthRequest.post("accounts", dataForm)
          .then((response) => response.data)
          .then((data) => {
            if (data.field) {
              setWarnForm((prev) => ({
                ...prev,
                ...data.field,
              }));
            }
            if (data.message) {
              setShowAddUser(!showAddUser);
              setRenderUI(!renderUI);
              Toast(1, data.message);
            }
          })
          .catch((error) => {
            // console.log(error);
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else if (showEditUser) {
        const {
          id,
          fullname,
          birthday,
          phone,
          email,
          password,
          gender,
          roles,
        } = dataForm;
        setIsLoading(true);
        AuthRequest.patch("accounts/edit/" + id, {
          fullname,
          birthday,
          phone,
          email,
          password,
          gender,
          roles: roles ? roles : null,
        })
          .then((response) => response.data)
          .then((data) => {
            if (data.field) {
              setWarnForm((prev) => ({
                ...prev,
                ...data.field,
              }));
            } else {
              setShowEditUser(!showEditUser);
              setRenderUI(!renderUI);
              Toast(1, data.message);
            }
          })
          .catch((e) => {})
          .finally(() => {
            setIsLoading(false);
          });
      }
    }
  }
  let data = dataColum;

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            className="text-black"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  const columns = [
    {
      title: "Ảnh đại diện",
      dataIndex: "avatar",
      key: "avatar",

      render: (_, record) => (
        <div className="w-10 h-10">
          <img
            src={`${process.env.REACT_APP_DOMAIN_API}${process.env.REACT_APP_URL_AVATAR}${record?.avatar}`}
            alt=""
            className="w-full h-full"
          />
        </div>
      ),
    },
    {
      title: "Họ và tên",
      dataIndex: "fullname",
      key: "fullname",
      ...getColumnSearchProps("fullname"),
      sorter: (a, b) => a.fullname.length - b.fullname.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
      sorter: (a, b) => a.email.length - b.email.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      ...getColumnSearchProps("phone"),
      sorter: (a, b) => a.phone - b.phone,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthday",
      key: "birthday",
      ...getColumnSearchProps("birthday"),
      sorter: (a, b) => (moment(a.date).isBefore(b.date) ? -1 : 1),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      // ...getColumnSearchProps("gender"),
      sorter: (a, b) =>
        (a.gender === "x" ? "Nam" : a.gender === "y" ? "Nữ" : "Khác").length -
        (b.gender === "x" ? "Nam" : b.gender === "y" ? "Nữ" : "Khác").length,
      sortDirections: ["descend", "ascend"],
      render: (_, record) =>
        record.gender === "x" ? "Nam" : record.gender === "y" ? "Nữ" : "Khác",
    },
    {
      title: "Usid",
      dataIndex: "usid",
      key: "usid",
      ...getColumnSearchProps("usid"),
    },
    {
      title: "Khóa tài khoản",
      dataIndex: "ban",
      key: "ban",
      sorter: (a, b) => a.ban - b.ban,
      render: (_, record) => (
        <>
          {record.ban ? (
            <p className=" text-red-500">
              <LockOutlined /> Lock
            </p>
          ) : (
            <p className=" text-sky-500">
              <UnlockOutlined /> Unlock
            </p>
          )}
        </>
      ),
    },
    {
      title: "Quyền",
      dataIndex: "roles",
      key: "roles",
      // ...getColumnSearchProps("roles"),
      sorter: (a, b) =>
        JSON.stringify(a?.roles).length - JSON.stringify(b?.roles).length,
      sortDirections: ["descend", "ascend"],
      render: (_, record) => record?.roles?.description || "Khách",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
      sortDirections: ["descend", "ascend"],
      render: (_, record) => {
        const currentDate = new Date(record.createdAt);
        const newDate = new Date();
        const createdAt = moment(record.createdAt);
        const currentMoment = moment(newDate);

        let years = currentMoment.diff(createdAt, "years");
        createdAt.add(years, "years");

        let months = currentMoment.diff(createdAt, "months");
        createdAt.add(months, "months");

        let days = currentMoment.diff(createdAt, "days");
        return (
          <p>
            {currentDate.toLocaleDateString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}{" "}
            - {`${years} năm, ${months} tháng, ${days} ngày`}
          </p>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            className=" border border-sky-500 text-sky-500"
            onClick={(e) => {
              setDataForm(record);
              setShowEditUser(true);
            }}
          >
            Sửa
          </Button>
          <Button
            danger
            className=" cursor-pointer hover:bg-red-500"
            onClick={(e) => {
              let result = window.confirm(
                "Bạn chắc chắn muốn xoá tài khoản " + record.email
              );
              if (result) {
                setIsLoading(true);
                AuthRequest.delete("accounts/" + record.id)
                  .then((response) =>
                    response.statusText === "OK" ? response.data : null
                  )
                  .then((data) => {
                    if (data) {
                      Toast(1, data.message);
                      setRenderUI(!renderUI);
                    }
                  })
                  .finally(() => {
                    setIsLoading(false);
                  });
              }
            }}
          >
            Delete
          </Button>

          <Button
            className=" cursor-pointer hover:text-sky-500 flex items-center"
            onClick={() => {
              let result = window.confirm(
                `Bạn chắc chắn muốn ${
                  record.ban ? "mở khóa" : "khóa"
                } tài khoản ` + record.email
              );
              if (result) {
                setIsLoading(true);
                AuthRequest.patch("accounts/ban/" + record.id, {
                  ban: !record.ban,
                })
                  .then((response) =>
                    response.statusText === "OK" ? response.data : null
                  )
                  .then((data) => {
                    if (data) {
                      Toast(1, data.message);
                      setRenderUI(!renderUI);
                    }
                  })
                  .catch((err) => {
                    const message = err?.response?.data?.message;
                    if (message) {
                      Toast(3, message);
                    } else {
                      Toast(3, "Có lỗi sảy ra vui lòng thử lại sau!");
                    }
                  })
                  .finally(() => {
                    setIsLoading(false);
                  });
              }
            }}
          >
            {record.ban ? <UnlockOutlined /> : <LockOutlined />}
            {record.ban ? "Mở khóa" : "Khóa tài khoản"}
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <div className="w-full h-auto z-10 text-black relative">
      <Loading status={isLoading}>
        <div className="">
          <div className="flex justify-between items-center">
            <div className="mb-4 font-bold text-5xl">Quản trị user</div>
            <div
              className="font-bold rounded bg-green-500 p-2 px-3 text-white text-lg hover:bg-green-400 cursor-pointer"
              onClick={(e) => setShowAddUser(true)}
            >
              Thêm user +
            </div>
          </div>
          <div className="w-full h-auto bg-white">
            <Table columns={columns} dataSource={data} />
          </div>
          <div className=" absolute left-6 bottom-0">
            <Statistic title="Tổng tài khoản người dùng" value={totalUsers} />
          </div>
        </div>

        {showAddUser ? (
          <div
            className="absolute top-0 right-0 left-0 bottom-0 bg-white z-10"
            onClick={(e) => setShowAddUser(false)}
          >
            <div
              className="w-2/3 bg-white mx-auto p-4 relative shadow-lg shadow-black rounded-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full text-slate-950">
                <div className="flex justify-between items-center">
                  <div className="font-bold text-2xl">Thêm tài khoản</div>
                  <div className="" onClick={(e) => setShowAddUser(false)}>
                    <div
                      className="w-7 h-7 rounded-full text-black/70 text-sm flex justify-center cursor-pointer items-center bg-rose-500"
                      onMouseEnter={(e) => setReClose(true)}
                      onMouseLeave={(e) => setReClose(false)}
                    >
                      {reClose ? (
                        <FontAwesomeIcon
                          icon="fa-solid fa-xmark"
                          className="text-white"
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
                <div>
                  <div
                    className="mt-4 mb-3 w-11/12 mx-auto"
                    onChange={(e) => {
                      setWarnForm((prev) => ({
                        ...prev,
                        [e.target.name]: "",
                      }));
                      setDataForm((prev) => ({
                        ...prev,
                        [e.target.name]: e.target.value,
                      }));
                    }}
                  >
                    <div className="w-full flex justify-between">
                      <div className="w-3/4 mr-1">
                        <input
                          onChange={(e) => {
                            setWarnForm((prev) => ({
                              ...prev,
                              [e.target.name]: "",
                            }));
                            setDataForm((prev) => ({
                              ...prev,
                              [e.target.name]: e.target.value,
                            }));
                          }}
                          onBlur={(e) => handleValidations(e)}
                          type="text"
                          name="fullname"
                          value={dataForm.fullname}
                          placeholder="Họ và tên"
                          className={`p-2 rounded-md w-full border border-solid outline-none placeholder:italic bg-slate-50/0 ${
                            !warnForm.fullname ? null : "border-rose-500"
                          }`}
                        />
                        <p className="text-rose-700 indent-1 warn w-full mb-1">
                          {warnForm.fullname}
                        </p>
                      </div>

                      <div className="w-1/4 mr-1">
                        <div className="mb-2 w-full mr-1">
                          <input
                            onChange={(e) => {
                              setWarnForm((prev) => ({
                                ...prev,
                                [e.target.name]: "",
                              }));
                              setDataForm((prev) => ({
                                ...prev,
                                [e.target.name]: e.target.value,
                              }));
                            }}
                            onBlur={(e) => handleValidations(e)}
                            type="date"
                            value={dataForm.birthday}
                            name="birthday"
                            className={`p-2 rounded-md w-full border border-solid outline-none placeholder:italic bg-slate-50/0 ${
                              !warnForm.birthday ? null : "border-rose-500"
                            }`}
                          />
                          <p className="text-rose-700 indent-1 warn w-full mb-1">
                            {warnForm.birthday}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="w-full flex justify-between">
                      <div className="mb-2 w-1/3 mr-1">
                        <div className="w-full mx-auto mb-2">
                          <input
                            onChange={(e) => {
                              setWarnForm((prev) => ({
                                ...prev,
                                [e.target.name]: "",
                              }));
                              setDataForm((prev) => ({
                                ...prev,
                                [e.target.name]: e.target.value,
                              }));
                            }}
                            onBlur={(e) => handleValidations(e)}
                            type="text"
                            name="phone"
                            value={dataForm.phone}
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
                      <div className="mb-2 w-2/3">
                        <div className="w-full mx-auto mb-2">
                          <input
                            onChange={(e) => {
                              setWarnForm((prev) => ({
                                ...prev,
                                [e.target.name]: "",
                              }));
                              setDataForm((prev) => ({
                                ...prev,
                                [e.target.name]: e.target.value,
                              }));
                            }}
                            onBlur={(e) => handleValidations(e)}
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={dataForm.email}
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

                    <div className="w-full flex justify-between items-center">
                      <div className="mb-2 w-3/5 mr-1">
                        <input
                          onChange={(e) => {
                            setWarnForm((prev) => ({
                              ...prev,
                              [e.target.name]: "",
                            }));
                            setDataForm((prev) => ({
                              ...prev,
                              [e.target.name]: e.target.value,
                            }));
                          }}
                          type="text"
                          onBlur={(e) => handleValidations(e)}
                          name="password"
                          value={dataForm.password}
                          placeholder="Mật khẩu"
                          className={`p-2 rounded-md w-full border border-solid outline-none placeholder:italic bg-slate-50/0 ${
                            !warnForm.password ? null : "border-rose-500"
                          }`}
                        />
                        <p className="text-rose-700 indent-1 warn w-full mb-1">
                          {warnForm.password}
                        </p>
                      </div>
                      <div className="mb-2 w-2/5 mr-1">
                        <select
                          onChange={(e) => {
                            setWarnForm((prev) => ({
                              ...prev,
                              [e.target.name]: "",
                            }));
                            setDataForm((prev) => ({
                              ...prev,
                              [e.target.name]: e.target.value,
                            }));
                          }}
                          name="gender"
                          className={`w-full p-2 border border-solid rounded-md bg-slate-50/0 placeholder:italic bg-slate-50/0${
                            !warnForm.gender ? null : "border-rose-500"
                          }`}
                          defaultValue={
                            dataForm.gender ? dataForm.gender : "default"
                          }
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
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={handleValidations}
                        className="px-4 py-1 rounded-md hover:opacity-75 bg-sky-500 text-white font-bold"
                      >
                        Thêm
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {showEditUser ? (
          <div
            className="absolute top-0 right-0 left-0 bottom-0 bg-white z-10"
            onClick={(e) => setShowEditUser(false)}
          >
            <div
              className="w-2/3 bg-white mx-auto p-4 relative shadow-lg shadow-black rounded-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full text-slate-950">
                <div className="flex justify-between items-center">
                  <div className="font-bold text-2xl">
                    Sửa thông tin người dùng
                  </div>
                  <div className="" onClick={(e) => setShowEditUser(false)}>
                    <div
                      className="w-7 h-7 rounded-full text-black/70 text-sm flex justify-center cursor-pointer items-center bg-rose-500"
                      onMouseEnter={(e) => setReClose(true)}
                      onMouseLeave={(e) => setReClose(false)}
                    >
                      {reClose ? (
                        <FontAwesomeIcon
                          icon="fa-solid fa-xmark"
                          className="text-white"
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="mt-4 mb-3 w-11/12 mx-auto">
                    <div className="w-full flex justify-between">
                      <div className="w-3/4 mr-1">
                        <input
                          onChange={(e) => {
                            setWarnForm((prev) => ({
                              ...prev,
                              [e.target.name]: "",
                            }));
                            setDataForm((prev) => ({
                              ...prev,
                              [e.target.name]: e.target.value,
                            }));
                          }}
                          onBlur={(e) => handleValidations(e)}
                          value={dataForm.fullname}
                          type="text"
                          name="fullname"
                          placeholder="Họ và tên"
                          className={`p-2 rounded-md w-full border border-solid outline-none placeholder:italic bg-slate-50/0 ${
                            !warnForm.fullname ? null : "border-rose-500"
                          }`}
                        />
                        <p className="text-rose-700 indent-1 warn w-full mb-1">
                          {warnForm.fullname}
                        </p>
                      </div>

                      <div className="w-1/4 mr-1">
                        <div className="mb-2 w-full mr-1">
                          <input
                            onChange={(e) => {
                              setWarnForm((prev) => ({
                                ...prev,
                                [e.target.name]: "",
                              }));
                              setDataForm((prev) => ({
                                ...prev,
                                [e.target.name]: e.target.value,
                              }));
                            }}
                            onBlur={(e) => handleValidations(e)}
                            value={dataForm.birthday}
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
                      </div>
                    </div>
                    <div className="w-full flex justify-between">
                      <div className="mb-2 w-1/3 mr-1">
                        <div className="w-full mx-auto mb-2">
                          <input
                            onChange={(e) => {
                              setWarnForm((prev) => ({
                                ...prev,
                                [e.target.name]: "",
                              }));
                              setDataForm((prev) => ({
                                ...prev,
                                [e.target.name]: e.target.value,
                              }));
                            }}
                            onBlur={(e) => handleValidations(e)}
                            value={dataForm.phone}
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
                      <div className="mb-2 w-2/3">
                        <div className="w-full mx-auto mb-2">
                          <input
                            onChange={(e) => {
                              setWarnForm((prev) => ({
                                ...prev,
                                [e.target.name]: "",
                              }));
                              setDataForm((prev) => ({
                                ...prev,
                                [e.target.name]: e.target.value,
                              }));
                            }}
                            onBlur={(e) => handleValidations(e)}
                            value={dataForm.email}
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

                    <div className="w-full flex justify-between">
                      <div className="mb-2 w-3/5 mr-1">
                        <input
                          onChange={(e) => {
                            setWarnForm((prev) => ({
                              ...prev,
                              [e.target.name]: "",
                            }));
                            setDataForm((prev) => ({
                              ...prev,
                              [e.target.name]: e.target.value,
                            }));
                          }}
                          value={dataForm.password}
                          type="text"
                          name="password"
                          placeholder="Đổi mật khẩu(Để trống nếu không muốn đổi)"
                          className={`p-2 rounded-md w-full border border-solid outline-none placeholder:italic bg-slate-50/0 ${
                            !warnForm.password ? null : "border-rose-500"
                          }`}
                        />
                        <p className="text-rose-700 indent-1 warn w-full mb-1">
                          {warnForm.password}
                        </p>
                      </div>
                      <div className="mb-2 w-2/5 mr-1">
                        <select
                          onChange={(e) => {
                            setWarnForm((prev) => ({
                              ...prev,
                              [e.target.name]: "",
                            }));
                            setDataForm((prev) => ({
                              ...prev,
                              [e.target.name]: e.target.value,
                            }));
                          }}
                          name="gender"
                          className={`w-full p-2 border border-solid rounded-md bg-slate-50/0 ${
                            !warnForm.gender ? null : "border-rose-500"
                          }`}
                          defaultValue={dataForm.gender}
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
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={handleValidations}
                        className="px-4 py-1 rounded-md hover:opacity-75 bg-sky-500 text-white font-bold"
                      >
                        Cập nhật
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Loading>
    </div>
  );
}

export default UserPage;
