import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select"; // For searchable dropdowns
import AddCustomerMiniModal from "./AddCustomerMiniModal"; // For adding new customers
import api from "../api/axiosConfig";

const AddSaleModal = ({ isOpen, onClose, onSaleAdded }) => {
  // Form state
  const [customerId, setCustomerId] = useState(null); // Use null for react-select
  const [products, setProducts] = useState([
    { product: "", quantity: 1, priceAtSale: 0 },
  ]);
  const [amountPaid, setAmountPaid] = useState("");
  const [error, setError] = useState("");

  // Data lists for dropdowns
  const [customerList, setCustomerList] = useState([]);
  const [productList, setProductList] = useState([]);

  // State for the "mini" add customer modal
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  // Fetch customers and products when the modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchInitialData = async () => {
        try {
          const [customersRes, productsRes] = await Promise.all([
            api.get("/customers"),
            api.get("/products"),
          ]);
          setCustomerList(customersRes.data.data);
          setProductList(productsRes.data.data);
        } catch (err) {
          console.error("Failed to fetch initial data for sale modal", err);
          setError("Could not load customers or products.");
        }
      };
      fetchInitialData();
    } else {
      // Reset form when modal closes
      setCustomerId(null);
      setProducts([{ product: "", quantity: 1, priceAtSale: 0 }]);
      setAmountPaid("");
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // --- Data formatting for react-select ---
  const customerOptions = customerList.map((c) => ({
    value: c._id,
    label: `${c.name} - ${c.phone}`,
  }));
  const productOptions = productList.map((p) => ({
    value: p._id,
    label: `${p.name} (Stock: ${p.quantity})`,
  }));

  // --- Handlers for dynamic product rows ---
  const handleProductRowChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;

    // If a product is selected from the dropdown, auto-fill its selling price
    if (field === "product") {
      const selectedProduct = productList.find((p) => p._id === value);
      if (selectedProduct) {
        updatedProducts[index]["priceAtSale"] = selectedProduct.sellingPrice;
      }
    }
    setProducts(updatedProducts);
  };

  const addProductField = () => {
    setProducts([...products, { product: "", quantity: 1, priceAtSale: 0 }]);
  };

  const removeProductField = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  // --- Handler for when a new customer is created in the mini-modal ---
  const handleCustomerAdded = (newCustomer) => {
    setCustomerList([...customerList, newCustomer]);
    setCustomerId({
      value: newCustomer._id,
      label: `${newCustomer.name} - ${newCustomer.phone}`,
    });
    setIsCustomerModalOpen(false);
  };

  // --- Final Submission ---
  const totalAmount = products.reduce(
    (sum, p) => sum + Number(p.quantity) * Number(p.priceAtSale),
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerId || products.some((p) => !p.product)) {
      setError("Please select a customer and at least one product.");
      return;
    }
    const saleData = {
      customer: customerId.value, // Extract value from react-select object
      products: products.map((p) => ({
        product: p.product,
        quantity: Number(p.quantity),
        priceAtSale: Number(p.priceAtSale),
      })),
      totalAmount,
      amountPaid: Number(amountPaid) || 0,
    };
    try {
      await api.post("/sales", saleData);
      onSaleAdded();
      onClose();
    } catch (err) {
      setError("Failed to record sale. Please check your data.");
      console.error("Error creating sale:", err);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40 p-4">
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Record New Sale
          </h2>
          {error && (
            <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">
              {error}
            </p>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex-grow overflow-y-auto pr-2"
          >
            <div className="space-y-4">
              {/* Searchable Customer Dropdown */}
              <div className="flex items-end gap-2">
                <div className="flex-grow">
                  <label className="block text-sm font-medium text-gray-700">
                    Customer
                  </label>
                  <Select
                    options={customerOptions}
                    value={customerId}
                    onChange={setCustomerId}
                    placeholder="Search or select a customer..."
                    isClearable
                    className="mt-1"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setIsCustomerModalOpen(true)}
                  className="px-4 py-2 bg-green-500 text-white rounded h-10 shadow-sm hover:bg-green-600"
                >
                  + Add
                </button>
              </div>

              {/* Searchable Product Dropdowns */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Products
                </label>
                {products.map((p, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-2 items-center"
                  >
                    <div className="col-span-6">
                      <Select
                        options={productOptions}
                        value={productOptions.find(
                          (opt) => opt.value === p.product
                        )}
                        onChange={(selectedOption) =>
                          handleProductRowChange(
                            index,
                            "product",
                            selectedOption ? selectedOption.value : ""
                          )
                        }
                        placeholder="Search product..."
                      />
                    </div>
                    <input
                      type="number"
                      value={p.quantity}
                      onChange={(e) =>
                        handleProductRowChange(
                          index,
                          "quantity",
                          e.target.value
                        )
                      }
                      placeholder="Qty"
                      className="col-span-2 p-2 border rounded-md"
                    />
                    <input
                      type="number"
                      value={p.priceAtSale}
                      onChange={(e) =>
                        handleProductRowChange(
                          index,
                          "priceAtSale",
                          e.target.value
                        )
                      }
                      placeholder="Price"
                      className="col-span-3 p-2 border rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeProductField(index)}
                      className="col-span-1 text-red-500 hover:text-red-700 font-bold text-xl"
                    >
                      &times;
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addProductField}
                  className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
                >
                  + Add Another Product
                </button>
              </div>
            </div>
          </form>

          {/* Payment Section and Action Buttons */}
          <div className="mt-6 pt-4 border-t">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800 mb-2 sm:mb-0">
                Total: ৳{totalAmount.toLocaleString()}
              </h3>
              <div className="flex items-center gap-2">
                <label className="font-medium">Amount Paid</label>
                <input
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  placeholder="0"
                  className="w-32 p-2 border rounded-md"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700"
              >
                Record Sale
              </button>
            </div>
          </div>
        </div>
      </div>

      <AddCustomerMiniModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onCustomerAdded={handleCustomerAdded}
      />
    </>
  );
};

export default AddSaleModal;
