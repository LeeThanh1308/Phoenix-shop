import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import SliderProduct from "./../../../components/SliderProduct";
import Button from "./../../../components/Button";
import Cookies from "js-cookie";
import Toast from "./../../../components/Toast";
import { CartContext } from "../../../hooks/useContext/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HttpRequest from "../../../utils/axios/HttpRequest";
import Loading from "../../../components/Loading";
import AuthRequest from "../../../utils/axios/AuthRequest";
import { Empty } from "antd";

function Products() {
  const { handleSetReder } = useContext(CartContext);
  const { productId } = useParams();
  const [dataForm, setDataForm] = useState({
    type: [{ type: "", price: "", discount: "" }],
  });
  const [isShowFull, setIsShowFull] = useState(false);
  const [btnActive, setBtnActive] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const handleQuantity = (action) => {
    if (action === "-") {
      if (quantity > 1) {
        setQuantity(quantity - 1);
      }
    } else {
      if (quantity < dataForm?.type[btnActive]?.quantity) {
        setQuantity(quantity + 1);
      }
    }
  };

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

  const handleSubmitForm = () => {
    const Logined = Cookies.get("Logined");
    if (Logined) {
      if (btnActive >= 0) {
        setIsLoading(true);
        AuthRequest.post("carts", {
          quantity: quantity,
          type: dataForm?.type[btnActive]?.id,
        })
          .then((response) => response.data)
          .then((data) => {
            if (data.message) {
              handleSetReder();
              Toast(1, data.message);
            }
          })
          .catch(() => {})
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        Toast(0, "Bạn chưa chọn loại");
      }
    } else if (quantity > 0 && dataForm?.type[btnActive]?.id > 0) {
      setIsLoading(true);
      const cartItem = localStorage.getItem("cart");

      if (cartItem) {
        const cart = JSON.parse(cartItem);
        if (Array.isArray(cart) && cart.length > 0) {
          localStorage.setItem(
            "cart",
            JSON.stringify(
              cart.reduce(
                (acc, item, index) => {
                  if (item.type === dataForm?.type[btnActive]?.id) {
                    cart.splice(index, 1, {
                      quantity: item.quantity + quantity,
                      type: item.type,
                    });
                    return [...cart];
                  } else {
                    return [
                      ...cart,
                      {
                        quantity: quantity,
                        type: dataForm?.type[btnActive]?.id,
                      },
                    ];
                  }
                },
                [
                  {
                    quantity: 0,
                    type: 0,
                  },
                ]
              )
            )
          );
        } else {
          window.localStorage.setItem(
            "cart",
            JSON.stringify([
              {
                quantity: quantity,
                type: dataForm?.type[btnActive]?.id,
              },
            ])
          );
        }
      } else {
        window.localStorage.setItem(
          "cart",
          JSON.stringify([
            {
              quantity: quantity,
              type: dataForm?.type[btnActive]?.id,
            },
          ])
        );
      }
      setTimeout(() => {
        handleSetReder();
        setIsLoading(false);
        Toast(1, "Thêm sản phẩm vào giỏ hàng thành công.");
      }, 200);
    }
  };
  useEffect(() => {
    setIsLoading(true);
    window.scrollTo(0, 0);
    HttpRequest.get("products/detail/" + productId)
      .then((response) => response.data)
      .then((data) => {
        setDataForm(data);
      })
      .catch((e) => {})
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="w-full h-auto">
      {isShowFull ? (
        <div className="absolute top-0 right-0 left-0 z-50 flex justify-center">
          <div className="w-[calc(100%_-_30%_-_40px)] relative shadow rounded-xl overflow-hidden">
            <SliderProduct
              isShowFull={isShowFull}
              data={dataForm.image}
              onChange={(value) => {
                setIsShowFull(value);
              }}
            />
          </div>
        </div>
      ) : (
        <Loading status={isLoading}>
          {dataForm ? (
            <>
              <div className="w-full h-3/5 flex bg-white">
                <div className="w-2/5 px-3">
                  <div className="aspect-square relative">
                    <SliderProduct
                      data={dataForm.image}
                      onChange={(value) => {
                        setIsShowFull(value);
                      }}
                    />
                  </div>
                </div>
                <div className="w-3/5 px-3 py-7 text-sm text-black/60">
                  <div className="pb-3">
                    <div className="text-sm text-black/90">{dataForm.name}</div>
                    <div className="text-xs text-black/50">
                      Mã vạch: {dataForm.barcode}
                    </div>
                  </div>
                  <div
                    className="w-full h-28 p-3 text-sm  flex-col mb-5"
                    // style={{ backgroundImage: `url('${dataForm?.image[0]}')` }}
                  >
                    {dataForm?.type[btnActive]?.discount > 0 ? (
                      <>
                        <div className="w-full flex items-center">
                          <div className="w-1/4">Giá niêm yết:</div>
                          <div className="w-3/4 line-through">
                            {dataForm?.type[btnActive]?.price}
                          </div>
                        </div>
                        <div className="w-full flex items-center pb-1 border-b">
                          <div className="w-1/4">Giá khuyến mãi:</div>
                          <div className="w-3/4 text-red-600 text-base">
                            {handleCalcSale(
                              dataForm?.type[btnActive]?.price,
                              dataForm?.type[btnActive]?.discount
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full flex items-center pb-1 border-b">
                        <div className="w-1/4">Giá niêm yết:</div>
                        <div className="w-3/4 text-red-600 text-base">
                          {handleCalcSale(
                            dataForm?.type[btnActive]?.price,
                            dataForm?.type[btnActive]?.discount
                          )}
                        </div>
                      </div>
                    )}
                    <div className="w-full flex items-center my-auto">
                      <div className="w-1/4">Đã bán:</div>
                      <div className="w-3/4 ">
                        {dataForm?.type[btnActive]?.solds}
                      </div>
                    </div>
                    <div className="w-full flex items-center my-auto">
                      <div className="w-1/4">Trong kho còn:</div>
                      <div className="w-3/4 ">
                        {dataForm?.type[btnActive]?.quantity}
                      </div>
                    </div>
                  </div>
                  <div className="Loại/Size">
                    <div className="w-full flex items-center my-4">
                      <div className="w-1/4">Loại/Size:</div>
                      <div className="w-3/4">
                        {dataForm?.type.map((it, index) => (
                          <Button
                            className={`py-1 px-3 border rounded-md mr-1 ${
                              btnActive === index
                                ? "bg-sky-500 text-white"
                                : null
                            }`}
                            text={it.type}
                            onClick={(e) => {
                              setBtnActive(index);
                              setQuantity(1);
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="w-full flex items-center my-4">
                      <div className="w-1/4">Số lượng:</div>
                      <div className="w-3/4">
                        <div className="w-24 h-8 flex justify-center items-center border">
                          <div
                            className="h-full w-1/3 flex justify-center items-center text-2xl cursor-pointer hover:bg-black/20 border-r"
                            onClick={(e) => handleQuantity("-")}
                          >
                            -
                          </div>
                          <div className="h-full w-1/3 flex justify-center items-center text-base border-r text-black">
                            <input
                              type="text"
                              value={quantity}
                              className="w-full h-full flex justify-center items-center text-center"
                              onBlur={() => {
                                if (quantity === "") {
                                  setQuantity(1);
                                }
                              }}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (
                                  /[0-9]/g.test(value) &&
                                  value <=
                                    dataForm?.type[btnActive]?.quantity &&
                                  value > 0
                                ) {
                                  setQuantity(value);
                                } else if (value === "") {
                                  setQuantity(value);
                                }
                              }}
                            />
                          </div>
                          <div
                            className="h-full w-1/3 flex justify-center items-center text-2xl cursor-pointer hover:bg-black/20"
                            onClick={(e) => handleQuantity("+")}
                          >
                            +
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full pt-14">
                      <Button
                        className="px-3 py-2 bg-rose-600 text-white hover:bg-rose-600/60 shadow-lg"
                        text=" THÊM VÀO GIỎ HÀNG +"
                        id={dataForm.id}
                        onClick={(e) => handleSubmitForm()}
                      >
                        {" "}
                        <FontAwesomeIcon icon="fa-solid fa-cart-plus" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-black h-11 flex text-lg font-bold">
                <div className="w-full h-full flex items-center pl-5">
                  Mô tả sản phẩm
                </div>
              </div>
              <div
                className="w-full h-auto bg-white pb-8 p-4"
                dangerouslySetInnerHTML={{
                  __html: dataForm.description,
                }}
              ></div>
            </>
          ) : (
            <div className="w-full h-3/5 flex justify-center items-center bg-white p-8">
              <Empty description="Sản phẩm không tồn tại." />
            </div>
          )}
        </Loading>
      )}
    </div>
  );
}

export default Products;
