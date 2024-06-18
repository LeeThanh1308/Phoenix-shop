function FooterPage() {
  return (
    <>
      <div className="w-full py-4 flex max-sm:justify-center text-white text-xs text-justify">
        <div className="sm:w-1/2 w-1/4 mr-8">
          <div
            className="h-12 w-40 mb-3"
            style={{
              backgroundImage: `url('${process.env.REACT_APP_DOMAIN_API}${process.env.REACT_APP_URL_AVATAR}logo.png')`,
            }}
          ></div>
          <div className="mb-2">
            Công Ty Cổ Phần Dịch Vụ Thương Mại Tổng Hợp WinCommerce
          </div>
          <div>
            Mã số doanh nghiệp: 0104918404 Đăng ký lần đầu ngày 20 tháng 09 năm
            2010, đăng ký thay đổi lần thứ 44, ngày 15 tháng 09 năm 2021
          </div>
        </div>
        <div className="sm:w-1/2 w-1/4 mr-8">
          <div className="mb-3 text-white/70">Về chúng tôi</div>
          <div className="mb-2 hover:text-red-500 cursor-pointer">
            Giới thiệu về VinMart
          </div>
          <div className="mb-2 hover:text-red-500 cursor-pointer">
            Danh sách cửa hàng
          </div>
          <div className="mb-2 hover:text-red-500 cursor-pointer">
            Quản lý chất lượng
          </div>
          <div className="mb-2 hover:text-red-500 cursor-pointer">
            Chính sách bảo mật
          </div>
          <div className="mb-2 hover:text-red-500 cursor-pointer">
            Điều khoản và điều kiện giao dịch
          </div>
        </div>
        <div className="sm:w-1/2 w-1/4 mr-8">
          <div className="mb-3 text-white/70">Hỗ trợ khách hàng</div>
          <div className="mb-2 hover:text-red-500 cursor-pointer">
            Trung tâm hỗ trợ khách hàng
          </div>
          <div className="mb-2 hover:text-red-500 cursor-pointer">
            Chính sách giao hàng
          </div>
          <div className="mb-2 hover:text-red-500 cursor-pointer">
            Chính sách thanh toán
          </div>
          <div className="mb-2 hover:text-red-500 cursor-pointer">
            Chính sách đổi trả
          </div>
        </div>
        <div className="sm:w-1/2 w-1/4 mr-8">
          <div className="mb-3 text-white/70">
            Tôi clone dự án này nhằm mục đích học tập mọi chi tết xin liên hệ
          </div>
          <div className="mb-2 hover:text-red-500 cursor-pointer">
            Phone: <a href="tel:0865505165">0865505165</a>
          </div>
          <div className="mb-2 hover:text-red-500 cursor-pointer">
            Email: <a href="mailto:le1308308@gmail.com">le1308308@gmail.com</a>
          </div>
        </div>
      </div>
    </>
  );
}

export default FooterPage;
