import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../../../components/Button";
import HttpRequest from "../../../utils/axios/HttpRequest";
import Loading from "../../../components/Loading";

function SearchPage() {
  // const [activeMenu, setActiveMenu] = useState(1);
  const { queryID } = useParams();
  const [dataForm, setDataForm] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState({
    price: 0,
    sale: 0,
    createdAt: 0,
    sold: 0,
  });
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
    window.scrollTo(0, 0);
    setIsLoading(true);
    HttpRequest.get(`products/search/${queryID}`, {
      params: options,
    })
      .then((response) => response.data)
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setDataForm(data);
        } else {
          setDataForm([]);
        }
      })
      .catch((err) => {})
      .finally(() => {
        setIsLoading(false);
      });
  }, [queryID, options]);

  function formatPrice(price) {
    return Number(price).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }
  const handleCalcSale = (current, sale) => {
    const result = current - (current / 100) * sale;
    return formatPrice(result);
  };

  return (
    <div className="">
      <div className="w-full h-12 bg-white flex px-3 py-7">
        {!dataForm[0] ? (
          ""
        ) : (
          <div className="flex items-center">
            <div className="mr-2 text-black/60">Sắp xếp theo</div>
            <div>
              <Button
                className={`mx-2 px-5 ${
                  options.createdAt
                    ? "bg-sky-500 text-white font-bold hover:bg-sky-500"
                    : ""
                }`}
                text="Mới nhất"
                onClick={() =>
                  setOptions((prev) => ({
                    ...prev,
                    createdAt: prev.createdAt ? 0 : 1,
                  }))
                }
              />
            </div>
            {/* <div>
            <Button
              className={`mx-2 px-5 ${
                options.sold
                  ? "bg-sky-500 text-white font-bold hover:bg-sky-500"
                  : ""
              }`}
              text="Bán chạy"
              onClick={() =>
                setOptions((prev) => ({
                  ...prev,
                  sold: prev.sold ? 0 : 1,
                }))
              }
            />
          </div> */}
            {/* <div className="w-12">
            <select
              className="py-2 border bg-transparent px-2"
              onChange={(e) => {
                const sort = e.target.value;
                setOptions((prev) => ({
                  ...prev,
                  price: sort === "up" ? true : false,
                }));
              }}
            >
              <option value="down" key="">
                Giá: Thấp đến cao
              </option>
              <option value="up" key="">
                Giá: Cao đến thấp
              </option>
            </select>
          </div> */}
          </div>
        )}
      </div>

      <Loading status={isLoading}>
        <div className="bg-slate-50 pb-5 mb-2 rounded-b-2xl shadow-sm">
          {/* Sản Phẩm */}
          <div className="w-full flex flex-wrap bg-white">
            {dataForm?.map((data) => (
              <div className="w-1/5 p-1">
                <Link to={`/products/${data.slug}`}>
                  <div className="w-full rounded-lg border hover:border hover:border-rose-500 p-4 bg-white cursor-pointer relative">
                    {data?.type[0]?.discount > 0 ? (
                      <div className="absolute top-0 left-1 font-bold w-8 h-8 bg-red-600 rounded-b-full flex justify-center items-center text-xs text-white">
                        {data?.type[0]?.discount}%
                      </div>
                    ) : null}
                    <div
                      className="w-full rounded-md aspect-square"
                      style={{
                        backgroundImage: `url('${process.env.REACT_APP_DOMAIN_API}${process.env.REACT_APP_URL_PRODUCT}${data?.image[0]}')`,
                      }}
                    ></div>
                    <div className="w-full truncate text-xs py-2">
                      {data.name}
                    </div>
                    <div className="w-full py-1 flex justify-between items-center">
                      <div className="text-rose-600 text-xs">
                        {handleCalcSale(
                          data?.type[0]?.price,
                          data?.type[0].discount
                        )}
                        {data.type[0].discount > 0 ? (
                          <span className="smaill text-slate-950/70 line-through ml-1">
                            {data?.type[0]?.price}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="text-slate-950/70 text-xs">
                        Đã bán{" "}
                        {data.type.reduce(
                          (acc, current) => current.solds + acc,
                          0
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
            {!dataForm[0] ? (
              <div className="w-full h-96 flex justify-center items-center">
                Không có kết quả
              </div>
            ) : null}
          </div>
          {/* render san pham */}
        </div>
      </Loading>
    </div>
  );
}

export default SearchPage;
