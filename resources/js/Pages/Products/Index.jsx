import React from 'react';
import { Link, usePage } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';

const Index = ({ products, orders, customers }) => {
  // Combine product, order, and customer data
  const combinedData = products.map((product) => {
    const productOrders = orders.filter((order) =>
      order.order_details.some((detail) => detail.product_id === product.id)
    );

    return productOrders.map((order) => {
      const customer = customers.find((customer) => customer.id === order.customer_id);

      return {
        ...product,
        order_id: order.id,
        customer_name: customer ? customer.name : 'Unknown',
        customer_email: customer ? customer.email : 'N/A',
        order_details: order.order_details.map(detail => {
          return `Product ID: ${detail.product_id} - Quantity: ${detail.quantity} - Price: ${detail.price}`;
        }).join(', '),
        total_amount: order.order_details.reduce((total, detail) => total + (detail.price * detail.quantity), 0).toFixed(2)
      };
    });
  }).flat(); // flattening the array because we have nested arrays from the orders

  const handleDelete = (productCode) => {
    if (confirm('ลบจริงอ่ะ?')) {
      Inertia.delete(`/products/${productCode}`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Product Price and Stock Chart</h1>
      {/* Combined product, order, and customer data table */}
      <div className="overflow-x-auto bg-white shadow-xl rounded-lg p-6 mb-6">
        <table className="min-w-full table-auto text-sm">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-4 py-3 text-left border-b">Product Name</th>
              <th className="px-4 py-3 text-left border-b">Price</th>
              <th className="px-4 py-3 text-left border-b">Stock</th>
              <th className="px-4 py-3 text-left border-b">Order ID</th>
              <th className="px-4 py-3 text-left border-b">Order Details</th>
              <th className="px-4 py-3 text-left border-b">Actions</th>
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
                <td className="px-4 py-3 border-b">
                  <Link
                    href={`/products/${row.id}/edit`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(row.id)}
                    className="text-red-500 hover:text-red-700 ml-4"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Index;
