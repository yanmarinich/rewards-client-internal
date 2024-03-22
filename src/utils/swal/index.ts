import { useEffect } from 'react'
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const ReactSwal = withReactContent(Swal);

const ReactSwalWithInput = ReactSwal.mixin({
  input: 'text',
  // confirmButtonText: <i>OK</i>,
});

import {
  ToastContainer,
  toast as Toast,
  ToastPosition,
  ToastOptions
} from 'react-toastify';

const toastParams: ToastOptions = {
  position: "top-right" as ToastPosition,
  autoClose: 2500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  // progress: ,
  theme: "light",
};

const _toast = async (title: string, type: string) => {
  switch (type) {
    case "info": { Toast.info(title, toastParams); break; }
    case "success": { Toast.success(title, toastParams); break; }
    case "warning": { Toast.warning(title, toastParams); break; }
    case "error": { Toast.error(title, toastParams); break; }
    case "default": { Toast(title, toastParams); break; }
    case "test": { Toast.info('🦄 Wow so easy!', toastParams); break; }
  }
}

export const toast = {
  info: async (title: string) => { return _toast(title, "info"); },
  success: async (title: string) => { return _toast(title, "success"); },
  warning: async (title: string) => { return _toast(title, "warning"); },
  error: async (title: string) => { return _toast(title, "error"); },
  default: async (title: string) => { return _toast(title, "default"); },
  test: async (title: string) => { return _toast(title, "test"); },
};

const _alert = async (title: string, text: string, icon: string) => {
  return await Swal.fire({ title, text, icon: icon as SweetAlertIcon });
}

export const alert = {
  success: async (title: string, text: string = "") => { return _alert(title, text, "success"); },
  error: async (title: string, text: string = "") => { return _alert(title, text, "error"); },
  warning: async (title: string, text: string = "") => { return _alert(title, text, "warning"); },
  info: async (title: string, text: string = "") => { return _alert(title, text, "info"); },
  question: async (title: string, text: string = "") => { return _alert(title, text, "question"); },
};

export const confirm = async ({
  title = "", text = "", html = "", yes = "Yes", no = "No", icon = "question" } = {}
): Promise<boolean> => {
  return Swal.fire({
    title,
    showDenyButton: true,
    ...(text && { text }),
    ...(html && { html }),
    icon: icon as SweetAlertIcon,
    showCancelButton: false,
    confirmButtonText: yes, // "Save",
    denyButtonText: no, // `Don't save`
    reverseButtons: true,
  }).then((result) => {
    return result.isConfirmed;
    // isConfirmed: true
    // isDenied: false
    // isDismissed: false
    // value: true
  });
};


export const onTransactionSuccess = async (url: string, blockchainName: string): Promise<boolean> => {
  return await confirm({
    // title: "Success !",
    title: "Transaction completed successfully",
    html: `<a target="_blank" href="${url}"><b>View transaction on ${blockchainName}</b></a>`,
    icon: "success",
    no: "Close",
    yes: "Oke"
  });
}



// Swal.fire({
//   title: "Are you sure?",
//   text: "You won't be able to revert this!",
//   icon: "warning",
//   showCancelButton: true,
//   confirmButtonColor: "#3085d6",
//   cancelButtonColor: "#d33",
//   confirmButtonText: "Yes, delete it!"
// }).then((result) => {
//   // isConfirmed: true
//   // isDenied: false
//   // isDismissed: false
//   // value: true

//   if (result.isConfirmed) {
//     Swal.fire({
//       title: "Deleted!",
//       text: "Your file has been deleted.",
//       icon: "success"
//     });
//   }
// });
