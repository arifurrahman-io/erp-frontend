import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import print from "print-js";
import AddPaymentModal from "../components/AddPaymentModal";
import SaleDetailsModal from "../components/SaleDetailsModal";
import api from "../api/axiosConfig";

const CustomerLedgerPage = () => {
  const { id: customerId } = useParams();
  const [ledger, setLedger] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for modals
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  // Function to fetch ledger data from the backend
  const fetchLedger = async () => {
    try {
      const response = await api.get(`/customers/${customerId}/ledger`);
      // Sort transactions to show the latest first for display
      const sortedTransactions = response.data.transactions.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setLedger({ ...response.data, transactions: sortedTransactions });
    } catch (err) {
      setError(
        "Failed to fetch ledger data. Please ensure the backend is running correctly."
      );
      console.error("Error fetching ledger:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when the component mounts or customerId changes
  useEffect(() => {
    if (customerId) {
      fetchLedger();
    }
  }, [customerId]);

  // Print handler using print-js
  const handlePrint = () => {
    if (!ledger) return;

    const printableStyles = `
            body { font-family: Arial, sans-serif; font-size: 10pt; }
            h2, p { margin: 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .text-right { text-align: right; }
            .header { margin-bottom: 20px; }
        `;

    let runningBalance = 0;
    const printableHTML = `
            <div class="header">
                <h2>Ledger for: ${ledger.customer.name}</h2>
                <p>Phone: ${ledger.customer.phone}</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th class="text-right">Debit</th>
                        <th class="text-right">Credit</th>
                        <th class="text-right">Balance</th>
                    </tr>
                </thead>
                <tbody>
                    ${[...ledger.transactions]
                      .reverse()
                      .map((tx) => {
                        // Reverse for chronological calculation
                        runningBalance += tx.credit - tx.debit;
                        return `
                            <tr>
                                <td>${new Date(
                                  tx.date
                                ).toLocaleDateString()}</td>
                                <td>${tx.description}</td>
                                <td class="text-right">৳${tx.debit.toLocaleString()}</td>
                                <td class="text-right">৳${tx.credit.toLocaleString()}</td>
                                <td class="text-right">৳${runningBalance.toLocaleString()}</td>
                            </tr>
                        `;
                      })
                      .join("")}
                </tbody>
            </table>
        `;

    setTimeout(
      () =>
        print({
          printable: printableHTML,
          type: "raw-html",
          style: printableStyles,
          documentTitle: `Ledger-${ledger.customer.name}`,
        }),
      100
    );
  };

  // Handler for viewing sale details
  const handleViewDetails = async (saleId) => {
    try {
      const response = await api.get(`/sales/${saleId}`);
      setSelectedSale(response.data.data);
      setIsDetailsModalOpen(true);
    } catch (err) {
      console.error("Failed to fetch sale details:", err);
      alert("Could not load sale details.");
    }
  };

  if (loading) return <div className="text-center p-10">Loading Ledger...</div>;
  if (error)
    return (
      <div className="text-center p-10 text-red-500 bg-red-100 rounded-md">
        {error}
      </div>
    );
  if (!ledger)
    return (
      <div className="text-center p-10">No data found for this customer.</div>
    );

  // Corrected accounting logic: Credit - Debit
  const totalCredit = ledger.transactions.reduce(
    (sum, tx) => sum + tx.credit,
    0
  );
  const totalDebit = ledger.transactions.reduce((sum, tx) => sum + tx.debit, 0);
  const currentBalance = totalCredit - totalDebit;

  // Pre-calculate running balances for accurate display
  const transactionsWithBalance = [];
  let balance = 0;
  // Iterate backwards (from oldest to newest) through the sorted (newest to oldest) list
  for (let i = ledger.transactions.length - 1; i >= 0; i--) {
    const tx = ledger.transactions[i];
    balance += tx.credit - tx.debit;
    transactionsWithBalance.unshift({ ...tx, runningBalance: balance }); // Add to the front of the array
  }

  return (
    <div>
      {/* Page Header with Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Customer Ledger</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md"
          >
            + Add Payment
          </button>
          <button
            onClick={handlePrint}
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-md"
          >
            Print Ledger
          </button>
        </div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
        {/* Customer Details & Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-4 border-b">
          <div>
            <h2 className="text-2xl font-bold">{ledger.customer.name}</h2>
            <p className="text-gray-600">{ledger.customer.address}</p>
            <p className="text-gray-600">Phone: {ledger.customer.phone}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-left md:text-right">
            <p>
              Total Billed:{" "}
              <span className="font-bold">৳{totalDebit.toLocaleString()}</span>
            </p>
            <p>
              Total Paid:{" "}
              <span className="font-bold text-green-600">
                ৳{totalCredit.toLocaleString()}
              </span>
            </p>
            <p className="text-lg">
              {currentBalance < 0 ? "Current Due:" : "Advance Balance:"}
              <span
                className={`font-bold ml-2 ${
                  currentBalance < 0 ? "text-red-500" : "text-green-600"
                }`}
              >
                ৳{Math.abs(currentBalance).toLocaleString()}
              </span>
            </p>
          </div>
        </div>

        {/* Ledger Transaction Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Description</th>
                <th className="p-3 text-right">Debit (Due)</th>
                <th className="p-3 text-right">Credit (Paid)</th>
                <th className="p-3 text-right">Balance</th>
              </tr>
            </thead>
            <tbody>
              {transactionsWithBalance.map((tx) => (
                <tr key={tx.originalId || tx.date} className="border-b">
                  <td className="p-3">
                    {new Date(tx.date).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    {tx.type === "sale" ? (
                      <button
                        onClick={() => handleViewDetails(tx.originalId)}
                        className="text-blue-600 hover:underline text-left"
                      >
                        {tx.description}
                      </button>
                    ) : (
                      tx.description
                    )}
                  </td>
                  <td className="p-3 text-right">
                    ৳{tx.debit.toLocaleString()}
                  </td>
                  <td className="p-3 text-right text-green-600">
                    ৳{tx.credit.toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-bold">
                    ৳{tx.runningBalance.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="font-bold text-gray-700">
              <tr className="border-t-2 border-gray-300">
                <td colSpan="2" className="p-3 text-right">
                  Totals
                </td>
                <td className="p-3 text-right">
                  ৳{totalDebit.toLocaleString()}
                </td>
                <td className="p-3 text-right text-green-600">
                  ৳{totalCredit.toLocaleString()}
                </td>
                <td className="p-3"></td>
              </tr>
              <tr className="bg-gray-100">
                <td colSpan="4" className="p-3 text-right text-lg">
                  {currentBalance < 0 ? "Current Due:" : "Advance Balance:"}
                </td>
                <td
                  className={`p-3 text-right text-lg ${
                    currentBalance < 0 ? "text-red-500" : "text-green-600"
                  }`}
                >
                  ৳{Math.abs(currentBalance).toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AddPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        customerId={customerId}
        onPaymentAdded={fetchLedger}
      />
      <SaleDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        sale={selectedSale}
      />
    </div>
  );
};

export default CustomerLedgerPage;
