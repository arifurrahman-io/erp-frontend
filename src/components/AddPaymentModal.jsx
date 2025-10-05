import React, { useState } from "react";
import api from "../api/axiosConfig";

const AddPaymentModal = ({ isOpen, onClose, customerId, onPaymentAdded }) => {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Default to today
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    const paymentData = {
      customer: customerId,
      amount: Number(amount),
      date,
      notes,
    };

    try {
      // This API endpoint needs to be created on your backend
      await api.post("/payments", paymentData);
      onPaymentAdded(); // Refresh the ledger
      onClose(); // Close the modal
    } catch (err) {
      setError("Failed to add payment.");
      console.error("Error adding payment:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Add Payment</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium">
              Amount
            </label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border rounded-md mt-1"
              required
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium">
              Date
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border rounded-md mt-1"
            />
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium">
              Notes (Optional)
            </label>
            <input
              id="notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border rounded-md mt-1"
            />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded"
            >
              Save Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPaymentModal;
