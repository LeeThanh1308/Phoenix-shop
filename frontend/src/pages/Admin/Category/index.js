import { SearchOutlined } from "@ant-design/icons";
import React, { useRef, useState, useEffect } from "react";
import Highlighter from "react-highlight-words";
import { Button, Input, Space, Table } from "antd";
import Cookies from "js-cookie";
import Toast from "../../../components/Toast";
import HttpRequest from "../../../utils/axios/HttpRequest";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthRequest from "../../../utils/axios/AuthRequest";
import moment from "moment";
function CategoryPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [renderUI, setRenderUI] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [dataColum, setDataColum] = useState([]);
  const [reClose, setReClose] = useState(false);
  const Token = Cookies.get("Token");
  const [dataForm, setDataForm] = useState({
    name: null,
  });
  const [warnForm, setWarnForm] = useState({
    name: null,
  });

  useEffect(() => {
    setDataForm({
      name: null,
    });
    setWarnForm({
      name: null,
    });
  }, [showAddUser]);

  useEffect(() => {
    AuthRequest.get("categories")
      .then((response) => response.data)
      .then((response) => {
        // console.log(response);
        const data = response[0] ? response : [];
        setDataColum(data);
      })
      .catch((e) => {
        // console.log(e);
      });
  }, [renderUI]);

  const handleSetWarning = (key, value) => {
    setWarnForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  let handleValidations = (e) => {
    let type = e?.type;
    if (type === "blur") {
      let key = e.target.name;
      if (dataForm[key]) {
        handleSetWarning(key, null);
      } else {
        handleSetWarning(key, "Trường này không được để trống!");
      }
    } else {
      if (!dataForm.name) {
        handleSetWarning("name", "Trường này không được để trống!");
      }
      if (!dataForm.slug) {
        handleSetWarning("slug", "Trường này không được để trống!");
      }
      if (dataForm.name && dataForm.slug) {
        return true;
      }
    }
  };

  function handleSubmitForm() {
    if (dataForm.name) {
      if (showAddUser) {
        setIsLoading(true);
        AuthRequest.post("categories", dataForm)
          .then((response) => response.data)
          .then((data) => {
            if (data) {
              setShowAddUser(!showAddUser);
              setRenderUI(!renderUI);
            }
            Toast(1, data.message);
          })
          .catch((error) => {})
          .finally(() => {
            setIsLoading(false);
          });
      }
      if (showEditUser) {
        setIsLoading(true);
        AuthRequest.patch("categories/" + dataForm.id, dataForm)
          .then((response) => response.data)
          .then((data) => {
            if (data) {
              setShowEditUser(!showEditUser);
              setRenderUI(!renderUI);
              Toast(1, data.message);
            }
          })
          .catch((error) => {
            // console.log(error);
          })
          .finally(() => setIsLoading(false));
      }
    }
  }
  const data = dataColum;
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
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      ...getColumnSearchProps("slug"),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      ...getColumnSearchProps("createdAt"),
      render: (_, record) => {
        return moment(record?.createdAt).format("DD/MM/YYYY HH:mm:ss");
      },
    },
    {
      title: "Cập nhật lần cuối",
      dataIndex: "updatedAt",
      key: "updatedAt",
      ...getColumnSearchProps("updatedAt"),
      render: (_, record) => {
        return moment(record?.updatedAt).format("DD/MM/YYYY HH:mm:ss");
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <span
            className=" cursor-pointer hover:text-sky-500"
            onClick={(e) => {
              setDataForm((prev) => ({
                ...prev,
                id: record.id,
              }));
              setShowEditUser(true);
            }}
          >
            Sửa
          </span>
          <span
            className=" cursor-pointer hover:text-rose-500"
            onClick={(e) => {
              let result = window.confirm(
                "Bạn chắc chắn muốn xoá danh mục " + record.name
              );
              if (result) setIsLoading(true);
              AuthRequest.delete("categories/" + record.id)
                .then((response) => response.data)
                .then((data) => {
                  if (data) {
                    setRenderUI(!renderUI);
                  }
                  Toast(1, data.message);
                })
                .catch((err) => {})
                .finally(() => setIsLoading(false));
            }}
          >
            Delete
          </span>
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

  // console.log(dataForm);

  return (
    <div className="w-full h-full z-10 text-black relative">
      <div className="p-6 z-0">
        <div className="flex justify-between items-center">
          <div className="mb-4 font-bold text-5xl">Quản trị danh mục</div>
          <div
            className="font-bold rounded bg-green-500 p-2 px-3 text-white text-lg hover:bg-green-400 cursor-pointer"
            onClick={(e) => setShowAddUser(true)}
          >
            Thêm danh mục +
          </div>
        </div>
        <Table columns={columns} dataSource={data} />
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
                <div className="font-bold text-2xl">Thêm danh mục</div>
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
                <div className="mt-4 mb-3 w-11/12 mx-auto">
                  <div className="w-full flex justify-between items-center">
                    <div className="w-1/12 font-bold text-base">
                      Tên Danh Mục:
                    </div>
                    <div className="w-11/12">
                      <input
                        onBlur={(e) => handleValidations(e)}
                        onChange={(e) => {
                          setWarnForm({
                            name: "",
                            slug: "",
                          });
                          setDataForm((prev) => ({
                            ...prev,
                            slug: handleRegexSlug(e.target.value),
                            [e.target.name]: e.target.value,
                          }));
                        }}
                        type="text"
                        name="name"
                        value={dataForm.name}
                        placeholder="Tên danh mục"
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
                    <div className="1/12 font-bold text-base">Slug:</div>
                    <div className="w-11/12">
                      <input
                        onBlur={(e) => handleValidations(e)}
                        value={dataForm.slug}
                        type="text"
                        name="slug"
                        placeholder="Tên danh mục"
                        disabled
                        className={`p-2 rounded-md w-full placeholder:italic bg-slate-50/0`}
                      />
                      <p className="text-rose-700 indent-1 warn w-full mb-1">
                        {warnForm.slug}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={(e) => {
                        const valid = handleValidations(e);
                        if (valid) {
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
                <div className="font-bold text-2xl">Sửa thông danh mục</div>
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
                  <div className="w-full flex justify-between items-center">
                    <div className="w-1/12 font-bold text-base">
                      Tên Danh Mục:
                    </div>
                    <div className="w-11/12">
                      <input
                        onBlur={(e) => handleValidations(e)}
                        onChange={(e) => {
                          setWarnForm({
                            name: "",
                            slug: "",
                          });
                          setDataForm((prev) => ({
                            ...prev,
                            slug: handleRegexSlug(e.target.value),
                            [e.target.name]: e.target.value,
                          }));
                        }}
                        type="text"
                        name="name"
                        value={dataForm.name}
                        placeholder="Tên danh mục"
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
                    <div className="1/12 font-bold text-base">Slug:</div>
                    <div className="w-11/12">
                      <input
                        onBlur={(e) => handleValidations(e)}
                        value={dataForm.slug}
                        type="text"
                        name="slug"
                        placeholder="Tên danh mục"
                        disabled
                        className={`p-2 rounded-md w-full placeholder:italic bg-slate-50/0`}
                      />
                      <p className="text-rose-700 indent-1 warn w-full mb-1">
                        {warnForm.slug}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={(e) => {
                        const valid = handleValidations(e);
                        if (valid) {
                          handleSubmitForm();
                        }
                      }}
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
      {isLoading ? (
        <div className="absolute top-0 right-0 left-0 bottom-0 bg-black/90 z-50 flex justify-center items-center">
          <div className="loader">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default CategoryPage;
