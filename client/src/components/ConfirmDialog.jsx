import Modal from "./Modal";

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, busy }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button className="btn-secondary" onClick={onClose}>Cancel</button>
        <button className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:opacity-60" disabled={busy} onClick={onConfirm}>Delete task</button>
      </div>
    </Modal>
  );
}
