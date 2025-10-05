import React from "react";
import print from "print-js";

const SaleDetailsModal = ({ isOpen, onClose, sale }) => {
  // Don't render anything if the modal is not open or if there's no sale data
  if (!isOpen || !sale) return null;

  // --- CORRECTED ACCOUNTING LOGIC (Credit - Debit) ---
  // A due is negative, an advance is positive.

  // 1. The financial impact of THIS invoice
  const thisInvoiceImpact = sale.amountPaid - sale.totalAmount;

  // 2. The customer's balance BEFORE this transaction (from backend)
  const previousBalance = sale.previousBalance || 0;

  // 3. The new final balance AFTER this transaction
  const newTotalBalance = previousBalance + thisInvoiceImpact;

  // This function generates the HTML for the invoice and triggers the print action
  const handlePrint = () => {
    // CSS styles for the printed invoice
    const printableStyles = `
            body { font-family: Arial, sans-serif; font-size: 10pt; color: #333; }
            .invoice-box { max-width: 800px; margin: auto; padding: 20px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, .15); }
            .header { text-align: center; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
            .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .items-table { width: 100%; border-collapse: collapse; }
            .items-table th, .items-table td { border-bottom: 1px solid #ddd; padding: 8px; text-align: left; }
            .items-table th { background-color: #f2f2f2; }
            .text-right { text-align: right; }
            .summary { margin-top: 20px; float: right; width: 50%; max-width: 300px; }
            .summary-table { width: 100%; }
            .summary-table td { padding: 5px; }
            .summary-table .total { border-top: 2px solid #333; font-weight: bold; font-size: 1.1em; }
        `;

    // HTML content for the invoice
    const printableHTML = `
            <div class="invoice-box">
                <div class="header">
                    <h2>Invoice</h2>
                    <p><strong>Invoice #:</strong> ${sale._id.slice(-6)}</p>
                    <p><strong>Date:</strong> ${new Date(
                      sale.saleDate
                    ).toLocaleDateString()}</p>
                </div>
                <div class="details-grid">
                    <div>
                        <strong>Billed To:</strong><br>
                        ${sale.customer?.name || "N/A"}<br>
                        Phone: ${sale.customer?.phone || ""}
                    </div>
                </div>
                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th class="text-right">Quantity</th>
                            <th class="text-right">Price</th>
                            <th class="text-right">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sale.products
                          .map(
                            (item) => `
                            <tr>
                                <td>${item.product?.name || "N/A"}</td>
                                <td class="text-right">${item.quantity}</td>
                                <td class="text-right">৳${item.priceAtSale.toLocaleString()}</td>
                                <td class="text-right">৳${(
                                  item.quantity * item.priceAtSale
                                ).toLocaleString()}</td>
                            </tr>
                        `
                          )
                          .join("")}
                    </tbody>
                </table>
                <div class="summary">
                    <table class="summary-table">
                        <tr><td>Invoice Total:</td><td class="text-right">৳${sale.totalAmount.toLocaleString()}</td></tr>
                        <tr><td>Paid on Invoice:</td><td class="text-right">৳${sale.amountPaid.toLocaleString()}</td></tr>
                        <tr><td>Previous Balance:</td><td class="text-right">৳${previousBalance.toLocaleString()}</td></tr>
                        <tr class="total">
                            <td>${
                              newTotalBalance < 0
                                ? "New Total Due:"
                                : "New Advance:"
                            }</td>
                            <td class="text-right"><strong>৳${Math.abs(
                              newTotalBalance
                            ).toLocaleString()}</strong></td>
                        </tr>
                    </table>
                </div>
            </div>
        `;

    // Use a setTimeout to avoid issues with browser pop-up blockers or rendering delays
    setTimeout(() => {
      print({
        printable: printableHTML,
        type: "raw-html",
        style: printableStyles,
        documentTitle: `Invoice-${sale._id.slice(-6)}`,
      });
    }, 100);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-2xl">
        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">
            Sale Details (Invoice #{sale._id.slice(-6)})
          </h2>
          <div className="flex space-x-4">
            <button
              onClick={handlePrint}
              className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-md"
            >
              Print
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 text-3xl font-light"
            >
              &times;
            </button>
          </div>
        </div>

        {/* On-screen display of the details */}
        <div className="p-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="font-semibold text-gray-500">Customer:</p>
              <p className="text-lg">{sale.customer?.name || "N/A"}</p>
              <p className="text-sm text-gray-600">
                Phone: {sale.customer?.phone || ""}
              </p>
            </div>
            <div className="sm:text-right mt-4 sm:mt-0">
              <p className="font-semibold text-gray-500">Date:</p>
              <p className="text-lg">
                {new Date(sale.saleDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <h3 className="font-semibold mb-2 text-gray-600">Items Sold:</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left table-auto border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3 text-center">Quantity</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {sale.products.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3">
                      {item.product?.name || "Product not found"}
                    </td>
                    <td className="p-3 text-center">{item.quantity}</td>
                    <td className="p-3 text-right">
                      ৳{item.priceAtSale.toLocaleString()}
                    </td>
                    <td className="p-3 text-right">
                      ৳{(item.quantity * item.priceAtSale).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-end">
            <div className="w-full max-w-sm space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>Invoice Total:</span>
                <span>৳{sale.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Paid on this Invoice:</span>
                <span className="text-green-600">
                  ৳{sale.amountPaid.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between mt-2 border-t pt-2">
                <span>Previous Balance:</span>
                <span>৳{previousBalance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t-2 border-gray-300 pt-2">
                <span>
                  {newTotalBalance < 0
                    ? "New Total Due:"
                    : "New Advance Balance:"}
                </span>
                <span
                  className={
                    newTotalBalance < 0 ? "text-red-500" : "text-green-600"
                  }
                >
                  ৳{Math.abs(newTotalBalance).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleDetailsModal;
