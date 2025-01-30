import React, { useState, useEffect } from "react";
import { router, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Modal from "@/Components/Modal";
import FlashMessage from "@/Components/FlashMessage";

export default function Index({ employees, query, filterBy, flash }) {
    const [search, setSearch] = useState(query || "");
    const [searchBy, setSearchBy] = useState(filterBy || "first_name");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [flashMessage, setFlashMessage] = useState({ success: '', error: '' });

    useEffect(() => {
        if (flash.success) {
            setFlashMessage({ success: flash.success, error: '' });
            // ตั้งเวลา 3 วินาทีให้ flash message หายไป
            const timer = setTimeout(() => {
                setFlashMessage({ success: '', error: '' });
            }, 3000); // 3000ms = 3 วินาที
            // เคลียร์ timer เมื่อ component ถูก unmount หรือ flashMessage เปลี่ยนแปลง
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get("/employees", { search, filterBy: searchBy });
    };

    const handlePhotoClick = (photo) => {
        setSelectedPhoto(photo);
        setIsModalOpen(true);
    };

    return (
        <AuthenticatedLayout>
            <div className="max-w-4xl mx-auto p-4">
            <FlashMessage flash={flashMessage} />
                <h1 className="text-2xl font-bold text-center mb-6">
                    รายชื่อพนักงาน
                </h1>

                {/* Search */}
                <form
                    onSubmit={handleSearch}
                    className="flex flex-col md:flex-row items-center gap-4 mb-6"
                >
                    <select
                        value={searchBy}
                        onChange={(e) => setSearchBy(e.target.value)}
                        className="border border-gray-300 rounded-md p-2 w-full md:w-auto"
                    >
                        <option value="first_name">First Name</option>
                        <option value="last_name">Last Name</option>
                    </select>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border border-gray-300 rounded-md p-2 w-full md:w-auto"
                        placeholder="Search..."
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white rounded-md p-2 w-full md:w-auto"
                    >
                        Search
                    </button>
                </form>

                {/* Employee Table */}
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">
                                Emp No
                            </th>
                            <th className="border border-gray-300 px-4 py-2">
                                First Name
                            </th>
                            <th className="border border-gray-300 px-4 py-2">
                                Last Name
                            </th>
                            <th className="border border-gray-300 px-4 py-2">
                                Gender
                            </th>
                            <th className="border border-gray-300 px-4 py-2">
                                Birth Date
                            </th>
                            <th className="border border-gray-300 px-4 py-2">
                                Department
                            </th>
                            <th className="border border-gray-300 px-4 py-2">
                                Photo
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.data.length > 0 ? (
                            employees.data.map((employee, index) => (
                                <tr
                                    key={employee.emp_no}
                                    className={`${
                                        index % 2 === 0
                                            ? "bg-white"
                                            : "bg-gray-50"
                                    }`}
                                >
                                    <td className="border border-gray-300 px-4 py-2">
                                        {employee.emp_no}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {employee.first_name}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {employee.last_name}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {employee.gender === "M"
                                            ? "ชาย"
                                            : "หญิง"}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {employee.birth_date}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {employee.dept_name}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {employee.image_path ? (
                                            <img
                                                src={`/storage/${employee.image_path}`} // อ้างอิงเส้นทางรูปภาพ
                                                alt="Employee Image"
                                                className="w-20 h-20 object-cover rounded-full cursor-pointer"
                                                onClick={() =>
                                                    handlePhotoClick(
                                                        employee.image_path
                                                    )
                                                } // ใช้พาธรูปภาพที่ถูกต้อง
                                            />
                                        ) : (
                                            <span className="text-gray-500">
                                                No Photo
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="text-center text-gray-500 py-4"
                                >
                                    No employees found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center items-center mt-4 space-x-2">
                {employees.links.map((link, index) =>
                    link.url ? (
                        <Link
                            key={index}
                            href={`${link.url}&search=${search}&filterBy=${searchBy}`}
                            className={`px-3 py-1 border rounded-md ${
                                link.active
                                    ? "bg-blue-500 text-white"
                                    : "bg-white text-blue-500 border-blue-500"
                            } hover:bg-blue-600 hover:text-white`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ) : (
                        <span
                            key={index}
                            className={`px-3 py-1 border rounded-md bg-gray-200 text-gray-500`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    )
                )}
            </div>
            {/* Modal for displaying photo */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {selectedPhoto && (
                    <img
                        src={`/storage/${selectedPhoto}`}
                        alt="Employee Image"
                        className="w-full h-auto"
                    />
                )}
            </Modal>
        </AuthenticatedLayout>
    );
}
