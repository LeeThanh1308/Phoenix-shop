import {
  LockOutlined,
  UnlockOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import moment from "moment";
import Highlighter from "react-highlight-words";
import { Button, Input, Space, Table, Empty, Divider } from "antd";
import Toast from "./../../../../components/Toast";
import Loading from "./../../../../components/Loading";
import AuthRequest from "./../../../../utils/axios/AuthRequest";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OrgChart from "./../../../../components/OrgChart";

function EmployeePositions() {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [renderUI, setRenderUI] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [dataColum, setDataColum] = useState([]);
  const [reClose, setReClose] = useState(false);
  const [dataForm, setDataForm] = useState({});
  const [warnForm, setWarnForm] = useState({});
  const [dataPermises, setDataPermises] = useState([]);
  const [activePermises, setActivePermises] = useState();
  const [showDetailPermises, setShowPremises] = useState(false);
  const [optRoles, setOptRoles] = useState([]);
  const [personnel, setPersonnel] = useState([]);
  useEffect(() => {
    if (!showEditUser || showAddUser) {
      setDataForm({});
      setWarnForm({});
      setPersonnel([]);
    }
  }, [showAddUser, showEditUser]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await AuthRequest.get("premises")
        .then((response) => response.data)
        .then((data) => {
          setDataPermises(data);
          if (activePermises >= 0) {
            setDataColum([
              data[activePermises].manage,
              ...data[activePermises].staff,
            ]);
          }
        })
        .catch((error) => {
          // console.log(error);
        });
      setIsLoading(false);
    })();
  }, [renderUI]);

  useLayoutEffect(() => {
    if (showAddUser) {
      setIsLoading(true);
      AuthRequest.get("premises/role/" + dataPermises[activePermises].id)
        .then((response) => response.data)
        .then((data) => {
          if (data.length > 0) {
            setOptRoles(data);
          }
        })
        .catch(() => {})
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [showAddUser]);

  useEffect(() => {
    if (dataForm.role) {
      setIsLoading(true);
      AuthRequest.get("premises/accounts")
        .then((response) => response.data)
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setPersonnel(data);
          }
        })
        .catch(() => {})
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [dataForm.role]);

  const handleSetWarning = (key, value) => {
    setWarnForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  let handleValidations = (e) => {
    if (!dataForm.role) {
      handleSetWarning("role", "Bạn chưa chọn chức vụ bổ nhiệm!");
    }
    if (!dataForm.personnel) {
      handleSetWarning("personnel", "Bạn chưa chọn người bổ nhiệm!");
      setTimeout(() => {
        handleSetWarning("personnel", "");
      }, 3000);
    }

    if (dataForm.role && dataForm.personnel) {
      return true;
    }
  };

  function handleSubmitForm() {
    handleValidations();
    if (showAddUser) {
      setIsLoading(true);
      AuthRequest.patch("premises/accounts", {
        id: dataForm?.personnel?.id,
        [dataForm.role === "Manage" ? "role" : "roles"]:
          dataPermises[activePermises]?.id,
      })
        .then((response) => response.data)
        .then((data) => {
          if (data.message) {
            setShowAddUser(!showAddUser);
            setRenderUI(!renderUI);
            Toast(1, data.message);
          }
          if (data.field) {
            setWarnForm((prev) => ({
              ...prev,
              description: data.field.description,
            }));
          }
        })
        .catch((error) => {});
      setIsLoading(false);
    }
    if (showEditUser) {
      setIsLoading(true);
      AuthRequest.patch("premises/" + dataForm.id, dataForm)
        .then((response) => response.data)
        .then((data) => {
          if (data.message) {
            setShowEditUser(!showEditUser);
            setRenderUI(!renderUI);
            Toast(1, data.message);
          }
        })
        .catch((error) => {
          Toast(
            1,
            error?.response?.data?.message ||
              "Có lỗi xảy ra xin vui lòng thử lại sau."
          );
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
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
            alt="avatar"
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
      sorter: (a, b) => a?.fullname?.length - b?.fullname?.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
      sorter: (a, b) => a?.email?.length - b?.email?.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      ...getColumnSearchProps("phone"),
      sorter: (a, b) => a?.phone - b?.phone,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthday",
      key: "birthday",
      ...getColumnSearchProps("birthday"),
      sorter: (a, b) => (moment(a?.date).isBefore(b?.date) ? -1 : 1),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      // ...getColumnSearchProps("gender"),
      sorter: (a, b) =>
        (a?.gender === "x" ? "Nam" : a?.gender === "y" ? "Nữ" : "Khác").length -
        (b?.gender === "x" ? "Nam" : b?.gender === "y" ? "Nữ" : "Khác").length,
      sortDirections: ["descend", "ascend"],
      render: (_, record) =>
        record?.gender === "x" ? "Nam" : record?.gender === "y" ? "Nữ" : "Khác",
    },
    {
      title: "Khóa tài khoản",
      dataIndex: "ban",
      key: "ban",
      sorter: (a, b) => a?.ban - b?.ban,
      render: (_, record) => (
        <>
          {record?.ban ? (
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
      title: "Chức vụ",
      dataIndex: "roles",
      key: "roles",
      // ...getColumnSearchProps("roles"),
      sorter: (a, b) =>
        JSON.stringify(a?.roles).length - JSON.stringify(b?.roles).length,
      sortDirections: ["descend", "ascend"],
      render: (_, record) => record?.roles?.description || "Khách",
    },
    {
      title: "Đã tham gia",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
      sortDirections: ["descend", "ascend"],
      render: (_, record) => {
        const newDate = new Date();
        const createdAt = moment(record.createdAt);
        const currentMoment = moment(newDate);

        let years = currentMoment.diff(createdAt, "years");
        createdAt.add(years, "years");

        let months = currentMoment.diff(createdAt, "months");
        createdAt.add(months, "months");

        let days = currentMoment.diff(createdAt, "days");
        return <p>{`${years} năm, ${months} tháng, ${days} ngày`}</p>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {/* <Button
            type="primary"
            className=" border border-sky-500 text-sky-500"
            onClick={(e) => {
              setDataForm(record);
              setShowEditUser(true);
            }}
          >
            Xóa quyền
          </Button> */}
          <Button
            danger
            className=" cursor-pointer hover:bg-red-500 hover:text-white font-bold"
            onClick={(e) => {
              let result = window.confirm(
                "Bạn chắc chắn muốn hủy chức " +
                  record?.roles?.description +
                  " của " +
                  record?.fullname
              );
              if (result) {
                setIsLoading(true);
                AuthRequest.delete("premises/role/" + record.id)
                  .then((response) =>
                    response.statusText === "OK" ? response.data : null
                  )
                  .then((data) => {
                    if (data) {
                      Toast(1, data.message);
                      setRenderUI(!renderUI);
                    }
                  })
                  .catch((e) => {})
                  .finally(() => {
                    setIsLoading(false);
                  });
              }
            }}
          >
            Xóa quyền
          </Button>

          <Button
            className=" cursor-pointer hover:text-sky-500 flex items-center"
            onClick={() => {
              let result = window.confirm(
                `Bạn chắc chắn muốn ${
                  record?.ban ? "mở khóa" : "khóa"
                } tài khoản ` + record?.email
              );
              if (result) {
                setIsLoading(true);
                AuthRequest.patch("accounts/ban/" + record?.id, {
                  ban: !record?.ban,
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
            {record?.ban ? <UnlockOutlined /> : <LockOutlined />}
            {record?.ban ? "Mở khóa" : "Khóa tài khoản"}
          </Button>
        </Space>
      ),
    },
  ];

  const columnPersonnel = [
    {
      title: "Ảnh đại diện",
      dataIndex: "avatar",
      key: "avatar",

      render: (_, record) => (
        <div className="w-10 h-10">
          <img
            src={`${process.env.REACT_APP_DOMAIN_API}${process.env.REACT_APP_URL_AVATAR}${record?.avatar}`}
            alt="avatar"
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
      sorter: (a, b) => a?.fullname?.length - b?.fullname?.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
      sorter: (a, b) => a?.email?.length - b?.email?.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      ...getColumnSearchProps("phone"),
      sorter: (a, b) => a?.phone - b?.phone,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthday",
      key: "birthday",
      ...getColumnSearchProps("birthday"),
      sorter: (a, b) => (moment(a?.date).isBefore(b?.date) ? -1 : 1),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      // ...getColumnSearchProps("gender"),
      sorter: (a, b) =>
        (a?.gender === "x" ? "Nam" : a?.gender === "y" ? "Nữ" : "Khác").length -
        (b?.gender === "x" ? "Nam" : b?.gender === "y" ? "Nữ" : "Khác").length,
      sortDirections: ["descend", "ascend"],
      render: (_, record) =>
        record?.gender === "x" ? "Nam" : record?.gender === "y" ? "Nữ" : "Khác",
    },
    {
      title: "Thâm niên",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => (moment(a?.createdAt).isBefore(b?.createdAt) ? -1 : 1),
      sortDirections: ["descend", "ascend"],
      render: (_, record) => {
        const currentDate = new Date();
        const createdAt = moment(record?.createdAt);
        const currentMoment = moment(currentDate);

        let years = currentMoment.diff(createdAt, "years");
        createdAt.add(years, "years");

        let months = currentMoment.diff(createdAt, "months");
        createdAt.add(months, "months");

        let days = currentMoment.diff(createdAt, "days");

        return `${years} năm, ${months} tháng, ${days} ngày`;
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
              setPersonnel([]);
              setDataForm((prev) => ({
                ...prev,
                personnel: record,
              }));
            }}
          >
            Bổ nhiệm
          </Button>
        </Space>
      ),
    },
  ];

  const handleRegexSlug = (value) => {
    return value
      ?.normalize("NFD")
      ?.replace(/[\u0300-\u036f]/g, "")
      .replaceAll(" ", "-")
      .replaceAll("--", "-")
      ?.toLowerCase();
  };
  return (
    <div className="w-full h-full">
      <Loading status={isLoading}>
        <div className="w-full h-full z-10 text-black relative">
          <div className="p-6 z-0">
            <div className="flex justify-between items-center">
              <div className="mb-4 font-bold text-5xl">Quản lý nhân sự</div>
              {activePermises >= 0 ? (
                <div className="flex justify-end">
                  <div
                    className="font-bold rounded bg-green-500 p-2 px-3 text-white text-lg hover:bg-green-400 cursor-pointer mx-1"
                    onClick={() => {
                      if (
                        dataPermises[activePermises].manage ||
                        dataPermises[activePermises].staff.length >= 0
                      ) {
                        setShowPremises(true);
                      } else {
                        Toast(0, `Nhân sự trống vui lòng thêm nhân sự.`);
                      }
                    }}
                  >
                    Sơ đồ cơ sở {dataPermises[activePermises]?.name}
                  </div>
                  <div
                    className="font-bold rounded bg-green-500 p-2 px-3 text-white text-lg hover:bg-green-400 cursor-pointer mx-1 flex items-center"
                    onClick={(e) => setShowAddUser(true)}
                  >
                    Thêm chức vụ{" "}
                    <FontAwesomeIcon
                      icon="fa-solid fa-user-plus"
                      className="pl-2"
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="flex flex-wrap justify-start mb-12">
              {dataPermises.map((it, key) => {
                const dataColum =
                  it?.manage || it?.staff.length > 0
                    ? [it?.manage, ...it?.staff]
                    : [];
                return (
                  <div
                    className={` w-1/4 shadow p-4 flex justify-between items-center m-2  ${
                      activePermises === key
                        ? "border border-sky-500 shadow-lg shadow-sky-500 rounded-lg"
                        : "hover:shadow-sky-600 cursor-pointer"
                    }`}
                    key={key}
                    onClick={() => {
                      setActivePermises(key);
                      setDataColum(dataColum);
                    }}
                  >
                    <div className="flex justify-between items-center w-full h-full">
                      <div>
                        <div>
                          <h1 className=" font-bold text-xl  text-rose-600">
                            <i>{it.name}</i>
                          </h1>
                        </div>
                        <div>
                          <h1 className=" font-bold text-md text-sky-500">
                            <span className="font-bold text-rose-600">
                              Địa chỉ:
                            </span>{" "}
                            {it.address}
                          </h1>
                        </div>
                        <div>
                          <h1 className=" font-bold text-md text-sky-500">
                            <span className="font-bold text-rose-600">
                              Số điện thoại:
                            </span>{" "}
                            {it.phone}
                          </h1>
                        </div>
                      </div>

                      <div>
                        <div>
                          <h3 className="font-bold text-sky-500">
                            {it?.manage ? 1 : 0} Quản lý
                          </h3>
                        </div>

                        <div>
                          <h3 className="font-bold text-sky-500">
                            {it?.staff.length} Nhân viên
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {activePermises >= 0 ? (
              <>
                <Divider className="">
                  Quản lý nhân sự cửa hàng{" "}
                  <i className="text-sky-500 font-bold">
                    {dataPermises[activePermises]?.name}
                  </i>
                </Divider>
                <Table
                  columns={columns}
                  dataSource={dataColum.filter((it) => it !== null)}
                />
              </>
            ) : null}
          </div>

          <div>
            <div></div>
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
                    <div className="font-bold text-2xl">
                      Thêm nhân sự cơ sở {dataPermises[activePermises].name}
                    </div>
                    <div className="" onClick={(e) => setShowAddUser(false)}>
                      <div
                        className="w-7 h-7 rounded-full text-black/70 text-sm flex justify-center cursor-pointer items-center bg-rose-500"
                        onMouseEnter={(e) => setReClose(true)}
                        onMouseLeave={(e) => setReClose(false)}
                      >
                        {reClose ? (
                          <FontAwesomeIcon icon="fa-solid fa-xmark" />
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="mt-4 mb-3 w-11/12 mx-auto">
                      <div className="w-full flex justify-between items-center">
                        <div className="w-2/12 font-bold text-base">
                          Chức vụ:
                        </div>
                        <div className="w-10/12">
                          <select
                            onChange={(e) => {
                              // console.log(e.target.value);
                              setWarnForm((prev) => ({
                                ...prev,
                                [e.target.name]: "",
                              }));
                              setDataForm((prev) => ({
                                ...prev,
                                [e.target.name]: e.target.value,
                              }));
                            }}
                            name="role"
                            className={`w-full p-2 border border-solid rounded-md bg-slate-50/0 ${
                              warnForm.role ? "border-red-500" : ""
                            }`}
                            defaultValue={dataForm.role}
                          >
                            <option value={null} hidden className="default">
                              Chọn chức vụ bạn muốn bổ nhiệm
                            </option>
                            {optRoles.map((it, ix) => (
                              <option key={ix} value={it.it}>
                                {it}
                              </option>
                            ))}
                          </select>
                          <p className="text-rose-700 indent-1 warn w-full mb-1">
                            {warnForm.role}
                          </p>
                        </div>
                      </div>
                      {dataForm?.personnel ? (
                        <div className="w-full flex items-center py-4">
                          <div className="w-2/12 font-bold text-base"></div>
                          <div className=" h-28 w-96 shadow shadow-black rounded-md flex items-center relative">
                            <div className="w-24 h-24 rounded-xl shadow shadow-black ml-2">
                              <img
                                src="http://localhost:8080/accounts/profile/banner.jpg-1715944748580-722559187.jpg"
                                alt=""
                              />
                            </div>

                            <div className="mx-8">
                              <div>
                                <h1 className="font-bold">
                                  {dataForm?.personnel?.fullname} -{" "}
                                  {dataForm?.personnel?.birthday}
                                </h1>
                              </div>
                              <div>
                                <h1>{dataForm?.personnel?.email}</h1>
                              </div>

                              <div>
                                <h1>{dataForm?.personnel?.phone}</h1>
                              </div>
                            </div>

                            <div
                              className="absolute top-2 right-2 w-5 h-5 bg-rose-500 rounded-full flex justify-center items-center hover:bg-rose-600 cursor-pointer"
                              onClick={() => {
                                setDataForm((prev) => ({
                                  ...prev,
                                  personnel: "",
                                  role: prev.role,
                                }));
                              }}
                            ></div>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                      {personnel.length >= 0 &&
                      dataForm?.role &&
                      !dataForm?.personnel ? (
                        <div
                          className={`w-full flex-wrap justify-between items-center ${
                            warnForm.personnel ? "border border-red-500 " : null
                          }`}
                        >
                          <Divider className="">
                            Danh sách nhân sự{" "}
                            <i className="text-sky-500 font-bold">
                              {dataForm.role}
                            </i>
                          </Divider>
                          <Table
                            columns={columnPersonnel}
                            dataSource={personnel}
                            scroll={{ y: 240 }}
                          />
                          <p className="text-rose-700 indent-1 warn w-full mb-1">
                            {warnForm.personnel}
                          </p>
                        </div>
                      ) : null}

                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={(e) => {
                            // console.log(dataForm);
                            const result = handleValidations(e);
                            if (result) {
                              handleSubmitForm();
                            }
                          }}
                          className="px-4 py-1 rounded-md hover:opacity-75 bg-sky-500 text-white font-bold"
                        >
                          Thêm nhân sự
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
                    <div className="font-bold text-2xl">Sửa cơ sở</div>
                    <div className="" onClick={(e) => setShowEditUser(false)}>
                      <div
                        className="w-7 h-7 rounded-full text-black/70 text-sm flex justify-center cursor-pointer items-center bg-rose-500"
                        onMouseEnter={(e) => setReClose(true)}
                        onMouseLeave={(e) => setReClose(false)}
                      >
                        {reClose ? (
                          <FontAwesomeIcon icon="fa-solid fa-xmark" />
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="mt-4 mb-3 w-11/12 mx-auto">
                      <div className="w-full flex justify-between items-center">
                        <div className="2/12 font-bold text-base">
                          Tên cửa hàng:
                        </div>
                        <div className="w-10/12">
                          <input
                            onBlur={(e) => handleValidations(e)}
                            onChange={(e) => {
                              setWarnForm((prev) => ({
                                ...prev,
                                name: "",
                              }));
                              setDataForm((prev) => ({
                                ...prev,
                                slug: handleRegexSlug(e.target.value),
                                [e.target.name]: e.target.value,
                              }));
                            }}
                            value={dataForm.name}
                            type="text"
                            name="name"
                            placeholder="Tên cửa hàng."
                            className={`p-2 rounded-md w-full border border-solid outline-none placeholder:italic bg-slate-50/0 ${
                              !warnForm.name ? null : "border-rose-500"
                            }`}
                          />
                          <p className="text-rose-700 indent-1 warn w-full mb-1">
                            {warnForm.name}
                          </p>
                        </div>
                      </div>

                      <div className="w-full flex justify-between items-center">
                        <div className="2/12 font-bold text-base">Slug:</div>
                        <div className="w-10/12">
                          <input
                            onBlur={(e) => handleValidations(e)}
                            type="text"
                            name="slug"
                            value={dataForm?.slug}
                            disabled
                            placeholder="Slug"
                            className={`p-2 rounded-md w-full outline-none placeholder:italic bg-slate-50/0 ${
                              !warnForm.slug ? null : "border-rose-500"
                            }`}
                          />
                          <p className="text-rose-700 indent-1 warn w-full mb-1">
                            {warnForm.slug}
                          </p>
                        </div>
                      </div>

                      <div className="w-full flex justify-between items-center">
                        <div className="2/12 font-bold text-base">Địa chỉ:</div>
                        <div className="w-10/12">
                          <input
                            onBlur={(e) => handleValidations(e)}
                            onChange={(e) => {
                              setWarnForm((prev) => ({
                                ...prev,
                                address: "",
                              }));
                              setDataForm((prev) => ({
                                ...prev,
                                [e.target.name]: e.target.value,
                              }));
                            }}
                            value={dataForm.address}
                            type="text"
                            name="address"
                            placeholder="Địa chỉ cửa hàng."
                            className={`p-2 rounded-md w-full border border-solid outline-none placeholder:italic bg-slate-50/0 ${
                              !warnForm.address ? null : "border-rose-500"
                            }`}
                          />
                          <p className="text-rose-700 indent-1 warn w-full mb-1">
                            {warnForm.address}
                          </p>
                        </div>
                      </div>

                      <div className="w-full flex justify-between items-center">
                        <div className="2/12 font-bold text-base">
                          Số điện thoại:
                        </div>
                        <div className="w-10/12">
                          <input
                            onBlur={(e) => handleValidations(e)}
                            onChange={(e) => {
                              setWarnForm((prev) => ({
                                ...prev,
                                phone: "",
                              }));
                              setDataForm((prev) => ({
                                ...prev,
                                [e.target.name]: e.target.value,
                              }));
                            }}
                            value={dataForm.phone}
                            type="text"
                            name="phone"
                            placeholder="Số điện thoại cửa hàng."
                            className={`p-2 rounded-md w-full border border-solid outline-none placeholder:italic bg-slate-50/0 ${
                              !warnForm.phone ? null : "border-rose-500"
                            }`}
                          />
                          <p className="text-rose-700 indent-1 warn w-full mb-1">
                            {warnForm.phone}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={(e) => {
                            if (handleValidations(e)) {
                              handleSubmitForm();
                            }
                          }}
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

          {showDetailPermises ? (
            <div
              className="absolute top-0 right-0 left-0 bottom-0 bg-white z-10"
              onClick={(e) => setShowPremises(false)}
            >
              <div
                className="w-2/3 bg-white mx-auto p-4 relative shadow-lg shadow-black rounded-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-full text-slate-950">
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-2xl">Sơ đồ tổ chức</div>
                    <div className="" onClick={(e) => setShowPremises(false)}>
                      <div
                        className="w-7 h-7 rounded-full text-black/70 text-sm flex justify-center cursor-pointer items-center bg-rose-500"
                        onMouseEnter={(e) => setReClose(true)}
                        onMouseLeave={(e) => setReClose(false)}
                      >
                        {reClose ? (
                          <FontAwesomeIcon icon="fa-solid fa-xmark" />
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="mt-4 mb-3 w-11/12 mx-auto">
                      <OrgChart data={dataPermises[activePermises]} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {}
      </Loading>
    </div>
  );
}

export default EmployeePositions;
