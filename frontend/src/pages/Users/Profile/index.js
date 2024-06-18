import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../../components/Button";

function ProfilePage() {
  return (
    <div className=" w-full h-screen">
      <div className="w-full h-2/5 relative rounded-b-xl shadow-md bg-gradient-to-br from-sky-500 to-rose-400 mb-28 flex justify-center items-center">
        <div className=" text-4xl font-black text-white font-sans">
          <i>What is this?</i>
        </div>
        <Button
          text={"Thêm ảnh bìa"}
          className={" absolute bottom-4 right-8 bg-white shadow-md"}
        >
          <FontAwesomeIcon icon="fa-solid fa-camera" className=" mr-2" />
        </Button>
        <div className=" w-auto h-48 absolute top-3/4 left-24 flex items-end">
          {/* http://localhost:8080/accounts/profile/avatar.jpg */}
          <div
            className=" w-48 h-48 rounded-full shadow-sm shadow-sky-500 bg-white"
            style={{
              backgroundImage: `url('${process.env.REACT_APP_DOMAIN_API}${process.env.REACT_APP_URL_AVATAR}avatar.jpg')`,
            }}
          ></div>
          <div className=" mb-4 mr-2">
            <h1 className=" text-3xl font-bold">Thành Lê</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
