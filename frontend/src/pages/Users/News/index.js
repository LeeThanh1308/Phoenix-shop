import Button from "../../../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function NewsPage() {
  // const [like, setLike] = useState(false);
  return (
    <div className="w-full h-full">
      <div className="w-full h-12 bg-white flex justify-between px-3 py-7">
        <div className="flex items-center">
          <div className="mr-2 text-black/60">Sắp xếp theo</div>
          <div>
            <Button
              className="mx-2 px-5 bg-rose-500 text-white"
              text="Mới nhất"
            />
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-full h-10 flex justify-between items-center relative">
            <input
              type="text"
              placeholder="Từ khoá mà bạn muốn tìm...."
              className="w-full h-full text-slate-950 rounded-sm pl-4 pr-11 outline-none border border-rose-500 "
              autoFocus
            />
            <div className="absolute right-0 cursor-pointer">
              <FontAwesomeIcon
                icon="fa-solid fa-magnifying-glass"
                className=" text-slate-950 text-base py-2 px-3 hover:bg-neutral-800 hover:text-slate-50"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2">
        <div className="w-full rounded-lg mx-auto bg-white px-3 py-4">
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 rounded-full mr-3">
              {/* <img src={} className="w-full h-full rounded-full" alt="" /> */}
            </div>
            <div className="">
              <div className=" font-bold text-sm">
                Cao Thủ{" "}
                <FontAwesomeIcon
                  icon="fa-solid fa-circle-check"
                  className=" text-xs ml-0.5 text-sky-500"
                />
              </div>
              <div className="text-sm text-gray-500">CN-8-10-2023 21:30</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewsPage;
