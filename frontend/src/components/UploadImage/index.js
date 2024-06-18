import { Button, Upload, message } from "antd";
import ImgCrop from "antd-img-crop";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState, memo } from "react";
import Toastify from "../Toast";

function UpdloadImage({
  aspect = 16 / 9,
  quanlity = 1,
  listType = "picture",
  getData = () => {},
  defaultData = [],
  onDelete = () => {},
  typeImage = ["image/jpeg", "image/png"],
  maxSize = 2,
  restImage = () => {},
  placeholder = "Upload picture",
}) {
  const [fileList, setFileList] = useState(
    defaultData.map((it, ix) => ({
      uid: ix,
      name: it,
      status: "done",
      url: `${process.env.REACT_APP_DOMAIN_API}${it}`,
    }))
  );

  useEffect(() => {
    if (Array.isArray(fileList) && fileList.length > 0) {
      const result = fileList.filter((it) => it.originFileObj);
      getData(
        result.map((it) => it.originFileObj),
        fileList
      );
    }
  }, [fileList]);

  const onChange = ({ fileList: newFileList }) => {
    // console.log({ fileList, newFileList });
    if (fileList.length > newFileList.length) {
      // console.log(fileList, newFileList);
      const result = window.confirm("Bạn chắc chắn muốn xóa ảnh này");
      if (result) {
        setFileList(newFileList);
        restImage(newFileList.map((it) => it.name));
        const dataRemoved = fileList.filter((it) =>
          it.status === "removed" ? it.name : null
        );
        onDelete(dataRemoved[0]?.name);
      }
    } else if (fileList.length < newFileList.length) {
      const file = newFileList[fileList.length];
      const isJpgOrPng = typeImage.includes(file?.type);
      // console.log(isJpgOrPng);
      if (!isJpgOrPng) {
        message.error(`You can only upload ${typeImage.join(", ")} file!`);
      }
      const isLt1M = file.size / 1024 / 1024 < maxSize;
      // console.log(isLt1M);
      if (!isLt1M) {
        message.error(`Image must smaller than ${maxSize}MB!`);
      }
      if (isJpgOrPng && isLt1M) {
        setFileList(newFileList);
      }
    } else {
      setFileList(newFileList);
    }
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };
  return (
    <ImgCrop aspect={aspect} quality={quanlity}>
      <Upload
        listType={listType}
        className="avatar-uploader"
        fileList={fileList}
        onChange={(data) => {
          onChange(data);
        }}
        onPreview={onPreview}
      >
        <p>
          {fileList.length < quanlity ? (
            ["picture"].includes(listType) ? (
              <Button icon={<UploadOutlined />}>{placeholder}</Button>
            ) : (
              placeholder
            )
          ) : (
            ""
          )}
        </p>
      </Upload>
    </ImgCrop>
  );
}

export default memo(UpdloadImage);
