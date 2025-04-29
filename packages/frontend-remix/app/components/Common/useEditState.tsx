import { useState } from "react";

export function useEditState() {
  const [editing, setEditing] = useState(false);
  const open = () => setEditing(true);
  const close = () => setEditing(false);
  return { editing, open, close };
}
