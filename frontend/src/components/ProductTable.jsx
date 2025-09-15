import React from "react";
import { Table, Button, Space } from "antd";

const ProductTable = ({ products, onEdit, onDelete }) => {
  const columns = [
    {
      title: "#",
      render: (_, record, index) => index + 1,
      width: 50,
      responsive: ["xs", "sm", "md", "lg"], // ✅ Always visible
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      responsive: ["xs", "sm", "md", "lg"], // ✅ Always visible
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `Rs. ${price}`,
      responsive: ["sm", "md", "lg"], // ✅ Hidden on extra small
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      responsive: ["sm", "md", "lg"], // ✅ Hidden on extra small
    },
    {
      title: "Total",
      key: "total",
      render: (_, record) => `Rs. ${record.price * record.quantity}`,
      responsive: ["sm", "md", "lg"], // ✅ Hidden on extra small
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
      responsive: ["sm", "md", "lg"], // ✅ Hide on extra small
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
