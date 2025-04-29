import { Modal } from "~/components/Common/Modal";

type EditModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function EditModal({ open, onClose, children }: EditModalProps) {
  if (!open) return null;
  return (
    <Modal isOpen={open} onClose={onClose}>
      {children}
    </Modal>
  );
}
