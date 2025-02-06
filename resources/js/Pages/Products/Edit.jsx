import React from 'react';
import { useForm } from '@inertiajs/inertia-react';

const Edit = ({ product, orders, customers }) => {
  const { data, setData, put, errors } = useForm({
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    order_id: '',
    customer_name: '',
    order_details: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    put(`/products/${product.id}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">✏️ แก้ไขสินค้า</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ชื่อสินค้า */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">ชื่อสินค้า</label>
            <input
              type="text"
              id="name"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
          </div>

          {/* ราคา */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="price">ราคา</label>
            <input
              type="text"
              id="price"
              value={data.price}
              onChange={(e) => setData('price', e.target.value)}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            {errors.price && <div className="text-red-500 text-sm mt-1">{errors.price}</div>}
          </div>

          {/* สต็อก */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="stock">สต็อก</label>
            <input
              type="text"
              id="stock"
              value={data.stock}
              onChange={(e) => setData('stock', e.target.value)}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            {errors.stock && <div className="text-red-500 text-sm mt-1">{errors.stock}</div>}
          </div>

          {/* Order ID */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="order_id">🛒 Order ID</label>
            <input
              type="text"
              id="order_id"
              value={data.order_id}
              onChange={(e) => setData('order_id', e.target.value)}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            {errors.order_id && <div className="text-red-500 text-sm mt-1">{errors.order_id}</div>}
          </div>

          {/* ชื่อลูกค้า */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="customer_name">👤 ชื่อลูกค้า</label>
            <input
              type="text"
              id="customer_name"
              value={data.customer_name}
              onChange={(e) => setData('customer_name', e.target.value)}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            {errors.customer_name && <div className="text-red-500 text-sm mt-1">{errors.customer_name}</div>}
          </div>

          {/* รายละเอียดคำสั่งซื้อ */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="order_details">📃 รายละเอียดคำสั่งซื้อ</label>
            <textarea
              id="order_details"
              value={data.order_details}
              onChange={(e) => setData('order_details', e.target.value)}
              className="w-full p-3 border rounded h-24 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            {errors.order_details && <div className="text-red-500 text-sm mt-1">{errors.order_details}</div>}
          </div>

          {/* ปุ่มอัปเดต */}
          <div className="text-center">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
            >
              ✅ อัปเดตสินค้า
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Edit;
