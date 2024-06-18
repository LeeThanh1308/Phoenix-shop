import { SearchOutlined } from "@ant-design/icons";
import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import Highlighter from "react-highlight-words";
import { Button, DatePicker, Input, Space, Table } from "antd";
import moment from "moment";
import Cookies from "js-cookie";
import Toast from "../../../components/Toast";
import HttpRequest from "../../../utils/axios/HttpRequest";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextEditer from "../../../components/TextEditer";
import UpdloadImage from "../../../components/UploadImage";
import AuthRequest from "../../../utils/axios/AuthRequest";
import Loading from "./../../../components/Loading";
import Slider from "../../../components/SliderProduct";
import Toastify from "../../../components/Toast";

function ProductsManagePage() {
  //Begin show product
  // const { handleSetReder } = useContext(CartContext);
  const [btnActive, setBtnActive] = useState(0);
  const [isShowFull, setIsShowFull] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleCalcSale = (current, sale) => {
    // console.log(current, sale);
    // const unformattedPrice = current?.replace(/[^0-9.-]+/g, "");
    // const price = unformattedPrice?.replace(/\./g, "");
    const result = current - (current / 100) * sale;
    return Number(result).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };
  //ENd
  const [isLoading, setIsLoading] = useState(false);
  const [renderUI, setRenderUI] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [dataColum, setDataColum] = useState([]);
  const [dataCategory, setDataCategory] = useState([]);
  const [reClose, setReClose] = useState(false);
  const [dataForm, setDataForm] = useState({
    name: "",
    barcode: "",
    image: "",
    quantity: "",
    category: "",
    discount: "",
    nsx: "",
    hsd: "",
    description: "",
  });
  const [warnForm, setWarnForm] = useState({
    name: "",
    barcode: "",
    type: "",
    image: "",
    category: "",
    quantity: "",
    discount: "",
    nsx: "",
    hsd: "",
    description: "",
  });
  const [valueType, setValueType] = useState({
    type: "",
    price: "",
    quantity: "",
    discount: "",
  });
  const [showDetail, setShowDetail] = useState(false);
  const [dataDetail, setDataDetail] = useState([]);
  const [defaultImage, setDefaultImage] = useState([]);
  const [fileList, setFileList] = useState([]);

  useLayoutEffect(() => {
    if (showAddUser) {
      setDataForm({
        name: "",
        barcode: "",
        type: [],
        addType: "",
        image: "",
        category: "",
        quantity: "",
        discount: "",
        nsx: "",
        hsd: "",
        description: "",
        slug: "",
      });
      setWarnForm({
        name: "",
        barcode: "",
        type: [],
        image: "",
        category: "",
        nsx: "",
        hsd: "",
        description: "",
        slug: "",
      });
      setValueType({
        type: "",
        price: "",
        cost: "",
        warnType: "",
        warnPrice: "",
      });
    } else {
      setWarnForm({
        name: "",
        barcode: "",
        type: [],
        image: "",
        category: "",
        nsx: "",
        hsd: "",
        description: "",
        slug: "",
      });
    }
    if (showAddUser === showEditUser) {
      setRenderUI(!renderUI);
    }

    if (!showEditUser) {
      setFileList([]);
    }
  }, [showAddUser, showEditUser]);

  useEffect(() => {
    if (showDetail) {
      window.scrollTo(0, 0);
      setBtnActive(0);
    }
  }, [showDetail]);

  useEffect(() => {
    setIsLoading(true);
    AuthRequest.get("products/stores")
      .then((response) => response.data)
      .then((response) => {
        if (Array.isArray(response)) setDataColum(response);
      })
      .catch((e) => {});
    HttpRequest.get("categories")
      .then((response) => response.data)
      .then((response) => {
        const data = response[0] ? response : [];
        if (Array.isArray(response)) setDataCategory(data);
      })
      .catch((e) => {})
      .finally(() => {
        setIsLoading(false);
      });
  }, [renderUI]);

  function formatPrice(price) {
    return Number(price).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }

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
      let message = {};
      Object.keys(dataForm).map((key, index) => {
        if (key === "type") {
        } else {
          if (dataForm[key]) {
            message[key] = null;
          } else {
            message[key] = "Trường này không được để trống!";
          }
        }
      });
      setWarnForm(message);
      if (
        !message.name &&
        !message.barcode &&
        !message.image &&
        !message.category &&
        !message.nsx &&
        !message.hsd &&
        !message.description
      )
        return true;
    }
  };

  const handleConvertFormdata = (fileObj, action) => {
    if (action) {
      const formData = new FormData();
      Object.keys(fileObj).forEach((key) => {
        if (key === "image") {
          fileObj[key].map((value) => formData.append("files", value));
          return;
        } else if (key === "type") {
          formData.append("type", JSON.stringify(fileObj.type));
        } else {
          formData.append(key, fileObj[key]);
        }
      });

      return formData;
    } else {
      const formData = new FormData();
      Object.keys(fileObj).forEach((key) => {
        if (key === "image") {
          fileObj[key].map((value) => formData.append("image", value));
          return;
        } else if (key === "files") {
          fileObj[key].map((value) => formData.append("files", value));
        } else if (key === "type") {
          formData.append("type", JSON.stringify(fileObj.type));
        } else {
          formData.append(key, fileObj[key]);
        }
      });

      return formData;
    }
  };

  async function handleSubmitForm() {
    if (showAddUser) {
      setIsLoading(true);
      await AuthRequest.post(
        "products",
        handleConvertFormdata(dataForm, true),
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
            // setShowAddUser(!showAddUser);
            // setRenderUI(!renderUI);
            setDataForm((prev) => ({
              ...prev,
              addType: data.id,
            }));
          }
        })
        .catch((error) => {});
      setIsLoading(false);
    }
    if (showEditUser) {
      setIsLoading(true);
      AuthRequest.patch(
        "products/" + dataForm.id,
        handleConvertFormdata(
          {
            ...dataForm,
            image: defaultImage,
          },
          false
        ),
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
        .then((response) => response.data)
        .then((data) => {
          if (data.message) {
            setShowEditUser(!showEditUser);
            // setRenderUI(!renderUI);
            Toast(1, data.message);
          } else {
            Toast(0, data.message);
          }
        })
        .catch((error) => {})
        .finally(() => {
          setIsLoading(false);
        });
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
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (_, record) => (
        <div className="w-32 h-32">
          <img
            src={`${process.env.REACT_APP_DOMAIN_API}${process.env.REACT_APP_URL_PRODUCT}${record?.image[0]}`}
            alt=""
            className="w-full h-full"
          />
        </div>
      ),
    },
    {
      title: "Tên SP",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      ...getColumnSearchProps("quantity"),
      sorter: (a, b) => a?.quantity - b?.quantity,
      sortDirections: ["descend", "ascend"],
      render: (_, record) => <div>{record?.quantity || "Trống "}</div>,
    },
    {
      title: "Đã bán",
      dataIndex: "sold",
      key: "sold",
      ...getColumnSearchProps("sold"),
      sorter: (a, b) => a?.sold - b?.sold,
      sortDirections: ["descend", "ascend"],
      render: (_, record) => <div>{record?.sold || "Trống "}</div>,
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      key: "discount",
      ...getColumnSearchProps("discount"),
      sorter: (a, b) =>
        moment(a?.type[0]?.discount).isBefore(b?.type[0]?.discount) ? -1 : 1,
      sortDirections: ["descend", "ascend"],
      render: (_, record) => (
        <div>
          {record?.type[0]?.discount ? record?.type[0]?.discount + "%" : "0%"}
        </div>
      ),
    },
    // {
    //   title: "Loại",
    //   dataIndex: "type",
    //   key: "type",
    //   ...getColumnSearchProps("type"),
    //   render: (_, record) => (
    //     <div>
    //       {record?.type.length > 0
    //         ? record.type.map((it, key) => {
    //             return (
    //               <div key={key}>
    //                 <h1>
    //                   <span className="text-sky-500">Loại:</span> {it.type} -{" "}
    //                   <span className="text-green-500">Giá gốc:</span>{" "}
    //                   {formatPrice(+it.cost)} -{" "}
    //                   <span className="text-red-500">Giá bán:</span>{" "}
    //                   {formatPrice(+it.price)}
    //                 </h1>
    //               </div>
    //             );
    //           })
    //         : "Trống"}
    //     </div>
    //   ),
    // },
    {
      title: "Ngày nhập",
      dataIndex: "createdAt",
      key: "createdAt",
      ...getColumnSearchProps("createdAt"),
      sorter: (a, b) => (moment(a.createdAt).isBefore(b.createdAt) ? -1 : 1),
      sortDirections: ["descend", "ascend"],
      render: (_, record) => (
        <div>{moment(record.createdAt).format("DD/MM/YYYY")} </div>
      ),
    },

    {
      title: "Ngày sản xuất",
      dataIndex: "nsx",
      key: "nsx",
      ...getColumnSearchProps("nsx"),
      sorter: (a, b) => (moment(a.nsx).isBefore(b.nsx) ? -1 : 1),
      sortDirections: ["descend", "ascend"],
      render: (_, record) => (
        <div>{moment(record.nsx).format("DD/MM/YYYY")} </div>
      ),
    },
    {
      title: "Hạn sử dụng",
      dataIndex: "hsd",
      key: "hsd",
      ...getColumnSearchProps("hsd"),
      sorter: (a, b) => (moment(a.hsd).isBefore(b.hsd) ? -1 : 1),
      sortDirections: ["descend", "ascend"],
      render: (_, record) => {
        const createdAt = moment(record.nsx);
        const currentMoment = moment(record.hsd);

        let years = currentMoment.diff(createdAt, "years");
        createdAt.add(years, "years");

        let months = currentMoment.diff(createdAt, "months");
        createdAt.add(months, "months");

        let days = currentMoment.diff(createdAt, "days");
        return (
          <div>
            <p>{`${moment(record.hsd).format("DD/MM/YY HH:mm:ss")}`}</p>
            <p>{` ${years} năm, ${months} tháng, ${days} ngày`}</p>
          </div>
        );
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
              if (record.type.length > 0) {
                setDataDetail([record]);
                setShowDetail(true);
              } else {
                Toastify(0, "Kiểu loại sản phẩm đang trống!");
              }
            }}
          >
            Chi tiết
          </span>
          <span
            className=" cursor-pointer hover:text-sky-500"
            onClick={(e) => {
              // console.log(record);
              setShowEditUser(true);
              setDataForm({
                ...record,
                category: record.category.id,
              });
              setDefaultImage(
                record?.image?.map(
                  (item) => `${process.env.REACT_APP_URL_PRODUCT}${item}`
                )
              );

              setValueType({
                type: "",
                price: "",
                quantity: "",
                discount: "",
              });
            }}
          >
            Sửa
          </span>
          <span
            className=" cursor-pointer hover:text-rose-500"
            onClick={(e) => {
              let result = window.confirm("Bạn chắc chắn muốn xoá!");
              if (result) {
                setIsLoading(true);
                AuthRequest.delete("products/delete/" + record.id)
                  .then((response) => response.data)
                  .then((data) => {
                    if (data.message) {
                      Toast(1, data.message);
                      setRenderUI(!renderUI);
                    }
                  })
                  .catch((err) => {})
                  .finally(() => {
                    setIsLoading(false);
                  });
              }
            }}
          >
            Delete
          </span>
        </Space>
      ),
    },
  ];

  const handleSubmitFormType = () => {
    setWarnForm((prev) => ({
      ...prev,
      type: "",
    }));
    if (!valueType.type) {
      setValueType((prev) => ({
        ...prev,
        warnType: "Trường này không được thể trống!",
      }));
    }

    if (!valueType.price) {
      setValueType((prev) => ({
        ...prev,
        warnPrice: "Trường này không được thể trống!",
      }));
    }

    if (!valueType.cost) {
      setValueType((prev) => ({
        ...prev,
        warnCost: "Trường này không được thể trống!",
      }));
    }
    if (!valueType.quantity) {
      setValueType((prev) => ({
        ...prev,
        warnQuantity: "Trường này không được thể trống!",
      }));
    }

    if (!Number(valueType.discount)) {
      setValueType((prev) => ({
        ...prev,
        warnDiscount: "Trường này không được thể trống!",
      }));
    }

    if (
      valueType.type &&
      valueType.price &&
      valueType.quantity &&
      valueType.discount &&
      valueType.cost
    ) {
      if (
        valueType.type &&
        dataForm.type.length > 0 &&
        dataForm.type.filter((it) => it.type === valueType.type).length > 0 &&
        dataForm.addType
      ) {
        setValueType((prev) => ({
          ...prev,
          warnType: "Loại này đã tồn tại!",
        }));
      } else {
        if (showAddUser && dataForm.addType) {
          setIsLoading(true);
          AuthRequest.post(`product-types/${dataForm.addType}`, {
            type: valueType.type,
            price: valueType.price,
            cost: valueType.cost,
            quantity: valueType.quantity,
            discount: valueType.discount,
          })
            .then((res) => res.data)
            .then((data) => {
              if (data.message) {
                Toast(1, data.message);
                // setRenderUI(!renderUI);
                setDataForm((prev) => ({
                  ...prev,
                  type: [
                    ...prev.type,
                    {
                      type: valueType.type,
                      price: valueType.price,
                      cost: valueType.cost,
                      quantity: valueType.quantity,
                      discount: valueType.discount,
                    },
                  ],
                }));
              }
            })
            .catch(() => {})
            .finally(() => {
              setIsLoading(false);
            });
        }

        if (showEditUser && !showAddUser && dataForm.editType) {
          console.table({
            showAddUser,
            showEditUser,
            edit: dataForm.editType,
            add: dataForm.addType,
          });

          if (dataForm.addType) {
            setIsLoading(true);
            AuthRequest.post(`product-types/${dataForm.id}`, {
              type: valueType.type,
              price: valueType.price,
              cost: valueType.cost,
              quantity: valueType.quantity,
              discount: valueType.discount,
            })
              .then((res) => res.data)
              .then((data) => {
                if (data.message) {
                  Toast(1, data.message);
                  // setRenderUI(!renderUI);
                  setDataForm((prev) => ({
                    ...prev,
                    type: [
                      ...prev.type,
                      {
                        type: valueType.type,
                        price: valueType.price,
                        cost: valueType.cost,
                        quantity: valueType.quantity,
                        discount: valueType.discount,
                      },
                    ],
                  }));
                }
              })
              .catch(() => {})
              .finally(() => {
                setIsLoading(false);
              });
          } else {
            setIsLoading(true);
            AuthRequest.patch("product-types/" + valueType.id, {
              type: valueType.type,
              price: valueType.price,
              cost: valueType.cost,
              quantity: valueType.quantity,
              discount: valueType.discount,
            })
              .then((res) => res.data)
              .then((data) => {
                if (data.message) {
                  Toast(1, data.message);
                  // setRenderUI(!renderUI);

                  dataForm.type.splice(valueType.index, 1);
                  setDataForm((prev) => ({
                    ...prev,
                    addType: false,
                    type: [...prev.type, data.data],
                  }));
                }
              })
              .catch(() => {})
              .finally(() => {
                setIsLoading(false);
              });
          }
        } else {
        }
      }
    }
  };

  const handleDeleteProductType = (id, index) => {
    setIsLoading(true);
    AuthRequest.delete("product-types/" + id, {
      type: valueType.type,
      price: valueType.price,
      cost: valueType.cost,
      quantity: valueType.quantity,
      discount: valueType.discount,
    })
      .then((res) => res.data)
      .then((data) => {
        if (data.message) {
          Toast(1, data.message);
          dataForm.type.splice(index, 1);
        }
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
  };

  const hanldeDeleteImage = (filename) => {
    setIsLoading(true);
    AuthRequest.delete(
      `products/file/${dataForm.id}/${filename.replace(
        process.env.REACT_APP_URL_PRODUCT,
        ""
      )}`
    )
      .then((response) => response.data)
      .then((data) => {
        if (data.message) {
          Toast(1, data.message);
          setRenderUI(!renderUI);
        }
      })
      .catch((err) => {})
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleConvertToSlug = (value) => {
    return value
      ?.normalize("NFD")
      ?.replace(/[\u0300-\u036f]/g, "")
      .replaceAll(" ", "-")
      .replaceAll("--", "-")
      ?.toLowerCase();
  };

  return (
    <div className={`w-full h-full z-10 text-black relative`}>
      <Loading status={isLoading}>
        {!isShowFull ? (
          <div className="p-6 z-0">
            <div className="flex justify-between items-center">
              <div className="mb-4 font-bold text-5xl">
                Quản trị kho sản phẩm
              </div>
              <div
                className="font-bold rounded bg-green-500 p-2 px-3 text-white text-lg hover:bg-green-400 cursor-pointer"
                onClick={(e) => {
                  setValueType({
                    type: "",
                    price: "",
                    quantity: "",
                    discount: "",
                  });
                  setShowAddUser(true);
                }}
              >
                Thêm sản phẩm +
              </div>
            </div>
            <Table columns={columns} dataSource={data} />
          </div>
        ) : null}

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
                {dataForm.addType ? (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-2xl">
                        Thêm Loại sản phẩm
                      </div>
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
                        <div className="w-full flex justify-between items-center my-5">
                          <div className="w-2/12 font-bold text-base">
                            Kiểu/Loại:
                          </div>
                          <div className="w-11/12">
                            <div className="flex mb-2">
                              {dataForm?.type.map((it, key) => (
                                <div
                                  className="border border-solid border-sky-500 px-4 py-3 w-1/5 rounded-xl mr-2 text-sky-500 relative"
                                  key={key}
                                >
                                  <div>
                                    <h1>Loại: {it.type}</h1>
                                    <h1>Giá gốc: {formatPrice(+it.cost)}</h1>
                                    <h1>Giá bán: {formatPrice(+it.price)}</h1>
                                    <h1>Số lượng: {it.quantity}</h1>
                                    <h1>Giảm giá: {it.discount}</h1>
                                  </div>
                                  <div
                                    className="absolute top-1 right-1 w-5 h-5 rounded-full hover:bg-red-500 cursor-pointer bg-red-300"
                                    onClick={() => {
                                      dataForm.type.splice(key, 1);

                                      setDataForm((prev) => ({
                                        ...prev,
                                      }));
                                    }}
                                  ></div>
                                </div>
                              ))}
                            </div>
                            <div className=" w-full flex items-center justify-between">
                              <div className=" w-1/3 mr-2 mb-1">
                                <input
                                  onChange={(e) =>
                                    setValueType((prev) => ({
                                      ...prev,
                                      warnType: "",
                                      [e.target.name]: e.target.value,
                                    }))
                                  }
                                  value={valueType.type}
                                  type="text"
                                  name="type"
                                  placeholder="Thêm loại mặt hàng VD( 1KG )"
                                  className={`p-2 rounded-md w-full border border-solid outline-none placeholder:italic bg-slate-50/0 ${
                                    !valueType.warnType
                                      ? null
                                      : "border-rose-500"
                                  }`}
                                />
                                <p className="text-rose-700 indent-1 warn w-full mb-1">
                                  {valueType.warnType}
                                </p>
                              </div>
                              <div className="w-1/3 ml-2 mb-1">
                                <input
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    if (/[0-9]/g.test(e.target.value)) {
                                      setValueType((prev) => ({
                                        ...prev,
                                        warnPrice: "",
                                        [e.target.name]: value,
                                      }));
                                    } else if (e.target.value === "") {
                                      setValueType((prev) => ({
                                        ...prev,
                                        warnPrice: "",
                                        [e.target.name]: value,
                                      }));
                                    }
                                  }}
                                  value={valueType.price}
                                  type="number"
                                  name="price"
                                  placeholder="Giá bán"
                                  className={`p-2 rounded-md w-full border border-solid outline-none placeholder:italic bg-slate-50/0 ${
                                    !valueType.warnPrice
                                      ? null
                                      : "border-rose-500"
                                  }`}
                                />
                                <p className="text-rose-700 indent-1 warn w-full mb-1">
                                  {valueType.warnPrice}
                                </p>
                              </div>

                              <div className="w-1/3 ml-2 mb-1">
                                <input
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    if (/[0-9]/g.test(e.target.value)) {
                                      setValueType((prev) => ({
                                        ...prev,
                                        warnCost: "",
                                        [e.target.name]: value,
                                      }));
                                    } else if (e.target.value === "") {
                                      setValueType((prev) => ({
                                        ...prev,
                                        warnPrice: "",
                                        [e.target.name]: value,
                                      }));
                                    }
                                  }}
                                  value={valueType.cost}
                                  type="number"
                                  name="cost"
                                  placeholder="Giá gốc"
                                  className={`p-2 rounded-md w-full border border-solid outline-none placeholder:italic bg-slate-50/0 ${
                                    !valueType.warnCost
                                      ? null
                                      : "border-rose-500"
                                  }`}
                                />
                                <p className="text-rose-700 indent-1 warn w-full mb-1">
                                  {valueType.warnCost}
                                </p>
                              </div>

                              <div className="w-1/3 ml-2 mb-1">
                                <input
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    if (/[0-9]/g.test(e.target.value)) {
                                      setValueType((prev) => ({
                                        ...prev,
                                        warnQuantity: "",
                                        [e.target.name]: value,
                                      }));
                                    } else if (e.target.value === "") {
                                      setValueType((prev) => ({
                                        ...prev,
                                        warnPrice: "",
                                        [e.target.name]: value,
                                      }));
                                    }
                                  }}
                                  value={valueType.quantity}
                                  type="number"
                                  name="quantity"
                                  placeholder="Số Lượng..."
                                  className={`p-2 rounded-md w-full border border-solid outline-none placeholder:italic bg-slate-50/0 ${
                                    !valueType.warnQuantity
                                      ? null
                                      : "border-rose-500"
                                  }`}
                                />
                                <p className="text-rose-700 indent-1 warn w-full mb-1">
                                  {valueType.warnQuantity}
                                </p>
                              </div>
                              <div className="w-1/3 ml-2 mb-1">
                                <input
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    if (/[0-9]/g.test(e.target.value)) {
                                      setValueType((prev) => ({
                                        ...prev,
                                        warnDiscount: "",
                                        [e.target.name]: value,
                                      }));
                                    } else if (e.target.value === "") {
                                      setValueType((prev) => ({
                                        ...prev,
                                        warnPrice: "",
                                        [e.target.name]: value,
                                      }));
                                    }
                                  }}
                                  value={valueType.discount}
                                  type="number"
                                  name="discount"
                                  placeholder="Giảm giá..."
                                  min={0}
                                  max={100}
                                  className={`p-2 rounded-md w-full border border-solid outline-none placeholder:italic bg-slate-50/0 ${
                                    !valueType.warnDiscount
                                      ? null
                                      : "border-rose-500"
                                  }`}
                                />
                                <p className="text-rose-700 indent-1 warn w-full mb-1">
                                  {valueType.warnDiscount}
                                </p>
                              </div>
                            </div>

                            <div className="">
                              <Button
                                className="h-full w-full"
                                onClick={() => {
                                  handleSubmitFormType();
                                }}
                              >
                                Thêm
                              </Button>
                            </div>
                            <p className="text-rose-700 indent-1 warn w-full mb-1">
                              {warnForm.type}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-2xl">Thêm sản phẩm</div>
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
                          <div className="w-2/12 font-bold text-base">
                            Tên SP:
                          </div>
                          <div className="w-11/12">
                            <input
                              onBlur={(e) => handleValidations(e)}
                              onChange={(e) => {
                                setWarnForm((prev) => ({
                                  ...prev,
                                  slug: "",
                                  [e.target.name]: "",
                                }));
                                setDataForm((prev) => ({
                                  ...prev,
                                  [e.target.name]: e.target.value,
                                }));
                              }}
                              value={dataForm.name}
                              type="text"
                              name="name"
                              placeholder="Tên sản phẩm"
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
                          <div className="w-2/12 font-bold text-base">
                            Mã vạch sản phẩm:
                          </div>
                          <div className="w-11/12">
                            <input
                              value={dataForm.barcode}
                              onBlur={(e) => handleValidations(e)}
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
                              type="number"
                              name="barcode"
                              placeholder="Mã vạch"
                              className={`p-2 rounded-md w-full border border-solid outline-none placeholder:italic bg-slate-50/0 ${
                                !warnForm.barcode ? null : "border-rose-500"
                              }`}
                            />
                            <p className="text-rose-700 indent-1 warn w-full mb-1">
                              {warnForm.barcode}
                            </p>
                          </div>
                        </div>

                        <div className="w-full flex justify-between items-center">
                          <div className="w-2/12 font-bold text-base">
                            Ngày sản xuất:
                          </div>
                          <div className="w-11/12">
                            <input
                              onBlur={(e) => handleValidations(e)}
                              value={dataForm.nsx}
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
                              type="datetime-local"
                              name="nsx"
                              placeholder="Ngày sản xuất"
                              className={`p-2 rounded-md w-full border border-solid outline-none placeholder:italic bg-slate-50/0 ${
                                !warnForm.nsx ? null : "border-rose-500"
                              }`}
                            />
                            <p className="text-rose-700 indent-1 warn w-full mb-1">
                              {warnForm.nsx}
                            </p>
                          </div>
                        </div>

                        <div className="w-full flex justify-between items-center">
                          <div className="w-2/12 font-bold text-base">
                            Hạn sử dụng:
                          </div>
                          <div className="w-11/12">
                            <input
                              onBlur={(e) => handleValidations(e)}
                              value={dataForm.hsd}
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
                              type="datetime-local"
                              name="hsd"
                              placeholder="Hạn sử dụng"
                              className={`p-2 rounded-md w-full border border-solid outline-none placeholder:italic bg-slate-50/0 ${
                                !warnForm.hsd ? null : "border-rose-500"
                              }`}
                            />
                            <p className="text-rose-700 indent-1 warn w-full mb-1">
                              {warnForm.hsd}
                            </p>
                          </div>
                        </div>

                        <div className="w-full flex justify-between items-center">
                          <div className="w-2/12 font-bold text-base">
                            Danh mục:
                          </div>
                          <div className="w-11/12">
                            <select
                              name="category"
                              className={`w-full p-2 border border-solid rounded-md bg-slate-50/0 ${
                                !warnForm.category ? null : "border-rose-500"
                              }`}
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
                              value={dataForm.category}
                              defaultValue={""}
                            >
                              <option key="" value="" disabled>
                                Chọn danh mục
                              </option>
                              {dataCategory.map((data, key) => {
                                return (
                                  <option key={key} value={data.id}>
                                    {data.name}
                                  </option>
                                );
                              })}
                            </select>
                            <p className="text-rose-700 indent-1 warn w-full mb-1">
                              {warnForm.category}
                            </p>
                          </div>
                        </div>

                        <div className="w-full flex justify-between items-center mb-2">
                          <div className="w-2/12 font-bold text-base">
                            Mô tả:
                          </div>
                          <div className="w-11/12">
                            <TextEditer
                              // data={dataForm.description}
                              getValue={(value) => {
                                setWarnForm((prev) => ({
                                  ...prev,
                                  description: "",
                                }));
                                setDataForm((prev) => ({
                                  ...prev,
                                  description: value,
                                }));
                              }}
                            />
                            <p className="text-rose-700 indent-1 warn w-full mb-1">
                              {warnForm.description}
                            </p>
                          </div>
                        </div>

                        <div className="w-full flex justify-between items-center mt-4">
                          <div className="2/12 font-bold text-base">Image:</div>
                          <div className="w-10/12">
                            <UpdloadImage
                              aspect={1 / 1}
                              quanlity={10}
                              getData={(value) => {
                                setWarnForm((prev) => ({
                                  ...prev,
                                  image: "",
                                }));
                                setDataForm((prev) => ({
                                  ...prev,
                                  image: value,
                                }));
                                // console.log(value);
                              }}
                              placeholder="Upload picture products..."
                            />
                            <p className="text-rose-700 indent-1 warn w-full mb-1">
                              {warnForm.image}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={(e) => {
                              const result = handleValidations(e);
                              if (result) {
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
                  </>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {showEditUser ? (
          <div
            className="absolute top-0 right-0 left-0 bottom-0 bg-white z-10"
            onClick={(e) => setShowAddUser(false)}
          >
            <div
              className="w-2/3 bg-white mx-auto p-4 relative shadow-lg shadow-black rounded-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full text-slate-950">
                {dataForm.editType ? (
                  dataForm.addType ? (
                    <>
                      <div className="flex justify-between items-center">
                        <div className="font-bold text-2xl">
                          Thêm Loại sản phẩm
                        </div>
                        <div
                          className=""
                          onClick={(e) => {
                            setDataForm((prev) => ({
                              ...prev,
                              editType: false,
                              addType: false,
                            }));
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
                          <div className="w-full flex justify-between items-center my-5">
                            <div className="w-2/12 font-bold text-base">
                              Kiểu/Loại:
                            </div>
                            <div className="w-11/12">
                              <div className="flex flex-wrap mb-2">
                                {dataForm?.type.map((it, key) => (
                                  <div
                                    className="border border-solid border-sky-500 px-4 py-3 w-1/4 rounded-xl mr-2 text-sky-500 relative"
                                    key={key}
                                  >
                                    <div>
                                      <h1>Loại: {it.type}</h1>
                                      <h1>Giá gốc: {formatPrice(+it.cost)}</h1>
                                      <h1>Giá bán: {formatPrice(+it.price)}</h1>
                                      <h1>Số lượng: {it.quantity}</h1>
                                      <h1>Giảm giá: {it.discount}</h1>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className=" w-full flex items-center justify-between">
                                <div className=" w-1/3 mr-2 mb-1">
                                  <input
                                    onChange={(e) =>
                                      setValueType((prev) => ({
                                        ...prev,
                                        warnType: "",
                                        [e.target.name]: e.target.value,
                                      }))
                                    }
                                    value={valueType.type}
                                    type="text"
                                    name="type"
                                    placeholder="Thêm loại mặt hàng VD( 1KG )"
                                    className={`p-2 rounded-md w-full border border-solid outline-none placeholder:italic bg-slate-50/0 ${
                                      !valueType.warnType
                                        ? null
                                        : "border-rose-500"
                                    }`}
                                  />
                                  <p className="text-rose-700 indent-1 warn w-full mb-1">
                                    {valueType.warnType}
                                  </p>
                                </div>
                                <div className="w-1/3 ml-2 mb-1">
                                  <input
                                    onChange={(e) => {
                                      const value = e.target.value;

                                      if (/[0-9]/g.test(e.target.value)) {
                                        setValueType((prev) => ({
                                          ...prev,
                                          warnPrice: "",
                                          [e.target.name]: value,
                                        }));
                                      } else if (e.target.value === "") {
                                        setValueType((prev) => ({
                                          ...prev,
                                          warnPrice: "",
                                          [e.target.name]: value,
                                        }));
                                      }
                                    }}
                                    value={valueType.price}
                                    type="number"
                                    name="price"
                                    placeholder="Giá bán"
                                    className={`p-2 rounded-md w-full border border-solid outline-none placeholder:italic bg-slate-50/0 ${
                                      !valueType.warnPrice
                                        ? null
                                        : "border-rose-500"
                                    }`}
                                  />
                                  <p className="text-rose-700 indent-1 warn w-full mb-1">
                                    {valueType.warnPrice}
                                  </p>
                                </div>

                                <div className="w-1/3 ml-2 mb-1">
                                  <input
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      if (/[0-9]/g.test(e.target.value)) {
                                        setValueType((prev) => ({
                                          ...prev,
                                          warnCost: "",
                                          [e.target.name]: value,
                                        }));
                                      } else if (e.target.value === "") {
                                        setValueType((prev) => ({
                                          ...prev,
                                          warnPrice: "",
                                          [e.target.name]: value,
                                        }));
                                      }
                                    }}
                                    value={valueType.cost}
                                    type="number"
                                    name="cost"
                                    placeholder="Giá gốc"
                                    className={`p-2 rounded-md w-full border border-solid outline-none placeholder:italic bg-slate-50/0 ${
                                      !valueType.warnCost
                                        ? null
                                        : "border-rose-500"
                                    }`}
                                  />
                                  <p className="text-rose-700 indent-1 warn w-full mb-1">
                                    {valueType.warnCost}
                                  </p>
                                </div>

                                <div className="w-1/3 ml-2 mb-1">
                                  <input
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      if (/[0-9]/g.test(e.target.value)) {
                                        setValueType((prev) => ({
                                          ...prev,
                                          warnQuantity: "",
                                          [e.target.name]: value,
                                        }));
                                      } else if (e.target.value === "") {
                                        setValueType((prev) => ({
                                          ...prev,
                                          warnPrice: "",
                                          [e.target.name]: value,
                                        }));
                                      }
                                    }}
                                    value={valueType.quantity}
                                    type="number"
                                    name="quantity"
                                    placeholder="Số Lượng..."
                                    className={`p-2 rounded-md w-full border border-solid outline-none placeholder:italic bg-slate-50/0 ${
                                      !valueType.warnQuantity
                                        ? null
                                        : "border-rose-500"
                                    }`}
                                  />
                                  <p className="text-rose-700 indent-1 warn w-full mb-1">
                                    {valueType.warnQuantity}
                                  </p>
                                </div>
                                <div className="w-1/3 ml-2 mb-1">
                                  <input
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      if (/[0-9]/g.test(e.target.value)) {
                                        setValueType((prev) => ({
                                          ...prev,
                                          warnDiscount: "",
                                          [e.target.name]: value,
                                        }));
                                      } else if (e.target.value === "") {
                                        setValueType((prev) => ({
                                          ...prev,
                                          warnPrice: "",
                                          [e.target.name]: value,
                                        }));
                                      }
                                    }}
                                    value={valueType.discount}
                                    type="number"
                                    name="discount"
                                    placeholder="Giảm giá..."
                                    min={0}
                                    max={100}
                                    className={`p-2 rounded-md w-full border border-solid outline-none placeholder:italic bg-slate-50/0 ${
                                      !valueType.warnDiscount
                                        ? null
                                        : "border-rose-500"
                                    }`}
                                  />
                                  <p className="text-rose-700 indent-1 warn w-full mb-1">
                                    {valueType.warnDiscount}
                                  </p>
                                </div>
                              </div>

                              <div className="">
                                <Button
                                  className="h-full w-full"
                                  onClick={() => {
                                    handleSubmitFormType();
                                  }}
                                >
                                  Thêm
                                </Button>
                              </div>
                              <p className="text-rose-700 indent-1 warn w-full mb-1">
                                {warnForm.type}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center">
                        <div className="font-bold text-2xl">
                          Sửa Loại sản phẩm
                        </div>
                        <div
                          className=""
                          onClick={(e) =>
                            setDataForm((prev) => ({
                              ...prev,
                              editType: false,
                            }))
                          }
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
                          <div className="w-full flex justify-between items-center my-5">
                            <div className="w-2/12 font-bold text-base">
                              Kiểu/Loại:
                            </div>
                            <div className="w-11/12">
                              <div className=" w-full flex items-center justify-between">
                                <div className=" w-full">
                                  <input
                                    onChange={(e) =>
                                      setValueType((prev) => ({
                                        ...prev,
                                        warnType: "",
                                        [e.target.name]: e.target.value,
                                      }))
                                    }
                                    value={valueType.type}
                                    type="text"
                                    name="type"
                                    placeholder="Thêm loại mặt hàng VD( 1KG )"
                                    className={`p-2 rounded-md w-full border border-solid outline-none placeholder:italic bg-slate-50/0 ${
                                      !valueType.warnType
                                        ? null
                                        : "border-rose-500"
                                    }`}
                                  />
                                  <p className="text-rose-700 indent-1 warn w-full mb-1">
                                    {valueType.warnType}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="w-full flex justify-between items-center my-5">
                            <div className="w-2/12 font-bold text-base">
                              Giá bán:
                            </div>
                            <div className="w-11/12">
                              <div className=" w-full flex items-center justify-between">
                                <div className="w-full">
                                  <input
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      if (/[0-9]/g.test(e.target.value)) {
                                        setValueType((prev) => ({
                                          ...prev,
                                          warnPrice: "",
                                          [e.target.name]: value,
                                        }));
                                      } else if (e.target.value === "") {
                                        setValueType((prev) => ({
                                          ...prev,
                                          warnPrice: "",
                                          [e.target.name]: value,
                                        }));
                                      }
                                    }}
                                    value={valueType.price}
                                    type="number"
                                    name="price"
                                    placeholder="Giá bán"
                                    className={`p-2 rounded-md w-full border border-solid outline-none placeholder:italic bg-slate-50/0 ${
                                      !valueType.warnPrice
                                        ? null
                                        : "border-rose-500"
                                    }`}
                                  />
                                  <p className="text-rose-700 indent-1 warn w-full mb-1">
                                    {valueType.warnPrice}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="w-full flex justify-between items-center my-5">
                            <div className="w-2/12 font-bold text-base">
                              Giá gốc:
                            </div>
                            <div className="w-11/12">
                              <div className=" w-full flex items-center justify-between">
                                <div className="w-full">
                                  <input
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      if (/[0-9]/g.test(e.target.value)) {
                                        setValueType((prev) => ({
                                          ...prev,
                                          warnCost: "",
                                          [e.target.name]: value,
                                        }));
                                      } else if (e.target.value === "") {
                                        setValueType((prev) => ({
                                          ...prev,
                                          warnPrice: "",
                                          [e.target.name]: value,
                                        }));
                                      }
                                    }}
                                    value={valueType.cost}
                                    type="number"
                                    name="cost"
                                    placeholder="Giá bán"
                                    className={`p-2 rounded-md w-full border border-solid outline-none placeholder:italic bg-slate-50/0 ${
                                      !valueType.warnCost
                                        ? null
                                        : "border-rose-500"
                                    }`}
                                  />
                                  <p className="text-rose-700 indent-1 warn w-full mb-1">
                                    {valueType.warnCost}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="w-full flex justify-between items-center my-5">
                            <div className="w-2/12 font-bold text-base">
                              Số lượng:
                            </div>
                            <div className="w-11/12">
                              <div className=" w-full flex items-center justify-between">
                                <div className="w-full">
                                  <input
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      if (/[0-9]/g.test(e.target.value)) {
                                        setValueType((prev) => ({
                                          ...prev,
                                          warnQuantity: "",
                                          [e.target.name]: value,
                                        }));
                                      } else if (e.target.value === "") {
                                        setValueType((prev) => ({
                                          ...prev,
                                          warnPrice: "",
                                          [e.target.name]: value,
                                        }));
                                      }
                                    }}
                                    value={valueType.quantity}
                                    type="number"
                                    name="quantity"
                                    placeholder="Giá bán"
                                    className={`p-2 rounded-md w-full border border-solid outline-none placeholder:italic bg-slate-50/0 ${
                                      !valueType.warnQuantity
                                        ? null
                                        : "border-rose-500"
                                    }`}
                                  />
                                  <p className="text-rose-700 indent-1 warn w-full mb-1">
                                    {valueType.warnQuantity}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="w-full flex justify-between items-center my-5">
                            <div className="w-2/12 font-bold text-base">
                              Giảm giá (%):
                            </div>
                            <div className="w-11/12">
                              <div className=" w-full flex items-center justify-between">
                                <div className="w-full">
                                  <input
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      if (/[0-9]/g.test(e.target.value)) {
                                        setValueType((prev) => ({
                                          ...prev,
                                          warnDiscount: "",
                                          [e.target.name]: value,
                                        }));
                                      } else if (e.target.value === "") {
                                        setValueType((prev) => ({
                                          ...prev,
                                          warnPrice: "",
                                          [e.target.name]: value,
                                        }));
                                      }
                                    }}
                                    value={valueType.discount}
                                    type="number"
                                    name="discount"
                                    min={0}
                                    max={100}
                                    placeholder="Giá bán"
                                    className={`p-2 rounded-md w-full border border-solid outline-none placeholder:italic bg-slate-50/0 ${
                                      !valueType.warnDiscount
                                        ? null
                                        : "border-rose-500"
                                    }`}
                                  />
                                  <p className="text-rose-700 indent-1 warn w-full mb-1">
                                    {valueType.warnDiscount}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="w-full my-5">
                            <Button
                              className="h-full w-full"
                              onClick={() => {
                                handleSubmitFormType();
                              }}
                            >
                              Lưu
                            </Button>
                          </div>
                          <p className="text-rose-700 indent-1 warn w-full mb-1">
                            {warnForm.type}
                          </p>
                        </div>
                      </div>
                    </>
                  )
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-2xl">
                        Sửa thông tin sản phẩm
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
                        <div className="w-full flex justify-between items-center">
                          <div className="w-2/12 font-bold text-base">
                            Tên SP:
                          </div>
                          <div className="w-11/12">
                            <input
                              onBlur={(e) => handleValidations(e)}
                              onChange={(e) => {
                                setWarnForm((prev) => ({
                                  ...prev,
                                  [e.target.name]: "",
                                }));
                                setDataForm((prev) => ({
                                  ...prev,
                                  [e.target.name]: e.target.value,
                                  slug: handleConvertToSlug(e.target.value),
                                }));
                              }}
                              value={dataForm.name}
                              type="text"
                              name="name"
                              placeholder="Tên sản phẩm"
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
                          <div className="w-2/12 font-bold text-base">
                            Slug:
                          </div>
                          <div className="w-11/12">
                            <input
                              onBlur={(e) => handleValidations(e)}
                              value={handleConvertToSlug(dataForm?.name)}
                              type="text"
                              name="slug"
                              disabled
                              placeholder="Slug"
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
                          <div className="w-2/12 font-bold text-base">
                            Mã vạch sản phẩm:
                          </div>
                          <div className="w-11/12">
                            <input
                              value={dataForm.barcode}
                              onBlur={(e) => handleValidations(e)}
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
                              type="number"
                              name="barcode"
                              placeholder="Mã vạch"
                              className={`p-2 rounded-md w-full border border-solid outline-none placeholder:italic bg-slate-50/0 ${
                                !warnForm.barcode ? null : "border-rose-500"
                              }`}
                            />
                            <p className="text-rose-700 indent-1 warn w-full mb-1">
                              {warnForm.barcode}
                            </p>
                          </div>
                        </div>

                        <div className="w-full flex justify-between items-center">
                          <div className="w-2/12 font-bold text-base">
                            Ngày sản xuất:
                          </div>
                          <div className="w-11/12">
                            <input
                              onBlur={(e) => handleValidations(e)}
                              defaultValue={moment(data?.nsx).format(
                                "YYYY-MM-DDTHH:MM"
                              )}
                              value={data.nsx}
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
                              type="datetime-local"
                              name="nsx"
                              placeholder="Ngày sản xuất"
                              className={`p-2 rounded-md w-full border border-solid outline-none placeholder:italic bg-slate-50/0 ${
                                !warnForm.nsx ? null : "border-rose-500"
                              }`}
                            />
                            <p className="text-rose-700 indent-1 warn w-full mb-1">
                              {warnForm.nsx}
                            </p>
                          </div>
                        </div>

                        <div className="w-full flex justify-between items-center">
                          <div className="w-2/12 font-bold text-base">
                            Hạn sử dụng:
                          </div>
                          <div className="w-11/12">
                            <input
                              onBlur={(e) => handleValidations(e)}
                              defaultValue={moment(data?.nsx).format(
                                "YYYY-MM-DDTHH:MM"
                              )}
                              value={data.hsd}
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
                              type="datetime-local"
                              name="hsd"
                              placeholder="Hạn sử dụng"
                              className={`p-2 rounded-md w-full border border-solid outline-none placeholder:italic bg-slate-50/0 ${
                                !warnForm.hsd ? null : "border-rose-500"
                              }`}
                            />
                            <p className="text-rose-700 indent-1 warn w-full mb-1">
                              {warnForm.hsd}
                            </p>
                          </div>
                        </div>

                        <div className="w-full flex justify-between items-center">
                          <div className="w-2/12 font-bold text-base">
                            Danh mục:
                          </div>
                          <div className="w-11/12">
                            <select
                              name="category"
                              className={`w-full p-2 border border-solid rounded-md bg-slate-50/0 ${
                                !warnForm.category ? null : "border-rose-500"
                              }`}
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
                              defaultValue={
                                dataForm.category
                                  ? dataForm.category
                                  : "default"
                              }
                            >
                              <option
                                value="default"
                                disabled
                                hidden
                                className=""
                              >
                                Danh mục (Nếu danh mục trống vui lòng thêm danh
                                mục trước khi thêm sản phẩm)
                              </option>
                              {dataCategory.map((data, key) => {
                                return (
                                  <option key={key} value={data.id}>
                                    {data.name}
                                  </option>
                                );
                              })}
                            </select>
                            <p className="text-rose-700 indent-1 warn w-full mb-1">
                              {warnForm.category}
                            </p>
                          </div>
                        </div>

                        <div className="w-full flex justify-between items-center my-5">
                          <div className="w-2/12 font-bold text-base">
                            Kiểu/Loại:
                          </div>
                          <div className="w-11/12">
                            <div className="flex flex-wrap mb-2">
                              {dataForm?.type.map((it, key) => (
                                <div
                                  className="border border-solid border-sky-500 px-4 py-3 w-1/4 rounded-xl mr-2 text-sky-500 relative flex justify-between items-center"
                                  key={key}
                                >
                                  <div>
                                    <h1>Loại: {it.type}</h1>
                                    <h1>Giá gốc: {formatPrice(+it.cost)}</h1>
                                    <h1>Giá bán: {formatPrice(+it.price)}</h1>
                                    <h1>Giảm giá: {it.discount}%</h1>
                                  </div>
                                  <div
                                    className=" cursor-pointer"
                                    onClick={() => {
                                      setValueType({
                                        ...it,
                                        index: key,
                                      });
                                      setDataForm((prev) => ({
                                        ...prev,
                                        editType: true,
                                      }));
                                    }}
                                  >
                                    <FontAwesomeIcon
                                      className=" text-rose-500 hover:text-rose-700"
                                      icon="fa-solid fa-pen-fancy"
                                    />
                                  </div>

                                  <div
                                    className="absolute top-1 right-1 cursor-pointer"
                                    onClick={() => {
                                      handleDeleteProductType(it.id, key);
                                    }}
                                  >
                                    <FontAwesomeIcon
                                      className=" text-rose-500 hover:text-rose-700"
                                      icon="fa-solid fa-trash-can"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="">
                              <Button
                                className="h-full w-full"
                                onClick={(e) => {
                                  setDataForm((prev) => ({
                                    ...prev,

                                    editType: true,
                                    addType: dataForm.id,
                                  }));
                                }}
                              >
                                Thêm
                              </Button>
                            </div>
                            <p className="text-rose-700 indent-1 warn w-full mb-1">
                              {warnForm.type}
                            </p>
                          </div>
                        </div>

                        <div className="w-full flex justify-between items-center mb-2">
                          <div className="w-2/12 font-bold text-base">
                            Mô tả:
                          </div>
                          <div className="w-11/12">
                            <TextEditer
                              data={dataForm.description}
                              getValue={(value) => {
                                setWarnForm((prev) => ({
                                  ...prev,
                                  description: "",
                                }));
                                setDataForm((prev) => ({
                                  ...prev,
                                  description: value,
                                }));
                              }}
                            />
                            <p className="text-rose-700 indent-1 warn w-full mb-1">
                              {warnForm.description}
                            </p>
                          </div>
                        </div>

                        <div className="w-full flex justify-between items-center mt-4">
                          <div className="2/12 font-bold text-base">Image:</div>
                          <div className="w-10/12">
                            <UpdloadImage
                              aspect={1 / 1}
                              quanlity={10}
                              defaultData={defaultImage}
                              urlImage={process.env.REACT_APP_URL_PRODUCT}
                              restImage={(value) => {
                                setDefaultImage(value);
                              }}
                              onDelete={(value) => {
                                hanldeDeleteImage(value);
                              }}
                              getData={(value, fileList) => {
                                setFileList(fileList);
                                setWarnForm((prev) => ({
                                  ...prev,
                                  image: "",
                                }));
                                setDataForm((prev) => ({
                                  ...prev,
                                  files: value,
                                }));
                              }}
                              defaultFileList={fileList}
                              placeholder="Upload picture products..."
                            />
                            <p className="text-rose-700 indent-1 warn w-full mb-1">
                              {warnForm.image}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={(e) => {
                              const result = handleValidations(e);
                              if (result) {
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
                  </>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {showDetail && !isShowFull ? (
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
                  <div className="font-bold text-2xl">Chi tiết sản phẩm</div>
                  <div className="" onClick={(e) => setShowDetail(false)}>
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
                  <div className="mt-4 mb-3 w-11/12 mx-auto ">
                    {dataDetail.map((items) => (
                      <>
                        <div className="w-full h-3/5 flex bg-white">
                          <div className="w-2/5 px-3">
                            <div className={"aspect-square relative"}>
                              <Slider
                                data={items.image}
                                onChange={(value) => {
                                  setIsShowFull(value);
                                }}
                              />
                            </div>
                          </div>
                          <div className="w-3/5 px-3 py-7 text-sm text-black/60">
                            <div className="pb-3">
                              <div className="text-sm text-black/90">
                                {items.name}
                              </div>
                              <div className="text-xs text-black/50">
                                barcode: {items.barcode}
                              </div>
                            </div>
                            <div
                              className="w-full h-auto p-3 text-sm  flex-col mb-5"
                              // style={{ backgroundImage: `url('${bgproduct}')` }}
                            >
                              <div className="w-full flex items-center">
                                <div className="w-2/4 mr-2">Giá Gốc:</div>
                                <div className="w-3/4 text-red-500">
                                  {formatPrice(
                                    items?.type[btnActive || 0]?.cost
                                  )}
                                </div>
                              </div>
                              <div className="w-full flex items-center">
                                <div className="w-2/4 mr-2">Giá bán:</div>
                                <div className="w-3/4 text-red-500">
                                  {formatPrice(
                                    items?.type[btnActive || 0]?.price
                                  )}
                                </div>
                              </div>
                              <div className="w-full flex items-center pb-1 border-b">
                                <div className="w-2/4 mr-2">
                                  Giá khuyến mãi:
                                </div>
                                <div className="w-3/4 text-red-600 text-base">
                                  {handleCalcSale(
                                    items.type[btnActive || 0]?.price,
                                    items.type[btnActive || 0]?.discount
                                  )}
                                </div>
                              </div>
                              <div className="w-full flex items-center">
                                <div className="w-2/4 mr-2">Giảm giá:</div>
                                <div className="w-3/4 text-red-500">
                                  {items?.type[btnActive || 0]?.discount}%
                                </div>
                              </div>
                              <div className="w-full flex items-center my-auto">
                                <div className="w-2/4 mr-2">Số lượng nhập:</div>
                                <div className="w-3/4 text-sky-500">
                                  {items?.type[btnActive || 0].quantity}
                                </div>
                              </div>
                              <div className="w-full flex items-center my-auto">
                                <div className="w-2/4 mr-2">Trong kho còn:</div>
                                <div className="w-3/4 text-sky-500">
                                  {items?.type[btnActive || 0].quantity -
                                    items?.type[btnActive || 0]?.solds}
                                </div>
                              </div>
                              <div className="w-full flex items-center">
                                <div className="w-2/4 mr-2">Đã bán:</div>
                                <div className="w-3/4 text-sky-500">
                                  {items?.type[btnActive || 0]?.solds}
                                </div>
                              </div>
                            </div>
                            <div className="w-full">
                              <div className="w-full flex items-center my-4">
                                <div className="w-2/4 mr-2">Loại/Size:</div>
                                <div className="w-3/4">
                                  {items.type.map(
                                    (it, i) => {
                                      return (
                                        <button
                                          className={`py-1 px-3 border rounded-md mr-1 ${
                                            btnActive === i
                                              ? "bg-sky-500 text-white"
                                              : null
                                          }`}
                                          onClick={(e) => setBtnActive(i)}
                                        >
                                          {it.type}
                                        </button>
                                      );
                                    }
                                    // console.log(it)
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="w-full h-auto bg-white py-8 border-black mt-4"
                          dangerouslySetInnerHTML={{
                            __html: items.description,
                          }}
                        ></div>
                      </>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Loading>
      {isShowFull ? (
        <div className="absolute top-0 right-0 left-0 z-50 flex justify-center">
          <div className="w-[calc(100%_/_2_-_40px)] relative shadow rounded-xl shadow-black overflow-hidden">
            {dataDetail.map((items, i) => {
              return (
                <Slider
                  isShowFull={isShowFull}
                  data={items.image}
                  onChange={(value) => {
                    setIsShowFull(value);
                  }}
                />
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ProductsManagePage;
