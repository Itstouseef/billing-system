import React, { useEffect, useState } from "react";
import { Card, message, Typography, Button, Form, Input, InputNumber, Table, Popconfirm } from "antd";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./BillingPage.css";

const { Title } = Typography;

// ---------------- Product Form ----------------
const ProductForm = ({ onFinish, editingProduct }) => {
  const [form] = Form.useForm();

  // Populate form when editing / reset when adding
  useEffect(() => {
    if (editingProduct) {
      form.setFieldsValue(editingProduct);
    } else {
      form.resetFields();
      form.setFieldsValue({ quantity: 1 }); // default value
    }
  }, [editingProduct, form]);

  const handleSubmit = (values) => {
    onFinish(values);
    form.resetFields(); // clear form after submit
    form.setFieldsValue({ quantity: 1 }); // reset default
  };

  return (
    <Form
      layout="vertical"
      form={form}
      initialValues={{ quantity: 1 }}
      onFinish={handleSubmit}
    >
      <Form.Item
        label="Product Name"
        name="name"
        rules={[{ required: true, message: "Please enter product name" }]}
      >
        <Input placeholder="Enter product name" />
      </Form.Item>

      <Form.Item
        label="Price"
        name="price"
        rules={[{ required: true, message: "Please enter product price" }]}
      >
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Quantity"
        name="quantity"
        rules={[{ required: true, message: "Please enter product quantity" }]}
      >
        <InputNumber min={1} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          {editingProduct ? "Update Product" : "Add Product"}
        </Button>
      </Form.Item>
    </Form>
  );
};

// ---------------- Product Table ----------------
const ProductTable = ({ products, onEdit, onDelete }) => {
  const columns = [
    {
      title: "Product Name",
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
        <>
          <Button type="link" onClick={() => onEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this product?"
            onConfirm={() => onDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return <Table dataSource={products} columns={columns} rowKey="_id" pagination={false} />;
};

// ---------------- Billing Page ----------------
const BillingPage = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch products!");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add / Edit product
  const handleFormSubmit = async (values) => {
    try {
      if (editingProduct) {
        await fetch(`http://localhost:5000/api/products/${editingProduct._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        message.success("Product updated successfully!");
        setEditingProduct(null);
      } else {
        await fetch("http://localhost:5000/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        message.success("Product added successfully!");
      }
      fetchProducts();
    } catch (error) {
      message.error("Something went wrong!");
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    try {
      await fetch(`http://pure-success-production.up.railway.app/api/products/${id}`, { method: "DELETE" });
      message.success("Product deleted!");
      fetchProducts();
    } catch (error) {
      message.error("Error deleting product!");
    }
  };

  const totalPrice = products.reduce(
    (acc, product) => acc + Number(product.price) * Number(product.quantity),
    0
  );

  // Download Invoice PDF
  const handleDownload = () => {
    if (!products || products.length === 0) {
      message.warning("No products to generate invoice!");
      return;
    }

    const doc = new jsPDF();

    // Shop Header
    doc.setFontSize(18);
    doc.text("Company Name", 14, 20);
    doc.setFontSize(12);
    doc.text("Rachna Town, Shahdara, Lahore", 14, 28);
    doc.text("Phone: +92 300 1234567", 14, 36);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 44);

    // Generate table using autoTable
    autoTable(doc, {
      startY: 50,
      head: [["#", "Product Name", "Price", "Qty", "Total"]],
      body: products.map((product, index) => [
        index + 1,
        product.name,
        `Rs. ${product.price}`,
        product.quantity,
        `Rs. ${product.price * product.quantity}`,
      ]),
      theme: "grid",
      headStyles: { fillColor: [46, 125, 50] },
    });

    const finalY = doc.lastAutoTable.finalY || 60;

    // Total Section
    doc.setFontSize(14);
    doc.text(`Grand Total: Rs. ${totalPrice}`, 14, finalY + 10);

    // Footer
    doc.setFontSize(11);
    doc.text("Thank you for shopping with us!", 14, finalY + 25);

    // Save PDF
    doc.save("invoice.pdf");
  };

  // Print invoice
  const handlePrint = () => window.print();

  return (
    <div className="billing-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Billing System</h2>
        <ul>
          <li>🏠 Dashboard</li>
          <li>🛒 Orders</li>
          <li>📦 Products</li>
          <li>📊 Reports</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="page-header">
          <h1>Invoice</h1>
          <div className="total-amount">Total: Rs. {totalPrice}</div>
        </div>

        <Card title="Add / Edit Product">
          <ProductForm onFinish={handleFormSubmit} editingProduct={editingProduct} />
        </Card>

        <Card
          title="Product List"
          style={{ marginTop: "20px" }}
          extra={<Title level={5}>Total: Rs. {totalPrice}</Title>}
        >
          <ProductTable
            products={products}
            onEdit={(product) => setEditingProduct(product)}
            onDelete={handleDelete}
          />
        </Card>

        <div className="bill-actions">
          <Button type="primary" onClick={handlePrint}>
            🖨 Print Bill
          </Button>
          <Button type="default" onClick={handleDownload}>
            ⬇ Download Invoice
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
