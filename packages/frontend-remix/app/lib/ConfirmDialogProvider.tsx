import { createContext, useContext, useState } from "react";

const ConfirmDialogContext = createContext<any>(null);

export function ConfirmDialogProvider({ children }: { children: React.ReactNode }) {
  const [dialog, setDialog] = useState<{ title: string; description: string; confirmText?: string; cancelText?: string; resolve: (result: boolean) => void } | null>(null);

  const confirm = ({ title, description, confirmText = "Confirm", cancelText = "Cancel" }: { title: string; description: string; confirmText?: string; cancelText?: string; }) => {
    return new Promise<boolean>((resolve) => {
      setDialog({ title, description, confirmText, cancelText, resolve });
    });
  };

  const handleClose = (result: boolean) => {
    if (dialog) {
      dialog.resolve(result);
      setDialog(null);
    }
  };

  return (
    <ConfirmDialogContext.Provider value={confirm}>
      {children}
      {dialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-lg font-bold mb-2">{dialog.title}</h2>
            <p className="text-gray-700 mb-4">{dialog.description}</p>
            <div className="flex justify-end space-x-4">
              <button onClick={() => handleClose(false)} className="px-4 py-2 rounded border"> {dialog.cancelText}</button>
              <button onClick={() => handleClose(true)} className="px-4 py-2 rounded bg-red-600 text-white">{dialog.confirmText}</button>
            </div>
          </div>
        </div>
      )}
    </ConfirmDialogContext.Provider>
  );
}

export function useConfirmDialog() {
  return useContext(ConfirmDialogContext);
}