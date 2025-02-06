import React from 'react';
import { Link, usePage } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';

const Index = ({ products, orders, customers }) => {
  // รวมข้อมูลสินค้ากับคำสั่งซื้อและลูกค้า
  const combinedData = products.map((product) => {
    const productOrders = orders.filter((order) =>
      order.order_details.some((detail) => detail.product_id === product.id)
    );

    const orderDetails = productOrders.map((order) => {
      const customer = customers.find((customer) => customer.id === order.customer_id);
      return {
        order_id: order.id,
        customer_name: customer ? customer.name : 'Unknown',
        order_info: order.order_details
          .filter((detail) => detail.product_id === product.id)
          .map(detail => `Qty: ${detail.quantity}, Price: ${detail.price}`)
          .join(' | '),
        total_amount: order.order_details.reduce((total, detail) => total + (detail.price * detail.quantity), 0).toFixed(2)
      };
    });

    return {
      ...product,
      orders: orderDetails,
    };
  });

  const handleDelete = (productId) => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?')) {
      Inertia.delete(`/products/${productId}`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        รายการสินค้าและคำสั่งซื้อ
      </h1>

      <div className="overflow-x-auto bg-white shadow-xl rounded-lg p-6 mb-6">
        <table className="min-w-full table-auto text-sm border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-4 py-3 text-left border-b">ชื่อสินค้า</th>
              <th className="px-4 py-3 text-left border-b">ราคา</th>
              <th className="px-4 py-3 text-left border-b">สต็อก</th>
              <th className="px-4 py-3 text-left border-b">Order ID</th>
              <th className="px-4 py-3 text-left border-b">ชื่อลูกค้า</th>
              <th className="px-4 py-3 text-left border-b">รายละเอียดคำสั่งซื้อ</th>
              <th className="px-4 py-3 text-left border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {combinedData.map((row, index) => (
              row.orders.map((order, orderIndex) => (
                <tr key={`${index}-${orderIndex}`} className="hover:bg-gray-50 transition-colors duration-200 border-b">
                  <td className="px-4 py-3">{row.name}</td>
                  <td className="px-4 py-3">{row.price}</td>
                  <td className="px-4 py-3">{row.stock}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/orders/${order.order_id}`}
                      className="text-blue-500 hover:underline"
                    >
                      #{order.order_id}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{order.customer_name}</td>
                  <td className="px-4 py-3">{order.order_info}</td>
                  <td className="px-4 py-3 flex gap-3">
                    <Link
                      href={`/products/${row.id}/edit`}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    >
                      แก้ไข
                    </Link>
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Index;
