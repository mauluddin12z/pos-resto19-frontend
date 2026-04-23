import { Edit, Printer, Trash } from "lucide-react";

// Reusable component for Action Buttons
const ActionButtons = ({
  onEdit,
  onDelete,
  onPayBill,
  onPrintInvoice,
  isPaid,
}: {
  onEdit: () => void;
  onDelete: () => void;
  onPayBill: () => void;
  onPrintInvoice: () => void;
  isPaid: boolean;
}) => (
  <div className="flex gap-2 mt-2 justify-between">
    <div className="flex gap-2">
      <button
        onClick={onEdit}
        className="border border-blue-300 rounded-lg text-blue-500 text-xs p-2.5 hover:bg-blue-600 hover:text-white cursor-pointer"
      >
        <Edit className="w-4 h-4" />
      </button>
      <button
        onClick={onDelete}
        className="border border-red-300 rounded-lg text-red-500 text-xs p-2.5 hover:bg-red-600 hover:text-white cursor-pointer"
      >
        <Trash className="w-4 h-4" />
      </button>
    </div>
    <div className="flex gap-2">
      {!isPaid ? (
        <button
          onClick={onPayBill}
          className="border bg-blue-600 rounded-lg text-xs text-white p-2.5 hover:bg-blue-700 hover:text-white cursor-pointer"
        >
          Pay Bill
        </button>
      ) : (
        <button
          className="w-full bg-gray-600 hover:bg-gray-700 text-white p-2 rounded cursor-pointer"
          onClick={onPrintInvoice}
        >
          <div>
            <Printer className="w-4 h-4" />
          </div>
        </button>
      )}
    </div>
  </div>
);
export default ActionButtons;
