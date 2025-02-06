import React from "react";
import { Link } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";

const Index = ({ products, orders, customers }) => {
    console.log("Products:", products);
    console.log("Orders:", orders);
    console.log("Customers:", customers);

    // Combine product, order, and customer data
    const combinedData = orders
        .map((order) => {
            const customer =
                customers.find((c) => c.id === order.customer_id) || {}; // ค้นหาข้อมูลลูกค้า

            return order.order_details.map((detail) => {
                const product =
                    products.find((p) => p.id === detail.product_id) || {}; // ค้นหาข้อมูลสินค้า

                return {
                    order_id: order.order_id,
                    Pname: product.Pname || "ไม่พบสินค้า",
                    price: product.price || 0,
                    stock: product.stock || 0,
                    Cname: customer.Cname || "ไม่พบลูกค้า",
                    customer_email: customer.email || "N/A",
                    order_details: `สินค้า ID: ${detail.product_id} - จำนวน: ${detail.quantity} - ราคา: ${detail.price}`,
                    total_amount: (detail.price * detail.quantity).toFixed(2),
                    id: product.id, // ใช้สำหรับปุ่มแก้ไข/ลบ
                };
            });
        })
        .flat();

    const handleDelete = (productId) => {
        if (confirm("Are you sure you want to delete this product?")) {
            Inertia.delete(`/products/${productId}`);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
                📊 รายการสินค้า คำสั่งซื้อ และลูกค้า
            </h1>
            <div className="overflow-x-auto bg-white shadow-xl rounded-lg p-6">
                <table className="w-full table-auto border border-gray-300">
                    <thead>
                        <tr className="bg-gray-900 text-white">
                            <th className="p-4 text-left border-b">
                                📦 ชื่อสินค้า
                            </th>
                            <th className="p-4 text-left border-b">💰 ราคา</th>
                            <th className="p-4 text-left border-b">📊 สต็อก</th>
                            <th className="p-4 text-left border-b">
                                🛒 คำสั่งซื้อ
                            </th>
                            <th className="p-4 text-left border-b">
                                👤 ลูกค้า
                            </th>
                            <th className="p-4 text-left border-b">
                                📃 รายละเอียด
                            </th>
                            <th className="p-4 text-left border-b">
                                ⚙️ จัดการ
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {combinedData.length > 0 ? (
                            combinedData.map((row, index) => (
                                <tr
                                    key={index}
                                    className="even:bg-gray-100 odd:bg-white hover:bg-gray-200 transition"
                                >
                                    <td className="p-4 border-b">
                                        {row.Pname}
                                    </td>
                                    <td className="p-4 border-b">
                                        ฿{row.price}
                                    </td>
                                    <td className="p-4 border-b">
                                        {row.stock}
                                    </td>
                                    <td className="p-4 border-b">
                                        {row.order_id}
                                    </td>
                                    <td className="p-4 border-b font-semibold">
                                        {row.Cname || "ไม่พบลูกค้า"}
                                    </td>
                                    <td className="p-4 border-b">
                                        {row.order_details}
                                    </td>
                                    <td className="p-4 border-b">
                                        <Link
                                            href={`/products/${row.id}/edit`}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            ✏️ แก้ไข
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(row.id)}
                                            className="text-red-500 hover:text-red-700 ml-4"
                                        >
                                            🗑️ ลบ
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="text-center text-gray-500 p-4"
                                >
                                    ไม่มีข้อมูลสินค้า
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Index;
