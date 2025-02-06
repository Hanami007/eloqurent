import React, { useState } from "react";
import { Link } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";

const Index = ({ products }) => {
    console.log("Products:", products);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // หาจำนวนหน้าทั้งหมด
    const totalPages = Math.ceil(products.length / itemsPerPage);

    // ตัดข้อมูลให้เหลือแค่ 10 รายการตามหน้าปัจจุบัน
    const paginatedProducts = products.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleDelete = (productId) => {
        if (confirm("Are you sure you want to delete this product?")) {
            Inertia.delete(`/products/${productId}`);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
                📊 รายการสินค้า
            </h1>

            <div className="overflow-x-auto bg-white shadow-xl rounded-lg p-6 mt-4">
                <table className="w-full table-auto border border-gray-300">
                    <thead>
                        <tr className="bg-gray-900 text-white">
                            <th className="p-4 text-left border-b">📦 ชื่อสินค้า</th>
                            <th className="p-4 text-left border-b">💰 ราคา</th>
                            <th className="p-4 text-left border-b">📊 สต็อก</th>
                            <th className="p-4 text-left border-b">📅 วันที่สั่ง</th>
                            <th className="p-4 text-left border-b">⚙️ จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedProducts.length > 0 ? (
                            paginatedProducts.map((product) => (
                                <tr key={product.id}>
                                    <td className="p-4 border-b">{product.name}</td>
                                    <td className="p-4 border-b">฿{product.price}</td>
                                    <td className="p-4 border-b">{product.stock}</td>
                                    <td className="p-4 border-b">{product.date}</td>
                                    <td className="p-4 border-b">
                                        <Link
                                            href={`/products/${product.id}/edit`}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            ✏️ แก้ไข
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="text-red-500 hover:text-red-700 ml-4"
                                        >
                                            🗑️ ลบ
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center text-gray-500 p-4">
                                    ไม่มีข้อมูลสินค้า
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 mx-2 ${
                            currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"
                        } rounded`}
                    >
                        ◀️ ก่อนหน้า
                    </button>
                    <span className="px-4 py-2 text-gray-700">
                        หน้า {currentPage} จาก {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 mx-2 ${
                            currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 text-white"
                        } rounded`}
                    >
                        ถัดไป ▶️
                    </button>
                </div>
            )}
        </div>
    );
};

export default Index;
