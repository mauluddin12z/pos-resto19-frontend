import Modal from "./Modal";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  message?: string;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  message = "Apakah Anda yakin ingin menghapus data ini?",
}: DeleteConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <p className="text-center">{message}</p>

        <div className="mt-4 flex justify-center gap-3">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`rounded-md bg-red-600 px-4 py-2 text-white transition ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"
            }`}
          >
            {isLoading ? "Menghapus..." : "Ya, hapus"}
          </button>

          <button
            onClick={onClose}
            className="rounded-md bg-gray-200 px-4 py-2 hover:bg-gray-300 transition"
          >
            Batal
          </button>
        </div>
      </div>
    </Modal>
  );
}
