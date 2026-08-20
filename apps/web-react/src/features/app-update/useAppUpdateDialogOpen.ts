import { useState, type Dispatch, type SetStateAction } from "react"

export function useAppUpdateDialogOpen(
  initialOpen = false,
): [boolean, Dispatch<SetStateAction<boolean>>] {
  const [open, setOpen] = useState(initialOpen)
  return [open, setOpen]
}
