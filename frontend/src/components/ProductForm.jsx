import React, { useEffect } from "react";
import { Form, Input, InputNumber, Button } from "antd";

const ProductForm = ({ onFinish, editingProduct }) => {
  const [form] = Form.useForm();

  // Populate form when editing
  useEffect(() => {
    if (editingProduct) {
      form.setFieldsValue(editingProduct);
    } else {
      form.resetFields();
      form.setFieldsValue({ quantity: 1 });
    }
  }, [editingProduct, form]);

  return (
    <Form
      layout="vertical"
      form={form}
      initialValues={{ quantity: 1 }}
      onFinish={(values) => onFinish(values, form)}
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
         <Input placeholder="Enter product prize" />
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Quantity"
        name="quantity"
        rules={[{ required: true, message: "Please enter product quantity" }]}
      >
         <Input placeholder="Enter product quantity" />
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

export default ProductForm;
