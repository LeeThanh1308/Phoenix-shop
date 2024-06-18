import { Button } from "antd";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="w-full h-full flex justify-center items-center text-center bg-white">
      <section class="">
        <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div class="mx-auto max-w-screen-sm text-center">
            <h1 class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
              404
            </h1>
            <p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
              Something's missing.
            </p>
            <p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
              Xin lỗi, chúng tôi không thể tìm thấy trang đó. Bạn sẽ tìm thấy
              rất nhiều điều để khám phá trên trang chủ.{" "}
            </p>
            <div className=" flex justify-center">
              <Link to={"/"} className=" mx-1">
                <Button>Go to Home</Button>
              </Link>
              <Link to={-1} className="mx-1">
                <Button>Quay lại trang trước đó.</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default NotFound;
