import React from "react";

const ProductList = ({ products }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        ইনভেন্টরি তালিকা
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 font-semibold text-gray-600">নাম</th>
              <th className="p-3 font-semibold text-gray-600">SKU</th>
              <th className="p-3 font-semibold text-gray-600">পরিমাণ</th>
              <th className="p-3 font-semibold text-gray-600">মূল্য</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{product.name}</td>
                  <td className="p-3 text-gray-500">{product.sku}</td>
                  <td className="p-3">{product.quantity}</td>
                  <td className="p-3 font-medium">৳{product.price}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  কোনো প্রোডাক্ট পাওয়া যায়নি।
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
