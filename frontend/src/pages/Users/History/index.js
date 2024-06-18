import { useEffect, useState, useRef, useContext } from "react";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { Button, Input, Space, Table } from "antd";
import moment from "moment";
import AuthRequest from "../../../utils/axios/AuthRequest";
import Loading from "../../../components/Loading";
import { CartContext } from "../../../hooks/useContext/CartContext";

function HistoryPage() {
  const { reRender } = useContext(CartContext);
  const [dataHistory, setDataHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            className="text-black"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  function formatPrice(price) {
    return Number(price).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }

  useEffect(() => {
    AuthRequest.get("solds")
      .then((response) => response.data)
      .then((data) => {
        setDataHistory(data);
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
  }, [reRender]);
  const columns = [
    {
      title: "Mã giao dịch",
      dataIndex: "id",
      key: "id",
      ...getColumnSearchProps("id"),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Loại sản phẩm",
      dataIndex: "type",
      key: "type",
      ...getColumnSearchProps("type"),
      sorter: (a, b) => a?.type - b?.type,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Số lượng",
      key: "quantity",
      dataIndex: "quantity",
      ...getColumnSearchProps("quantity"),
      sorter: (a, b) => a?.quantity - b?.quantity,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Giá",
      key: "price",
      dataIndex: "price",
      ...getColumnSearchProps("price"),
      sorter: (a, b) => a?.price - b?.price,
      sortDirections: ["descend", "ascend"],
      render: (text) => <p>{formatPrice(text)}</p>,
    },

    {
      title: "Địa chỉ",
      key: "address",
      dataIndex: "address",
      ...getColumnSearchProps("address"),
    },
    {
      title: "Ngày giao dịch",
      key: "createdAt",
      dataIndex: "createdAt",
      ...getColumnSearchProps("createdAt"),
      sorter: (a, b) => (moment(a.createdAt).isBefore(b.createdAt) ? -1 : 1),
      sortDirections: ["descend", "ascend"],
      render: (record) => {
        return moment(record?.createdAt).format("DD/MM/YYYY HH:mm:ss");
      },
    },
  ];
  return (
    <div className="w-full h-full px-2">
      <Loading status={isLoading}>
        <div className="w-full h-full shadow-sm shadow-black/60  rounded-md p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold my-3">Lịch sử mua hàng</h1>
            </div>
            <div>
              <h1 className="text-xl font-bold my-3 text-green-500">
                Tổng số tiền bạn đã mua:{" "}
                <i className="font-bold text-rose-500 text-2xl">
                  {formatPrice(
                    dataHistory.reduce((acc, current) => current.price + acc, 0)
                  )}
                </i>
              </h1>
            </div>
          </div>
          <Table columns={columns} dataSource={dataHistory} />
        </div>
      </Loading>
    </div>
  );
}

export default HistoryPage;
