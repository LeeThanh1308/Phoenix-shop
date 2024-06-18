import { useContext, useEffect, useState } from "react";
import Button from "../../../components/Button";
import Toastify from "../../../components/Toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthRequest from "../../../utils/axios/AuthRequest";
import Cookies from "js-cookie";
import axios from "axios";
import Loading from "../../../components/Loading";
import { CartContext } from "../../../hooks/useContext/CartContext";
import { useNavigate } from "react-router-dom";

function PayPage() {
  const { handleSetReder } = useContext(CartContext);
  const navigate = useNavigate();
  const [dataForm, setDataForm] = useState({
    username: "",
    phone: "",
    address: {
      city: "",
      district: "",
      wards: "",
      detail: "",
    },
    methods: "",
    note: "",
  });
  const [warnForm, setWarnForm] = useState({
    username: "",
    phone: "",
    address: {
      city: "",
      district: "",
      wards: "",
      detail: "",
    },
    methods: "",
    note: "",
  });
  const [dataCart, setDataCart] = useState([]);
  const [dataAddress, setDataAddress] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [bill, setBill] = useState({});

  useEffect(() => {
    const Logined = Cookies.get("Logined");
    window.scroll(0, 0);
    (async () => {
      if (Logined) {
        setIsLoading(true);
        await axios
          .get(
            "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
          )
          .then((response) => response.data)
          .then((data) => {
            setDataAddress(data);
          })
          .catch((err) => {});
        await AuthRequest.get("carts")
          .then((response) => response.data)
          .then((data) => {
            if (Array.isArray(data) && data.length > 0) {
              setDataCart(data);
            } else {
              Toastify(
                0,
                "Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán sản phẩm."
              );
              navigate("/");
            }
          })
          .catch(() => {});

        await AuthRequest.get("accounts/user")
          .then((response) => response.data)
          .then((data) => {
            if (data) {
              setDataForm((prev) => ({
                ...prev,
                username: data.fullname,
                phone: data.phone,
              }));
            }
          })
          .catch(() => {});

        await AuthRequest.get("carts/bill")
          .then((response) => {
            if (response.status === 200) {
              setBill(response.data);
            } else {
            }
          })
          .catch(() => {});
        setIsLoading(false);
      }
    })();
  }, []);

  const handleFormatPrice = (price) => {
    return Number(price).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const handleValidations = () => {
    if (!dataForm.username) {
      setWarnForm((prev) => ({
        ...prev,
        username: "Vui lòng nhập họ tên!",
      }));
    }
    if (!dataForm.phone) {
      setWarnForm((prev) => ({
        ...prev,
        phone: "Vui lòng nhập số điện thoại!",
      }));
    }

    if (!dataForm.address.city) {
      setWarnForm((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          city: "Vui lòng nhập địa chỉ!",
        },
      }));
    }

    if (!dataForm.address.district) {
      setWarnForm((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          district: "Vui lòng nhập địa chỉ!",
        },
      }));
    }

    if (!dataForm.address.detail) {
      setWarnForm((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          detail: "Vui lòng nhập địa chỉ!",
        },
      }));
    }

    if (!dataForm.address.wards) {
      setWarnForm((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          wards: "Vui lòng nhập địa chỉ!",
        },
      }));
    }

    if (!dataForm.methods) {
      setWarnForm((prev) => ({
        ...prev,
        methods: "Vui lòng chọn phương thức thanh toán!",
      }));
    }
    if (
      dataForm.username &&
      dataForm.phone &&
      dataForm.address.city &&
      dataForm.address.district &&
      dataForm.address.wards &&
      dataForm.address.detail &&
      dataForm.methods
    ) {
      return true;
    }
  };
  const handleSubmitForm = () => {
    const isValid = handleValidations();
    if (isValid) {
      const address = `${dataAddress[dataForm.address.city].Name} - ${
        dataAddress[dataForm.address.city].Districts[dataForm.address.district]
          .Name
      } - ${
        dataAddress[dataForm.address.city].Districts[dataForm.address.district]
          .Wards[dataForm.address.wards].Name
      } - ${dataForm.address.detail}`;
      if (dataForm.methods) {
        setIsLoading(true);
        AuthRequest.post("carts/pay", {
          address: address,
          method: dataForm.methods,
        })
          .then((response) => response.data)
          .then((data) => {
            if (data.message) {
              handleSetReder();
              navigate("/");
              Toastify(1, data.message);
            }
          })
          .catch(() => {})
          .finally(() => setIsLoading(false));
      }
    }
  };

  return (
    <div className="w-full h-full text-sm">
      <Loading status={isLoading}>
        <div className="w-full bg-white p-4">
          <div className="text-lg font-bold text-black/60">
            Địa chỉ nhận hàng
          </div>
          <div className="w-full h-full flex justify-between items-center mb-4">
            <div className="w-1/4">Họ tên người nhận</div>
            <div className="w-3/4">
              <input
                className={`w-full py-2 px-3 border ${
                  warnForm.username ? "border-rose-500" : ""
                }`}
                type="text"
                value={dataForm?.username}
                placeholder="Họ và tên"
                onChange={(e) => {
                  setWarnForm((prev) => ({
                    ...prev,
                    username: "",
                  }));
                  setDataForm((prev) => ({
                    ...prev,
                    username: "",
                  }));
                }}
              />
              <p className="text-rose-700 indent-1 warn w-full mb-1">
                {warnForm.username}
              </p>
            </div>
          </div>

          <div className="w-full h-full flex justify-between items-center mb-4">
            <div className="">Số điện thoại</div>
            <div className="w-3/4">
              <input
                className={`w-full py-2 px-3 border ${
                  warnForm.phone ? "border-rose-500" : ""
                }`}
                value={dataForm?.phone}
                type="number"
                placeholder="Số điện thoại"
                onChange={(e) => {
                  setWarnForm((prev) => ({
                    ...prev,
                    phone: "",
                  }));
                  setDataForm((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }));
                }}
              />
              <p className="text-rose-700 indent-1 warn w-full mb-1">
                {warnForm.phone}
              </p>
            </div>
          </div>

          <div className="w-full h-full flex justify-between items-center mb-4">
            <div className="">Địa chỉ giao hàng</div>
            <div className="w-3/4 flex flex-wrap">
              <div className="w-1/3">
                <select
                  className={`w-full py-2 px-3 border ${
                    warnForm?.address?.city ? "border-rose-500" : ""
                  }`}
                  onChange={(e) => {
                    setWarnForm((prev) => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        city: "",
                      },
                    }));
                    setDataForm((prev) => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        city: e.target.value,
                        district: "",
                        wards: "",
                      },
                    }));

                    if (e.target.value) {
                      setDistricts(dataAddress[e.target.value]?.Districts);
                    }
                  }}
                  value={dataForm.address.city}
                >
                  <option value="" disabled hidden className="">
                    Chọn tỉnh/thành phố
                  </option>
                  {dataAddress.map((item, index) => {
                    return (
                      <option key={index} value={index}>
                        {item.Name}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="w-1/3">
                <select
                  className={`w-full py-2 px-3 border ${
                    warnForm?.address?.district ? "border-rose-500" : ""
                  }`}
                  type="text"
                  onChange={(e) => {
                    setWarnForm((prev) => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        district: "",
                      },
                    }));
                    setDataForm((prev) => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        district: e.target.value,
                        wards: "",
                      },
                    }));

                    if (e.target.value) {
                      setWards(districts[e.target.value].Wards);
                    }
                  }}
                  value={dataForm.address.district}
                >
                  <option value="" disabled hidden className="">
                    Chọn quận huyện
                  </option>
                  {districts?.map((item, i) => {
                    return (
                      <option key={i} name={item.Name} value={i} className="">
                        {item.Name}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="w-1/3">
                <select
                  className={`w-full py-2 px-3 border ${
                    warnForm?.address?.wards ? "border-rose-500" : ""
                  }`}
                  type="text"
                  placeholder="Địa chỉ"
                  onChange={(e) => {
                    setWarnForm((prev) => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        wards: "",
                      },
                    }));
                    setDataForm((prev) => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        wards: e.target.value,
                      },
                    }));
                  }}
                  value={dataForm.address.wards}
                >
                  <option value="" disabled hidden className="">
                    Chọn phường xã
                  </option>
                  {wards.map((item, index) => {
                    return (
                      <option key={index} value={index}>
                        {item.Name}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="w-full">
                <input
                  type="text"
                  className={`w-full py-2 px-3 border ${
                    warnForm?.address?.detail ? "border-rose-500" : ""
                  }`}
                  onChange={(e) => {
                    setWarnForm((prev) => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        detail: "",
                      },
                    }));
                    setDataForm((prev) => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        detail: e.target.value,
                      },
                    }));
                  }}
                  placeholder="Địa chỉ cụ thể số nhà tên tòa nhà, tên đường, tên khu vực"
                />
                <p className="text-rose-700 indent-1 warn w-full mb-1">
                  {warnForm?.address?.detail}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full bg-white mt-3 p-4">
          <div className="text-lg font-bold text-black/60">
            Phương thức thanh toán
          </div>
          <div className="my-2 border-b">
            <div
              className={`w-1/4 p-2 border rounded-sm flex items-center my-2 cursor-pointer ${
                dataForm.methods === "money"
                  ? "border-2 border-rose-500 text-black font-bold"
                  : null
              }`}
              onClick={(e) => {
                setDataForm((prev) => ({
                  ...prev,
                  methods: "money",
                }));
                setWarnForm((prev) => ({
                  ...prev,
                  methods: "",
                }));
              }}
            >
              <div
                className={`w-4 h-4 border-2 rounded-full ${
                  dataForm.methods === "money" ? "bg-black border-none" : null
                }`}
              ></div>
              <div className="ml-2">
                <FontAwesomeIcon
                  icon="fa-solid fa-money-bill"
                  className=" text-black/70"
                />{" "}
                Tiền mặt(COD)
              </div>
            </div>
            <div
              className={`w-1/4 p-2 border rounded-sm flex items-center my-2 cursor-pointer ${
                dataForm.methods === "pay"
                  ? "border-2 border-rose-500 text-black font-bold"
                  : null
              }`}
              onClick={(e) => {
                setWarnForm((prev) => ({
                  ...prev,
                  methods: "",
                }));
                setDataForm((prev) => ({
                  ...prev,
                  methods: "pay",
                }));
              }}
            >
              <div
                className={`w-4 h-4 border-2 rounded-full ${
                  dataForm.methods === "pay" ? "bg-black border-none" : null
                }`}
              ></div>
              <div className="ml-2">
                <FontAwesomeIcon icon="fa-solid fa-credit-card" /> Thanh toán
                trực tuyến (Online)
              </div>
            </div>
            <p className="text-rose-700 indent-1 warn w-full mb-1">
              {warnForm.methods}
            </p>
          </div>

          <div className="flex items-center">
            <div className="text-black/70 my-5 w-1/4">Ghi chú (Nếu có)</div>
            <div className="w-3/4">
              <input
                type=""
                className="w-full p-2 h-full border"
                onChange={(e) =>
                  setDataForm((prev) => ({ ...prev, note: e.target.value }))
                }
              />
            </div>
          </div>
        </div>

        <div className="w-full bg-white mt-3 p-4">
          <div>
            <div className="flex justify-between">
              <div className="text-md w-1/4 font-bold">STT</div>
              <div className="text-md w-1/4 font-bold">Tên SP</div>
              <div className="text-md w-1/4 font-bold">Loại</div>
              <div className="text-md w-1/4 font-bold">Số lượng</div>
              <div className="text-md w-1/4 font-bold">Thành tiền</div>
            </div>
            {dataCart.map((item, key) => {
              return (
                <div className="flex justify-between items-center">
                  <div className="w-1/4">
                    <p>{key + 1}</p>
                  </div>
                  <div className="w-1/4">
                    <p>{item.name}</p>
                  </div>{" "}
                  <div className="w-1/4">
                    <p>{item.type}</p>
                  </div>
                  <div className="w-1/4">
                    <p>x{item.quantity}</p>
                  </div>
                  <div className="w-1/4">
                    <p className="text-rose-500 font-bold">
                      {handleFormatPrice(item.total)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="border-t border-rose-500 mt-8"></div>
          <div className="flex items-center justify-end text-xl">
            <div className="">Tổng thanh toán:</div>
            <div className="ml-4 text-rose-500">
              {handleFormatPrice(bill.total)}
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              className="bg-rose-500 text-white px-6 py-2 hover:bg-sky-500"
              onClick={() => {
                const validater = handleValidations();
                if (validater) {
                  handleSubmitForm();
                }
              }}
              text="Đặt hàng"
            />
          </div>
        </div>
      </Loading>
    </div>
  );
}

export default PayPage;
