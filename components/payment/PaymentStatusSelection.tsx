type Props = {
   value: string;
   onChange: (value: string) => void;
};

const statuses = ["", "paid", "unpaid"];

export default function PaymentStatusSelection({ value, onChange }: Props) {
   return (
      <select
         value={value}
         onChange={(e) => onChange(e.target.value)}
         className="px-2 py-1 border border-gray-300 rounded-full text-xs focus:outline-1 outline-blue-300"
      >
         {statuses.map((status, index) => (
            <option key={index} value={status}>
               {status === ""
                  ? "All"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
         ))}
      </select>
   );
}
