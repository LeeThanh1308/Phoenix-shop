import Slider from "../../../components/Slider";
import { SearchOutlined } from "@ant-design/icons";
import React, { useRef, useState, useEffect } from "react";
import Highlighter from "react-highlight-words";
import { Button, Input, Space, Table, Empty } from "antd";
import Toast from "../../../components/Toast";
import HttpRequest from "../../../utils/axios/HttpRequest";
import Loading from "../../../components/Loading";
import AuthRequest from "../../../utils/axios/AuthRequest";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UpdloadImage from "../../../components/UploadImage";

function SliderPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [renderUI, setRenderUI] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showDemoSlider, setShowDemoSlider] = useState(false);
  const [dataColum, setDataColum] = useState([]);
  const [reClose, setReClose] = useState(false);
  const [dataForm, setDataForm] = useState({});
  const [warnForm, setWarnForm] = useState({});
  const [defaultUpload, setDefaultUpload] = useState([]);

  useEffect(() => {
    if (!showEditUser || showAddUser) {
      setDataForm({});
      setWarnForm({});
    }
  }, [showAddUser, showEditUser]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await HttpRequest.get("slider")
        .then((response) => response.data)
        .then((data) => {
          // console.log(data);
          setDataColum(data);
        })
        .catch((error) => {
          // console.log(error);
        });
      setIsLoading(false);
    })();
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
      if (dataForm[key]) {
        handleSetWarning(key, null);
      } else {
        handleSetWarning(key, "Trường này không được để trống!");
      }
    } else {
      if (!dataForm.description) {
        handleSetWarning("description", "Trường này không được để trống!");
      }
      if (!dataForm.img && !dataForm.imageUrl) {
        handleSetWarning("imageUrl", "Trường này không được để trống!");
      }
      if (
        dataForm.description &&
        dataForm.slug &&
        (dataForm.img || dataForm.imageUrl)
      ) {
        return true;
      }
    }
  };

  function handleSubmitForm() {
    if (showAddUser) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("description", dataForm.description);
      formData.append("slug", dataForm.slug);
      formData.append("img", ...dataForm?.img);
      AuthRequest.post("slider", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
        .catch((error) => {})
        .finally(() => {
          setIsLoading(false);
        });
    }
    if (showEditUser) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("description", dataForm.description);
      formData.append("slug", dataForm.slug);
      if (dataForm?.img) {
        formData.append("img", ...dataForm?.img);
      }
      AuthRequest.patch("slider/" + dataForm.id, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
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
      title: "Ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (_, record) => (
        <div className=" w-52 h-24">
          <img
            src={`${process.env.REACT_APP_DOMAIN_API}${process.env.REACT_APP_URL_SLIDER}${record?.imageUrl}`}
            alt=""
            className="w-full h-full"
          />
        </div>
      ),
    },

    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },

    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_, record) => {
        const currentDate = new Date(record.createdAt);
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
            })}
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
              // console.log(record);
              setDefaultUpload([
                `${process.env.REACT_APP_URL_SLIDER}${record?.imageUrl}`,
              ]);
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
                "Bạn chắc chắn muốn xoá slider " + record.description
              );
              if (result) {
                setIsLoading(true);
                AuthRequest.delete("slider/" + record.id)
                  .then((response) => response.data)
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
    <Loading status={isLoading}>
      <div className="w-full h-full z-10 text-black relative">
        <div className="w-3/4 flex mx-auto shadow"></div>
        <div className="p-6 z-0">
          <div className="flex justify-between items-center">
            <div className="mb-4 font-bold text-5xl">Quản trị slider</div>
            <div className="flex">
              <div
                className="font-bold rounded bg-green-500 p-2 px-3 text-white text-lg hover:bg-green-400 cursor-pointer mx-1"
                onClick={(e) => setShowDemoSlider(true)}
              >
                Xem demo
              </div>
              <div
                className="font-bold rounded bg-green-500 p-2 px-3 text-white text-lg hover:bg-green-400 cursor-pointer mx-1"
                onClick={(e) => setShowAddUser(true)}
              >
                Thêm silder +
              </div>
            </div>
          </div>
          <Table columns={columns} dataSource={dataColum} />
        </div>

        {showAddUser ? (
          <div
            className="absolute top-0 right-0 left-0 bottom-0  bg-white z-10"
            onClick={(e) => setShowAddUser(false)}
          >
            <div
              className="w-2/3 bg-white mx-auto p-4 relative  shadow-lg shadow-black rounded-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full text-slate-950">
                <div className="flex justify-between items-center">
                  <div className="font-bold text-2xl">Thêm silder</div>
                  <div
                    className=""
                    onClick={(e) => {
                      setShowAddUser(false);
                    }}
                  >
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
                      <div className="2/12 font-bold text-base">
                        Description:
                      </div>
                      <div className="w-10/12">
                        <input
                          onBlur={(e) => handleValidations(e)}
                          onChange={(e) => {
                            setWarnForm((prev) => ({
                              ...prev,
                              description: "",
                            }));
                            setDataForm((prev) => ({
                              ...prev,
                              slug: handleRegexSlug(e.target.value),
                              [e.target.name]: e.target.value,
                            }));
                          }}
                          value={dataForm.description}
                          type="text"
                          name="description"
                          placeholder="Mô tả slider"
                          className={`p-2 rounded-md w-full border border-solid outline-none placeholder:italic bg-slate-50/0 ${
                            !warnForm.description ? null : "border-rose-500"
                          }`}
                        />
                        <p className="text-rose-700 indent-1 warn w-full mb-1">
                          {warnForm.description}
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
                      <div className="2/12 font-bold text-base">Image:</div>
                      <div className="w-10/12">
                        <UpdloadImage
                          aspect={21 / 9}
                          quanlity={1}
                          listType="picture"
                          placeholder=" + Upload ảnh khuyến khích tỉ lệ (21 / 9)"
                          maxSize={5}
                          getData={(data) => {
                            setWarnForm((prev) => ({
                              ...prev,
                              imageUrl: "",
                            }));
                            setDataForm((prev) => ({
                              ...prev,
                              img: data,
                            }));
                          }}
                        />
                        <p className="text-rose-700 indent-1 warn w-full mb-1">
                          {warnForm.imageUrl}
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
        {showEditUser ? (
          <div
            className="absolute top-0 right-0 left-0 bottom-0 bg-white z-10"
            onClick={(e) => setShowEditUser(false)}
          >
            <div
              className="w-2/3 bg-white mx-auto p-4 relative  shadow-lg shadow-black rounded-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full text-slate-950">
                <div className="flex justify-between items-center">
                  <div className="font-bold text-2xl">Sửa silder</div>
                  <div
                    className=""
                    onClick={(e) => {
                      setReClose(false);
                      setShowEditUser(false);
                    }}
                  >
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
                      <div className="2/12 font-bold text-base">
                        Description:
                      </div>
                      <div className="w-10/12">
                        <input
                          onBlur={(e) => handleValidations(e)}
                          onChange={(e) => {
                            // const regex = /^[a-zA-Z0-9 ]*$/g.test(
                            //   e.target.value
                            // );
                            // if (regex) {
                            setWarnForm((prev) => ({
                              ...prev,
                              description: "",
                            }));
                            setDataForm((prev) => ({
                              ...prev,
                              slug: handleRegexSlug(e.target.value),
                              [e.target.name]: e.target.value,
                            }));
                            // }
                          }}
                          value={dataForm.description}
                          type="text"
                          name="description"
                          placeholder="Mô tả slider"
                          className={`p-2 rounded-md w-full border border-solid outline-none placeholder:italic bg-slate-50/0 ${
                            !warnForm.description ? null : "border-rose-500"
                          }`}
                        />
                        <p className="text-rose-700 indent-1 warn w-full mb-1">
                          {warnForm.description}
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
                      <div className="2/12 font-bold text-base">Image:</div>
                      <div className="w-10/12">
                        <UpdloadImage
                          aspect={21 / 9}
                          quanlity={1}
                          listType="picture"
                          placeholder=" + Upload ảnh khuyến khích tỉ lệ (21 / 9)"
                          maxSize={5}
                          defaultData={defaultUpload}
                          getData={(data) => {
                            // console.log(data);
                            setWarnForm((prev) => ({
                              ...prev,
                              imageUrl: "",
                            }));
                            setDataForm((prev) => ({
                              ...prev,
                              img: data,
                            }));
                          }}
                        />

                        <p className="text-rose-700 indent-1 warn w-full mb-1">
                          {warnForm.imageUrl}
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

        {showDemoSlider ? (
          <div
            className="absolute top-0 right-0 left-0 bottom-0 bg-white z-10"
            onClick={(e) => setShowDemoSlider(false)}
          >
            <div
              className="w-2/3 bg-white mx-auto p-4 relative shadow-lg shadow-black rounded-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full text-slate-950">
                <div className="flex justify-between items-center">
                  <div className="font-bold text-2xl">Demo Slider</div>
                  <div
                    className=""
                    onClick={(e) => {
                      setReClose(false);
                      setShowDemoSlider(false);
                    }}
                  >
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
                    <div className="w-full relative flex-col z-0 overflow-hidden justify-center items-center">
                      {dataColum.length > 0 ? (
                        <Slider data={dataColum} />
                      ) : (
                        <Empty />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Loading>
  );
}

export default SliderPage;
