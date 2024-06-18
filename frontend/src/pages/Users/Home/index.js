import { useEffect, useState } from "react";
import Slider from "./../../../components/Slider";
import { Link } from "react-router-dom";
import HttpRequest from "../../../utils/axios/HttpRequest";
import Loading from "../../../components/Loading";

function HomePage() {
  const [dataForm, setDataForm] = useState([]);
  const [dataSlider, setDataSlider] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      localStorage.setItem("scrollPosition", currentScrollPos.toString());
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const storedScrollPosition = localStorage.getItem("scrollPosition");
    if (storedScrollPosition !== null) {
      window.scrollTo(0, parseInt(storedScrollPosition));
    }
  }, []);
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await HttpRequest.get("slider")
        .then((response) => response.data)
        .then((data) => {
          setDataSlider(data);
        })
        .catch((error) => {});
      await HttpRequest.get("categories/products")
        .then((response) => response.data)
        .then((response) => {
          if (Array.isArray(response) && response.length > 0) {
            setDataForm(response);
          }
        })
        .catch((e) => {});

      setIsLoading(false);
    })();
  }, []);

  function formatPrice(price) {
    return Number(price).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }
  const handleCalcSale = (current, sale) => {
    // console.log(current, sale);
    // const unformattedPrice = current?.replace(/[^0-9.-]+/g, "");
    // const price = unformattedPrice?.replace(/\./g, "");
    const result = current - (current / 100) * sale;
    return formatPrice(result);
  };

  return (
    <div className="mb-96">
      {dataSlider.length > 0 ? (
        <div className="w-full flex">
          <div className="w-full h-auto z-0 overflow-hidden justify-center items-center relative">
            <Slider data={dataSlider} />
          </div>
        </div>
      ) : null}
      <Loading status={isLoading}>
        <div className="bg-slate-50 pb-5 rounded-b-2xl shadow-sm mt-4">
          {dataForm?.map((data, index) => (
            <>
              <div
                key={index}
                className="p-3 text-xl text-slate-950/90 font-semibold"
              >
                {data?.name}
              </div>
              <div className="w-full flex flex-wrap bg-white">
                {data?.products.map((product, index) => {
                  return (
                    <div className="w-1/5 p-1" key={index}>
                      <Link
                        to={`/products/${
                          product?.slug ? product.slug : product.id
                        }`}
                      >
                        <div className="w-full rounded-lg border hover:border hover:border-rose-500 p-4 bg-white cursor-pointer relative">
                          {product?.type[0]?.discount > 0 ? (
                            <div className="absolute top-0 left-1 w-8 h-8 bg-red-600 rounded-b-full flex justify-center items-center text-xs text-white">
                              {product?.type[0]?.discount}%
                            </div>
                          ) : null}

                          <div
                            className="w-full aspect-square rounded-md"
                            style={{
                              backgroundImage: `url('${process.env.REACT_APP_DOMAIN_API}${process.env.REACT_APP_URL_PRODUCT}${product?.image[0]}')`,
                            }}
                          ></div>
                          <div className="w-full truncate text-xs py-2">
                            {product?.name}
                          </div>
                          <div className="w-full py-1 flex justify-between items-center">
                            <div className="text-rose-600 text-xs">
                              {handleCalcSale(
                                product?.type[0]?.price,
                                product?.type[0]?.discount
                              )}{" "}
                              {product?.type[0]?.discount ? (
                                <span className="smaill text-slate-950/70 line-through">
                                  {formatPrice(product?.type[0]?.price)}
                                </span>
                              ) : (
                                ""
                              )}
                            </div>
                            <div className="text-slate-950/70 text-xs">
                              Đã bán{" "}
                              {product?.type.reduce(
                                (acc, current) => current.solds + acc,
                                0
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* render san pham */}
              <div className="flex mt-2 w-full justify-center">
                <Link to={`search/${data?.slug}`}>
                  <button className="text-rose-500 border shadow-lg border-red-500 py-1 hover:border-red-700 hover:opacity-70 cursor-pointer rounded-md px-2">
                    Xem tất cả sản phẩm {data?.name}
                  </button>
                </Link>
              </div>
            </>
          ))}
        </div>
      </Loading>
    </div>
  );
}

export default HomePage;
