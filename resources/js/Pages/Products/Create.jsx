import React from 'react';
import { useForm } from '@inertiajs/inertia-react';

const Create = () => {
  const { data, setData, post, errors } = useForm({
    name: '',
    description: '',
    price: '',
    stock: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/products');
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Create New Product</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            value={data.description}
            onChange={(e) => setData('description', e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.description && <div className="text-red-500 text-xs mt-1">{errors.description}</div>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
            Price
          </label>
          <input
            type="text"
            id="price"
            value={data.price}
            onChange={(e) => setData('price', e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.price && <div className="text-red-500 text-xs mt-1">{errors.price}</div>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stock">
            Stock
          </label>
          <input
            type="text"
            id="stock"
            value={data.stock}
            onChange={(e) => setData('stock', e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.stock && <div className="text-red-500 text-xs mt-1">{errors.stock}</div>}
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default Create;
