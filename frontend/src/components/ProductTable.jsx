import React from "react";
import { Table, Button, Space } from "antd";

const ProductTable = ({ products, onEdit, onDelete }) => {
  const columns = [
    {
      title: "#",
      render: (_, record, index) => index + 1,
      width: 50,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `Rs. ${price}`,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Total",
      key: "total",
      render: (_, record) => `Rs. ${record.price * record.quantity}`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => onEdit(record)}>
            Edit
          </Button>
          <Button danger type="link" onClick={() => onDelete(record._id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="_id"
      dataSource={products}
      columns={columns}
      pagination={false}
      bordered
      size="middle"
    />
  );
};

export default ProductTable;
