import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Index = ({ products, orders, customers }) => {
  // รวมข้อมูลสินค้า, การสั่งซื้อ, รายละเอียดการสั่งซื้อ, และลูกค้า
  const combinedData = products.map((product) => {
    const productOrders = orders.filter((order) =>
      order.order_details.some((detail) => detail.product_id === product.id)
    );

    return productOrders.map((order) => {
      const customer = customers.find((customer) => customer.id === order.customer_id);

      return {
        ...product,
        order_id: order.order_id,
        customer_name: customer ? customer.name : 'Unknown',
        customer_email: customer ? customer.email : 'N/A',
        order_details: order.order_details.map(detail => {
          return `Product ID: ${detail.product_id} - Quantity: ${detail.quantity} - Price: ${detail.price}`;
        }).join(', '),
        total_amount: order.order_details.reduce((total, detail) => total + (detail.price * detail.quantity), 0).toFixed(2)
      };
    });
  }).flat(); // flattening the array because we have nested arrays from the orders

  // สร้างข้อมูลสำหรับกราฟ (ใช้ราคาของสินค้าและสต๊อก)
  const chartData = combinedData.map((item) => ({
    name: item.name,
    price: parseFloat(item.price),
    stock: item.stock,  // เพิ่มข้อมูลสต๊อก
  }));

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Product Price and Stock Chart</h1>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {/* เส้นสำหรับราคา */}
          <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
          {/* เส้นสำหรับสต๊อก */}
          <Line type="monotone" dataKey="stock" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>

      {/* ตารางข้อมูลรวมสินค้า การสั่งซื้อ และลูกค้า */}
      <div className="overflow-x-auto bg-white shadow-xl rounded-lg p-6 mb-6">
        <table className="min-w-full table-auto text-sm">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-4 py-3 text-left border-b">Product Name</th>
              <th className="px-4 py-3 text-left border-b">Price</th>
              <th className="px-4 py-3 text-left border-b">Stock</th>
              <th className="px-4 py-3 text-left border-b">Order ID</th>
              <th className="px-4 py-3 text-left border-b">Order Details</th>
            </tr>
          </thead>
          <tbody>
            {combinedData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-4 py-3 border-b">{row.name}</td>
                <td className="px-4 py-3 border-b">{row.price}</td>
                <td className="px-4 py-3 border-b">{row.stock}</td>
                <td className="px-4 py-3 border-b">{row.order_id}</td>
                <td className="px-4 py-3 border-b">{row.order_details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Index;
