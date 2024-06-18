import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Empty } from "antd";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthRequest from "../../../utils/axios/AuthRequest";
import Toastify from "../../../components/Toast";
import Loading from "../../../components/Loading";
import { CartContext } from "../../../hooks/useContext/CartContext";

function CartPage() {
  const { handleSetReder } = useContext(CartContext);
  const [reClose, setReClose] = useState(false);
  const [dataCart, setDataCart] = useState([]);
  const [reRender, setReRender] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bill, setBill] = useState({});
  const Logined = Cookies.get("Logined");
  useEffect(() => {
    window.scroll(0, 0);
    (async () => {
      if (Logined) {
        setIsLoading(true);
        await AuthRequest.get("carts")
          .then((response) => {
            if (response.status === 200) {
              setDataCart(response.data);
            } else {
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
      } else {
        const cartItem = localStorage.getItem("cart");
        if (cartItem) {
          setIsLoading(true);
          await AuthRequest.post("product-types/cart", {
            type: JSON.parse(cartItem),
          })
            .then((response) => response.data)
            .then((data) => {
              if (data) {
                if (Array.isArray(data?.cart)) {
                  setDataCart(data?.cart);
                }
                setBill(data?.bill);
              }
            })
            .catch(() => {});
        }
        setIsLoading(false);
      }
    })();
  }, [reRender]);

  const handleFormatPrice = (price) => {
    return Number(price).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };
  const handleUpdateCart = (action, id, quantity) => {
    if (Logined) {
      setIsLoading(true);
      if (action) {
        AuthRequest.patch("carts/" + id, {
          quantity: quantity + 1,
        })
          .then((response) => response.data)
          .then((data) => {
            handleSetReder();
            setReRender(!reRender);
            Toastify(data?.message);
          })
          .catch(() => {})
          .finally(() => setIsLoading(false));
      } else {
        AuthRequest.patch("carts/" + id, {
          quantity: quantity - 1,
        })
          .then((response) => response.data)
          .then((data) => {
            handleSetReder();
            setReRender(!reRender);
            Toastify(data?.message);
          })
          .catch(() => {})
          .finally(() => setIsLoading(false));
      }
    } else {
      const cartItem = localStorage.getItem("cart");
      if (cartItem) {
        const cart = JSON.parse(cartItem);
        if (Array.isArray(cart)) {
          const newCart = cart.map((item, index) => {
            if (item.type === id) {
              if (item.quantity === 1 && !action) {
                cart.splice(index, 1);
              } else {
                return {
                  quantity: action
                    ? Number(item.quantity) + 1
                    : Number(item.quantity) - 1,
                  type: item.type,
                };
              }
            }
            return item;
          });

          if (!action && quantity === 1) {
            localStorage.setItem("cart", JSON.stringify(cart));
          } else {
            localStorage.setItem("cart", JSON.stringify(newCart));
          }
        }
      }
      handleSetReder();
      setReRender(!reRender);
    }
  };

  const handleDeleteCart = (id) => {
    const comfirm = window.confirm("Bạn chắc chắn muốn xóa sản phẩm này?");
    const Logined = Cookies.get("Logined");
    if (comfirm && Logined) {
      setIsLoading(true);
      AuthRequest.delete("carts/" + id)
        .then((response) => response.data)
        .then((data) => {
          if (data.message) {
            setReRender(!reRender);
            handleSetReder();
            Toastify(1, data?.message);
          }
        })
        .catch(() => {})
        .finally(() => setIsLoading(false));
    } else if (comfirm && !Logined) {
      const cartItem = localStorage.getItem("cart");
      if (cartItem) {
        const cart = JSON.parse(cartItem);
        if (Array.isArray(cart)) {
          cart.map((item, index) => {
            if (item.type === id) {
              cart.splice(index, 1);
              localStorage.setItem("cart", JSON.stringify(cart));
              handleSetReder();
              setReRender(!reRender);
              Toastify(1, "Xóa sản phẩm thành công.");
            }
            return item;
          });
        }
      }
    }
  };

  const handleClearCart = async () => {
    const comfirm = window.confirm(
      "Bạn chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng?"
    );
    if (comfirm && Logined) {
      await AuthRequest.post("carts/clear")
        .then((response) => response.data)
        .then((response) => {
          if (response.message) {
            Toastify(1, response.message);
            setReRender(!reRender);
            handleSetReder();
          }
        })
        .catch(() => {})
        .finally(() => setIsLoading(false));
    } else if (comfirm && !Logined) {
      setIsLoading(true);
      localStorage.setItem("cart", JSON.stringify([]));

      handleSetReder();
      setReRender(!reRender);
      setIsLoading(false);
      Toastify(1, "Xóa giỏ hàng thành công.");
    }
  };

  return (
    <div className="w-full bg-white flex text-sm text-black/70 pt-6 pb-20">
      {/* San pham */}
      <Loading status={isLoading}>
        {dataCart.length === 0 ? (
          <div className="w-full h-full text-2xl p-14 flex justify-center items-center text-center">
            <Empty
              image={
                <FontAwesomeIcon
                  icon="fa-solid fa-cart-shopping"
                  className="text-rose-500"
                />
              }
              description={"Giỏ hàng trống."}
            />
          </div>
        ) : (
          <>
            <div className="w-2/3 px-4">
              {dataCart.map((data, key) => (
                <div className="flex items-center justify-between w-full border-b py-2 px-4">
                  <div className="flex justify-between items-center w-11/12">
                    <div className="flex items-center w-3/5">
                      <div
                        className="w-12 h-12 shadow"
                        style={{
                          backgroundImage: `url('${process.env.REACT_APP_DOMAIN_API}${process.env.REACT_APP_URL_PRODUCT}${data.image}')`,
                        }}
                      ></div>
                      <div className=" ml-2">
                        <div className="text-black/80">{data?.name}</div>
                        <div className="text-black/50">
                          Số lượng/Loại: {data.type}
                        </div>
                      </div>
                    </div>
                    <div className="flex w-2/5 justify-between">
                      <div className="flex flex-wrap items-center flex-col-reverse">
                        <div className="text-black/80 text-green-500">
                          {data.discount}
                        </div>
                        {data?.discount < data.price ? (
                          <div className="line-through text-red-400">
                            {handleFormatPrice(data?.price)}
                          </div>
                        ) : null}
                      </div>
                      <div className="h-10 w-32 border border-rose-600 flex items-center rounded-xl">
                        <div
                          className="h-full w-1/3 flex items-center justify-center cursor-pointer text-2xl"
                          onClick={() => {
                            Logined
                              ? handleUpdateCart(
                                  false,
                                  data?.typeId,
                                  data?.quantity
                                )
                              : handleUpdateCart(
                                  false,
                                  data?.id,
                                  data?.quantity
                                );
                          }}
                        >
                          -
                        </div>
                        <div className="h-full w-1/3 flex items-center justify-center text-xl">
                          {data.quantity}
                        </div>
                        <div
                          className="h-full w-1/3 flex items-center justify-center cursor-pointer text-2xl"
                          onClick={() => {
                            Logined
                              ? handleUpdateCart(
                                  true,
                                  data?.typeId,
                                  data?.quantity
                                )
                              : handleUpdateCart(
                                  true,
                                  data?.id,
                                  data?.quantity
                                );
                          }}
                        >
                          +
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-1/12 flex items-center justify-center">
                    <div
                      className="w-5 h-5 rounded-full text-black/70 text-sm flex justify-center cursor-pointer items-center bg-rose-500"
                      onMouseEnter={(e) => setReClose(key)}
                      onMouseLeave={(e) => setReClose(null)}
                      onClick={() => handleDeleteCart(data?.id)}
                    >
                      {reClose === key ? (
                        <FontAwesomeIcon icon="fa-solid fa-xmark" />
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}

              <div
                className="text-rose-500 my-2 mx-4 cursor-pointer"
                onClick={() => {
                  handleClearCart();
                }}
              >
                Xoá giỏ hàng
              </div>
            </div>
            <div className=" w-1/3 px-4 pb-4">
              <div className="w-full flex justify-between mb-2">
                <div>Tạm tính giỏ hàng: </div>
                <div>{handleFormatPrice(bill?.price)}</div>
              </div>
              <div className="w-full flex justify-between mb-2">
                <div>Tạm tính sản phẩm khuyến mãi: </div>
                <div>{handleFormatPrice(bill?.discount)}</div>
              </div>
              <div className="w-full flex justify-between mb-2">
                <div>Tiết kiệm được: </div>
                <div>{handleFormatPrice(bill?.save)}</div>
              </div>
              <div className="w-full flex justify-between mb-2">
                <div>Phí vận chuyển: </div>
                <div>0đ</div>
              </div>
              <div className="w-full flex justify-between mb-2">
                <div>Tổng sản phẩm: </div>
                <div>{bill?.quantity}</div>
              </div>
              {/* <div className="w-full flex justify-between text-sm mb-2 border-t border-rose-500">
          <div className=" text-xs">(Giá đã bao gồm 10% VAT)</div>
        </div> */}
              <div className="w-full flex justify-between  mb-2 border-t border-rose-500">
                <div>Thành tiền: </div>
                <div>{handleFormatPrice(bill?.total)}</div>
              </div>
              {Logined ? (
                <Link to="/pay">
                  <div className="w-full h-10 border bg-red-500 flex justify-center items-center font-bold text-white rounded-lg cursor-pointer hover:bg-red-500/70">
                    THANH TOÁN: {handleFormatPrice(bill?.total)}
                  </div>
                </Link>
              ) : (
                <div
                  onClick={() => {
                    Toastify(1, "Vui lòng đăng nhập để sử dụng chức năng này.");
                  }}
                  className="w-full h-10 border bg-red-500 flex justify-center items-center font-bold text-white rounded-lg cursor-pointer hover:bg-red-500/70"
                >
                  THANH TOÁN: {handleFormatPrice(bill?.total)}
                </div>
              )}
            </div>
          </>
        )}
      </Loading>
    </div>
  );
}

export default CartPage;
