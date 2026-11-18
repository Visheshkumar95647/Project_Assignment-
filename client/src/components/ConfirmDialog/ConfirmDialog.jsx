// const ConfirmDialog = ({ message, onConfirm, onCancel, loading }) => {
//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
//       <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
//         <h3 className="text-base font-semibold text-gray-800 mb-2">Are you sure?</h3>
//         <p className="text-sm text-gray-500 mb-6">{message}</p>
//         <div className="flex gap-3 justify-end">
//           <button
//             onClick={onCancel}
//             disabled={loading}
//             className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             disabled={loading}
//             className="px-4 py-2 text-sm rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition disabled:opacity-60"
//           >
//             {loading ? 'Deleting...' : 'Delete'}
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ConfirmDialog

const ConfirmDialog = ({
  message,
  loading = false,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="mb-2 text-base font-semibold text-gray-800">
          Are you sure?
        </h3>

        <p className="mb-6 text-sm text-gray-500">
          {message}
        </p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600 disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
