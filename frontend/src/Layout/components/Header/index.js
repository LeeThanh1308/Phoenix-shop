import { useEffect, useState, useContext, useLayoutEffect } from "react";
import { NavLink, Link, useNavigate, useParams } from "react-router-dom";
import Button from "./../../../components/Button";
import Cookies from "js-cookie";
import { CartContext } from "../../../hooks/useContext/CartContext";
import AuthRequest from "../../../utils/axios/AuthRequest";
import Toastify from "../../../components/Toast";
import Loading from "../../../components/Loading";
import { UserDataContext } from "../../../hooks/useContext/UserDataContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HttpRequest from "../../../utils/axios/HttpRequest";
import { LoginedContext } from "../../../hooks/useContext/LoginedContext";

function Header() {
  const navigate = useNavigate();
  const { reRender } = useContext(CartContext);
  const { reRenderUser } = useContext(UserDataContext);
  const { statusLogined, setStatusLogined } = useContext(LoginedContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAvt, setIsLoadingAvt] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [searchQuery, setSearchQuery] = useState(null);
  const [dataForm, setDataForm] = useState({ roles: [] });
  const [dataCategory, setDataCategory] = useState([]);
  const [dataCart, setDataCart] = useState([]);
  const [tipsQuery, setTipsQuery] = useState([]);
  const [isLoadTips, setIsLoadTips] = useState(false);

  useEffect(() => {
    if (statusLogined) {
      AuthRequest.get("accounts/user")
        .then((response) => {
          setDataForm(response.data);
        })
        .catch(() => {});
    }
  }, [reRenderUser, statusLogined]);

  useEffect(() => {
    if (!statusLogined) {
      const cartItem = localStorage.getItem("cart");
      if (Array.isArray(JSON?.parse(cartItem))) {
        AuthRequest.post("product-types/cart", {
          type: JSON?.parse(cartItem),
        })
          .then((response) => response.data)
          .then((data) => {
            if (Array.isArray(data?.cart)) {
              setDataCart(data?.cart);
            }
          })
          .catch(() => {});
      }
    } else {
      AuthRequest.get("carts")
        .then((response) => response.data)
        .then((data) => {
          if (Array.isArray(data)) {
            setDataCart(data);
          }
        })
        .catch(() => {});
    }
  }, [reRender]);

  useEffect(() => {
    (async () => {
      const cartItem = localStorage.getItem("cart");
      if (Array.isArray(JSON.parse(cartItem)) && statusLogined) {
        const cart = JSON.parse(cartItem);
        await cart?.map(async (item) => {
          if (item.quantity && item.type) {
            await AuthRequest.post("carts", {
              quantity: item.quantity,
              type: item.type,
            });
            return item;
          }
        });
        localStorage.removeItem("cart");
        AuthRequest.get("carts")
          .then((response) => response.data)
          .then((data) => {
            if (Array.isArray(data)) {
              setDataCart(data);
            }
          })
          .catch(() => {});
      }
    })();
  }, [statusLogined]);

  useEffect(() => {
    setSearchQuery(null);
  }, [showSearch]);
  useEffect(() => {
    HttpRequest.get("categories")
      .then((response) => response.data)
      .then((response) => {
        const data = response[0] ? response : [];
        setDataCategory(data);
      })
      .catch((e) => {});
  }, []);

  useEffect(() => {
    setTipsQuery([]);
    setIsLoadTips(true);
    const timerId = setTimeout(() => {
      if (searchQuery) {
        HttpRequest.get(`products/tips/${searchQuery}`)
          .then((response) => response.data)
          .then((data) => {
            if (Array.isArray(data) && data.length > 0) {
              setTipsQuery(data);
            }
          })
          .catch(() => {})
          .finally(() => {
            setIsLoadTips(false);
          });
      }
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchQuery]);

  const handleRedirectSearch = (slug) => {
    if (slug) {
      navigate("/search/" + slug);
      setShowSearch(null);
    }
  };

  const handleFormatPrice = (price) => {
    return Number(price).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  return (
    <Loading status={isLoading}>
      <div className="fixed top-0 right-0 left-0 z-50 flex w-full h-20 bg-red-600 text-slate-50 items-center justify-between shadow-sm shadow-black">
        <Link to="/">
          <div
            className="ml-8 w-20 h-20 max-sm:w-24 max-sm:h-8 logo"
            style={{
              backgroundImage: `url('${process.env.REACT_APP_DOMAIN_API}${process.env.REACT_APP_URL_AVATAR}logo.png')`,
            }}
          ></div>
        </Link>

        <div className=" max-sm:hidden">
          {showSearch ? (
            <div className="relative w-3/6 h-full z-10">
              <div
                className="fixed top-0 right-0 left-0 bottom-0"
                onClick={(e) => setShowSearch(false)}
              >
                <div
                  className="w-2/5 mt-5 mx-auto shadow-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="w-full h-10 flex justify-between items-center relative">
                    <input
                      type="text"
                      placeholder="Từ khoá mà bạn muốn tìm...."
                      className="w-full h-full text-slate-950 rounded-sm pl-4 pr-11 outline-none border-b border-neutral-800 "
                      autoFocus
                      onChange={(e) => setSearchQuery(e.target.value)}
                      // onFocus={(e) => setShowSearch(true)}
                    />
                    <div
                      className="absolute right-0 cursor-pointer w-10 h-10"
                      onClick={(e) => handleRedirectSearch(searchQuery)}
                    >
                      <FontAwesomeIcon
                        className=" text-slate-950 p-3 hover:bg-neutral-800 hover:text-slate-50"
                        icon="fa-solid fa-magnifying-glass"
                      />
                    </div>
                  </div>
                  <div className="w-full h-auto text-slate-950 bg-white">
                    {Array.isArray(tipsQuery) &&
                    searchQuery &&
                    tipsQuery.length > 0 ? (
                      tipsQuery.map((item, index) => {
                        return (
                          <div
                            key={index}
                            className="result text-base px-4 py-2 hover:bg-rose-950/5 hover:cursor-pointer hover:font-bold"
                            onClick={(e) => {
                              navigate(`search/${item.slug}`);
                              setShowSearch(false);
                            }}
                          >
                            {item.name}
                          </div>
                        );
                      })
                    ) : searchQuery && !isLoadTips ? (
                      <div
                        className="result text-base px-4 py-2 hover:bg-rose-950/5"
                      >
                        Không có kết quả
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-full">
              <NavLink
                activeclassname="active"
                to="/"
                className="nav-header hover:bg-black/50 w-full h-full  py-4"
              >
                <div className="h-full w-max px-4 flex items-center font-bold justify-center rounded-md">
                  Trang chủ
                </div>
              </NavLink>

              <NavLink
                activeclassname="active"
                to="/news"
                className="nav-header w-full h-full py-4 hover:bg-black/50 "
              >
                <div className="h-full w-max px-4 flex items-center font-bold justify-center rounded-md">
                  Bảng tin
                </div>
              </NavLink>

              {/* DANH MỤC */}
              <div
                className="nav-header w-full h-full py-4 relative hover:bg-black/50 "
                onMouseEnter={(e) => setShowCategory(true)}
                onMouseLeave={(e) => setShowCategory(false)}
              >
                <div className="h-full w-max px-4 flex items-center font-bold justify-center rounded-md">
                  Danh Mục
                </div>
                {showCategory ? (
                  <div className="absolute top-full w-96 left-0 bg-white text-black shadow-md shadow-black category">
                    {dataCategory.map((data, key) => (
                      <div
                        key={key}
                        className="w-full h-9 border-b px-2 hover:bg-black/5 flex items-center truncate"
                        onClick={(e) => handleRedirectSearch(data.slug)}
                      >
                        {data.name}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>

        <div
          className="flex items-center mr-8 max-sm:hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {showSearch ? (
            <div className="" onClick={(e) => setShowSearch(false)}>
              <FontAwesomeIcon
                icon="fa-regular fa-circle-xmark"
                className=" text-rose-50 text-xl py-2 px-3 cursor-pointer hover:opacity-80"
              />
            </div>
          ) : (
            <div className="" onClick={(e) => setShowSearch(true)}>
              <FontAwesomeIcon
                icon="fa-solid fa-magnifying-glass"
                className=" text-slate-50 text-base py-2 px-3 cursor-pointer hover:opacity-80"
              />
            </div>
          )}

          {/* cart */}
          <div
            className="py-2 px-3 rounded-full relative"
            onMouseEnter={(e) => setShowCart(true)}
            onMouseLeave={(e) => setShowCart(false)}
          >
            <div onClick={(e) => setShowCart(true)}>
              <FontAwesomeIcon
                icon="fa-solid fa-cart-shopping"
                className=" text-xl cursor-pointer hover:opacity-9"
              />
              <div className="absolute top-0 right-0 text-xs w-5 h-5 bg-rose-500 rounded-full text-slate-50 flex justify-center items-center">
                {dataCart.length}
              </div>
            </div>
            {showCart ? (
              <>
                <div className="absolute top-full bottom-0 right-0 h-max cart border shadow-md shadow-black text-slate-950 bg-slate-50 rounded-md z-20">
                  <div className="px-4 py-1 flex justify-between border-b">
                    <div className="text-2xl font-bold">Giỏ hàng</div>
                  </div>
                  <div className="w-full h-full px-4">
                    <div className="text-sm text-gray-500 text-center flex w-full">
                      <div className="w-3/6 text-start">SẢN PHẨM</div>
                      <div className="w-1/6">ĐƠN GIÁ</div>
                      <div className="w-1/6">SỐ LƯỢNG</div>
                      <div className="w-1/6">SỐ TIỀN</div>
                    </div>
                    {/* Content */}
                    {dataCart.map((data, index) => (
                      <div
                        className="text-sm text-gray-500 flex border-t py-2 items-center"
                        key={index}
                      >
                        <div className="w-3/6 flex items-center" key={index}>
                          <div
                            className="w-14 h-14 rounded mr-2 text-xs"
                            style={{
                              backgroundImage: `url('${process.env.REACT_APP_DOMAIN_API}${process.env.REACT_APP_URL_PRODUCT}${data.image}')`,
                            }}
                          ></div>
                          <div className="truncate w-3/5 ...">
                            <div className="">{data.name}</div>
                            <div>{data.type}</div>
                          </div>
                        </div>
                        <div className="w-1/6 text-center text-rose-500">
                          {handleFormatPrice(data.discount)}
                        </div>
                        <div className="w-1/6 text-center flex justify-center items-center">
                          <div className="text-2xl text-gray-500">
                            {data.quantity}
                          </div>
                        </div>
                        <div className="w-1/6 text-center text-green-500">
                          {handleFormatPrice(data.total)}
                        </div>
                      </div>
                    ))}
                    {/* Action */}
                    <div className="p-4 flex justify-between">
                      <Link to="/cart" onClick={(e) => setShowCart(false)}>
                        <div>
                          <Button
                            className="bg-sky-500 text-slate-50 py-1 px-2 rounded font-bold"
                            text="Xem chi tiết"
                          />
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>

          {statusLogined ? (
            <>
              <div
                className="w-12 h-12 rounded-full mx-2 relative cursor-pointer shadow-md shadow-slate-50"
                onMouseEnter={(e) => setShowInfo(true)}
                onMouseLeave={(e) => setShowInfo(false)}
              >
                {isLoadingAvt ? (
                  <div className="loader-avt w-full h-full">
                    <span />
                    <span />
                    <span />
                  </div>
                ) : null}
                <img
                  src={`${process.env.REACT_APP_DOMAIN_API}${process.env.REACT_APP_URL_AVATAR}${dataForm?.avatar}`}
                  alt="avatar"
                  className="w-full h-full rounded-full"
                  onLoad={() => setIsLoadingAvt(false)}
                />

                {showInfo ? (
                  <div className="absolute top-full right-0 w-96 mt-2 info border shadow-md shadow-black text-slate-950 bg-slate-50 rounded-md z-20 p-4">
                    <Link to={`profile/${dataForm?.usid}`}>
                      <div className="w-full h-24 rounded-md shadow flex items-center mb-3">
                        <div className="w-12 h-12 rounded-full mr-3 ml-3">
                          <img
                            src={`${process.env.REACT_APP_DOMAIN_API}${process.env.REACT_APP_URL_AVATAR}${dataForm?.avatar}`}
                            className="w-full h-full rounded-full"
                            alt=""
                          />
                        </div>
                        <div className="">
                          <div className=" font-bold text-sm">
                            {dataForm.fullname}{" "}
                            <FontAwesomeIcon
                              icon="fa-solid fa-circle-check "
                              className="text-xs ml-0.5 text-sky-500"
                            />
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            Online {""}
                            <FontAwesomeIcon
                              icon="fa-solid fa-circle"
                              className=" mx-1 text-green-500 smaill"
                            />
                            {dataForm?.roles}
                          </div>
                        </div>
                      </div>
                    </Link>
                    {dataForm?.roles === "CEO" ||
                    dataForm?.roles === "MANAGE" ? (
                      <Link to="/manage">
                        <div className="w-full h-12 pl-4 flex items-center hover:bg-black rounded-md hover:text-white cursor-pointer hover:font-bold border mb-1">
                          Trang quản trị
                        </div>
                      </Link>
                    ) : null}
                    <Link to="/history">
                      <div className="w-full h-12 pl-4 flex items-center hover:bg-black rounded-md hover:text-white cursor-pointer hover:font-bold border mb-1">
                        Lịch sử mua hàng
                      </div>
                    </Link>
                    <Link to="/cart">
                      <div className="w-full h-12 pl-4 flex items-center hover:bg-black rounded-md hover:text-white cursor-pointer hover:font-bold border mb-1">
                        Giỏ hàng
                      </div>
                    </Link>
                    <Link to="/settings">
                      <div className="w-full h-12 pl-4 flex items-center hover:bg-black rounded-md hover:text-white cursor-pointer hover:font-bold border mb-1">
                        Cài đặt
                      </div>
                    </Link>

                    <Link to={"/logout"}>
                      <div className="w-full h-12 pl-4 flex items-center hover:bg-black rounded-md hover:text-white cursor-pointer hover:font-bold border mb-1">
                        Đăng xuất
                      </div>
                    </Link>
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <>
              <Link to="login">
                <div className="p-5">Đăng nhập</div>
              </Link>

              <Link to="signup">
                <div className="p-5">Đăng ký</div>
              </Link>
            </>
          )}
        </div>

        <div className="mr-2 sm:hidden">
          <FontAwesomeIcon icon="fa-solid fa-bars" styles="color: #ffffff;" />
        </div>
      </div>
    </Loading>
  );
}

export default Header;
