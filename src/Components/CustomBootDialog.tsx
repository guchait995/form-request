import React, { useEffect, useState } from "react";
import Modal from "@material-ui/core/Modal";

let openModalFn;
let CloseDialogFn;
export default function CustomBootDialog() {
  const [open, setOpen] = useState<boolean>(false);
  const [element, setElement] = useState();
  const handleOpen = () => {};
  const handleClose = () => {
    setOpen(false);
  };
  const onOpenModal = element => {
    setOpen(true);
    setElement(element);
  };
  const close = () => {
    setOpen(false);
  };

  useEffect(() => {
    openModalFn = onOpenModal;
    CloseDialogFn = close;
  }, []);
  return (
    <div>
      <Modal open={open} onClose={handleClose} disableAutoFocus={true}>
        <div className="modal-body">
          {element ? element : <div>This is empty div .</div>}
        </div>
      </Modal>
    </div>
  );
}

export function openModal(val?) {
  openModalFn({ ...val });
}
export function closeDialog() {
  CloseDialogFn();
}
