import React, { useEffect, useState } from "react";
import { Card, message, Typography, Button } from "antd";
import ProductForm from "../components/ProductForm";
import ProductTable from "../components/ProductTable";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";   // ✅ FIXED import
import "./BillingPage.css";

const { Title } = Typography;

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
      await fetch(`http://localhost:5000/api/products/${id}`, { method: "DELETE" });
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
    doc.text("sonu di hatti", 14, 20);
    doc.setFontSize(12);
    doc.text("2 no street , malik muhalla,south africa", 14, 28);
    doc.text("Phone: +92 300 1234567", 14, 36);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 44);

    // Generate table using autoTable (✅ FIXED usage)
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
