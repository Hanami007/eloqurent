import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/inertia-react';

export default function Create({ flash }) {
  const { data, setData, post, processing, errors } = useForm({
    name: "",
    description: "",
    price: "",
    stock: "",
    order_id: "",
    customer_name: "",
    order_details: "",
  });

  const [successMessage, setSuccessMessage] = useState(flash.success);
  const [flashMessage, setFlashMessage] = useState({
    success: "",
    error: "",
  });

  useEffect(() => {
    if (flash.error) {
      setFlashMessage({ success: "", error: flash.error });
      const timer = setTimeout(() => {
        setFlashMessage({ success: "", error: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [flash]);

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        setSuccessMessage(null);
        window.location.href = route("products.index");
      }, 3000);
    }
  }, [successMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("products.store"));
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">
        🆕 เพิ่มสินค้า / คำสั่งซื้อ
      </h2>

      {successMessage && (
        <div className="bg-green-500 text-white text-center py-2 mb-4 rounded">
          {successMessage}
        </div>
      )}

      {flashMessage.error && (
        <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
          {flashMessage.error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ชื่อสินค้า */}
        <div>
          <label className="block text-gray-700 font-medium">
            📦 ชื่อสินค้า
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => setData("name", e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name}</span>
          )}
        </div>

        {/* ราคา */}
        <div>
          <label className="block text-gray-700 font-medium">
            💰 ราคา
          </label>
          <input
            type="text"
            value={data.price}
            onChange={(e) => setData("price", e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.price && (
            <span className="text-red-500 text-sm">{errors.price}</span>
          )}
        </div>

        {/* สต็อก */}
        <div>
          <label className="block text-gray-700 font-medium">
            📊 สต็อก
          </label>
          <input
            type="text"
            value={data.stock}
            onChange={(e) => setData("stock", e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.stock && (
            <span className="text-red-500 text-sm">{errors.stock}</span>
          )}
        </div>

        {/* Order ID */}
        <div>
          <label className="block text-gray-700 font-medium">
            🛒 Order ID
          </label>
          <input
            type="text"
            value={data.order_id}
            onChange={(e) => setData("order_id", e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.order_id && (
            <span className="text-red-500 text-sm">{errors.order_id}</span>
          )}
        </div>

        {/* ชื่อลูกค้า */}
        <div>
          <label className="block text-gray-700 font-medium">
            👤 ชื่อลูกค้า
          </label>
          <input
            type="text"
            value={data.customer_name}
            onChange={(e) => setData("customer_name", e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.customer_name && (
            <span className="text-red-500 text-sm">{errors.customer_name}</span>
          )}
        </div>

        {/* รายละเอียดคำสั่งซื้อ */}
        <div>
          <label className="block text-gray-700 font-medium">
            📃 รายละเอียดคำสั่งซื้อ
          </label>
          <textarea
            value={data.order_details}
            onChange={(e) => setData("order_details", e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.order_details && (
            <span className="text-red-500 text-sm">{errors.order_details}</span>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          disabled={processing}
        >
          {processing ? "กำลังบันทึก..." : "บันทึก"}
        </button>
      </form>
    </div>
  );
}
