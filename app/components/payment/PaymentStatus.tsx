const statusLabel: Record<string, string> = {
  semua: "Semua",
  paid: "Lunas",
  unpaid: "Belum Bayar",
};

const statusStyles: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  unpaid: "bg-yellow-100 text-yellow-700",
};

const PaymentStatus: React.FC<{ status: string | undefined }> = ({
  status,
}) => {
  // Provide a fallback if status is undefined
  const statusKey = status ?? "unknown"; // Default to "unknown" if status is undefined

  return (
    <span
      className={`px-2 py-1 rounded-full font-semibold text-xs ${statusStyles[statusKey]}`}
    >
      {statusLabel[statusKey]}
    </span>
  );
};

export default PaymentStatus;
