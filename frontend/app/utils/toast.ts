// app/utils/toast.ts
let iziToast: any;

export const initializeToast = async () => {
  if (typeof window === 'undefined') return;

  const iziToastModule = await import('izitoast');
  iziToast = iziToastModule.default;
  await import('izitoast/dist/css/iziToast.min.css');
};

export const showSuccess = (message: string) => {
  if (typeof window === 'undefined') return;

  if (iziToast) {
    iziToast.success({
      title: "Success",
      message,
      position: "topRight",
      timeout: 3000,
    });
  }
};

export const showError = (message: string) => {
  if (typeof window === 'undefined') return;

  if (iziToast) {
    iziToast.error({
      title: "Error",
      message,
      position: "topRight",
      timeout: 5000,
    });
  }
};