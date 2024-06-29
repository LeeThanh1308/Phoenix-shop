# Mô tả dự án - Demo:[Phoenix Shop](https://www.phoenix.id.vn/)

## Công nghệ sử dụng

**Frontend:** ReactJS, TailwindCSS, Ant Design ...

**Backend:** NestJS

## Entity Relationship Diagram
![Annotation 2024-06-29 232632](https://github.com/LeeThanh1308/Phoenix-shop/assets/114464615/33f13b8e-6dd3-46c0-abcb-ab811b6fe358)

## Các chức năng:

    ### Phân cấp phân quyền tài khoản
        - Admin - CEO
        - Manage - Quản lý
        - Staff - Nhân viên
        - Guest - Khách hàng

    ### Người dùng

        - Đăng nhập (Trên 1 thiết bị)
        - Đăng ký ( Xác minh tài qua email cho phép nhập xác minh 3 lần sau đó phải gửi lại mã xác minh mới )
        - Đăng xuất
        - Quên mật khẩu ( Xác minh tài qua email cho phép nhập xác minh 3 lần sau đó phải gửi lại mã xác minh mới )
        - Đổi mật khẩu
        - Sửa thông tin tài khoản
        - Chữ ký xác thực JWT cơ chế bảo mật Refresh Token
        - Xem sản phẩm
        - Tìm kiếm sản phẩm
        - Giỏ hàng (Thêm, sửa, xóa, tính bill)
        - Thanh toán
        - Xem lịch sử mua hàng

    ### Quản trị viên

        - Quản trị users(Thêm, sửa, xóa, khóa tk, tìm kiếm )
        - Quản trị sản phẩm (Thêm, sửa, xóa, tìm kiếm)
        - Quản trị slider (Thêm, sửa , xóa)
        - Quản trị danh mục (Thêm, sửa , xóa)
        - Quản trị chuỗi cửa hàng (Đang phát triển)
            - Quản lý cửa hàng (Thêm, sửa, xóa)
            - Quản lý nhân viên (Thêm , sửa , xóa)

## Tài khoản admin:

    - Email: le1308308@gmail.com
    - Pass: 000000
