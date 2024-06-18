import { useEffect, useLayoutEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import AuthRequest from "../../utils/axios/AuthRequest";
import Toastify from "../../components/Toast";
import Loading from "../../components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function AdminPage() {
  const Navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [dataForm, setDataForm] = useState({
    avatar: "",
    fullname: "",
    roles: "",
  });
  // const [dataPermise, setDataPermise] = useState([]);
  const [showSubMenu, setShowSubMenu] = useState({
    stose: false,
  });

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await AuthRequest.get("accounts/user")
        .then((response) => response.data)
        .then((data) => {
          if (data?.fullname) {
            setDataForm(data);
          }
        })
        .catch(() => {});
      // await AuthRequest.get("premises")
      //   .then((response) => response.data)
      //   .then((data) => {
      //     if (data?.length > 0) {
      //       setDataPermise(data);
      //     }
      //   })
      //   .catch((error) => {});
      setIsLoading(false);
    })();
  }, []);

  return (
    <div
      className="w-full h-full text-stone-50 relative"
      onClick={() => setShowMenu(false)}
    >
      <Loading status={isLoading}>
        {showMenu ? (
          <div
            className="w-full h-14 bg-sky-500 flex justify-between items-center showheader fixed top-0 left-0 right-0 z-50"
            onClick={(e) => setShowMenu(false)}
          >
            <div className="h-full w-1/6 flex items-center justify-center bg-sky-600">
              <h1>Trang quản trị</h1>
            </div>
            <div className="flex w-5/6 justify-between items-center">
              <div className="flex">
                <div>
                  <div
                    className="cursor-pointer h-full flex justify-center items-center hover:text-slate-950 hover:bg-white"
                    onClick={() => Navigate(-1)}
                  >
                    <div className=" px-6">
                      <FontAwesomeIcon icon="fa-solid fa-left-long text-2xl" />
                    </div>
                  </div>
                </div>

                <NavLink
                  activeclassname="active"
                  to="/"
                  className="w-full h-full"
                >
                  <div className="cursor-pointer h-14 w-32 flex justify-center items-center hover:bg-slate-50 hover:text-slate-950">
                    <div>Trang chủ</div>
                  </div>
                </NavLink>
              </div>
              <div className="flex items-center mr-4">
                <NavLink to={"/logout"}>
                  <div className="cursor-pointer rounded-full flex justify-center items-center hover:opacity-50">
                    <div className="mx-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        alt="Logout"
                        height="1em"
                        viewBox="0 0 512 512"
                      >
                        {/* Đặt dữ liệu SVG logout ở đây */}
                      </svg>
                    </div>
                    <div>Đăng xuất</div>
                  </div>
                </NavLink>
              </div>
            </div>
          </div>
        ) : null}
        <div
          id="bodyManage"
          className="flex justify-between w-full h-auto relative"
        >
          {!showMenu ? (
            <div
              className="z-50 fixed left-0 top-6 w-2 h-20 rounded-r-md shadow shadow-black bg-white hover:bg-black/40"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(true);
              }}
            ></div>
          ) : (
            <div
              className="w-1/6 bg-zinc-800 menu z-50 fixed top-14 left-0 bottom-0"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div className="py-2 px-2 flex items-center">
                <div
                  className="w-16 h-16 rounded-full mr-3"
                  style={{
                    backgroundImage: `url('${process.env.REACT_APP_DOMAIN_API}${process.env.REACT_APP_URL_AVATAR}${dataForm?.avatar}')`,
                  }}
                ></div>
                <div>
                  <div>
                    <h2>
                      {dataForm.fullname} - {dataForm.roles}
                    </h2>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-1 w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-xs">Online</p>
                  </div>
                </div>
              </div>
              <div className="text-base px-2 py-2 font-bold text-slate-400">
                Quản trị
              </div>
              <ul>
                <li className="">
                  <NavLink
                    activeclassname="active"
                    to="/manage/users"
                    className="nav-link-mana w-full pl-8 flex py-2 cursor-pointer"
                  >
                    Quản trị user
                  </NavLink>
                </li>

                <li className="">
                  <NavLink
                    activeclassname="active"
                    to="/manage/category"
                    className="nav-link-mana w-full pl-8 flex py-2 cursor-pointer"
                  >
                    Quản trị danh mục
                  </NavLink>
                </li>

                <li className="">
                  <NavLink
                    activeclassname="active"
                    to="/manage/products"
                    className="nav-link-mana w-full pl-8 flex py-2 cursor-pointer"
                  >
                    Quản trị kho hàng
                  </NavLink>
                </li>

                <li className="">
                  <NavLink
                    activeclassname="active"
                    to="/manage/slider"
                    className="nav-link-mana w-full pl-8 flex py-2 cursor-pointer"
                  >
                    Quản trị slider
                  </NavLink>
                </li>

                <li
                  className=""
                  onMouseEnter={(e) => {
                    setShowSubMenu((prev) => ({
                      ...prev,
                      stose: true,
                    }));
                  }}
                  onMouseLeave={(e) => {
                    setShowSubMenu((prev) => ({
                      ...prev,
                      stose: false,
                    }));
                  }}
                >
                  <NavLink
                    activeclassname="active"
                    to="/manage/shop"
                    className="nav-link-mana w-full pl-8 flex py-2 cursor-pointer"
                  >
                    Quản trị chuỗi cửa hàng
                  </NavLink>
                  {showSubMenu.stose ? (
                    <ul className="menu">
                      <li className=" hover:bg-black">
                        <NavLink
                          activeclassname="active"
                          to="/manage/shop/"
                          className="nav-link-mana w-full pl-16 flex py-2 cursor-pointer"
                        >
                          Quản lý cửa hàng
                        </NavLink>
                      </li>
                      <li className=" hover:bg-black">
                        <NavLink
                          activeclassname="active"
                          to="/manage/shop/chuc-vu"
                          className="nav-link-mana w-full pl-16 flex py-2 cursor-pointer"
                        >
                          Quản lý nhân sự
                        </NavLink>
                      </li>

                      {/* {dataPermise.map((item, i) => {
                        return (
                          <li className=" hover:bg-black" key={i}>
                            <NavLink
                              activeclassname="active"
                              to={`/manage/shop/product/${item.id}`}
                              className="nav-link-mana w-full pl-16 flex py-2 cursor-pointer"
                            >
                              Quản trị sản phẩm cửu hàng {item.name}
                            </NavLink>
                          </li>
                        );
                      })} */}
                    </ul>
                  ) : null}
                </li>
              </ul>
            </div>
          )}
          <div
            className={`h-auto px-6 pt-6 bg-white ${
              showMenu ? "w-5/6  absolute top-14 right-0 bottom-0" : "w-full"
            }`}
          >
            <Outlet />
          </div>
        </div>
      </Loading>
    </div>
  );
}

export default AdminPage;
