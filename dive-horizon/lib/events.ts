export const PRELOADER_DONE = "preloader:done";

/** Run cb once the preloader curtain has finished (immediately if it already has). Returns a cleanup fn. */
export function onPreloaderDone(cb: () => void) {
  if (document.documentElement.dataset.loading === "false") {
    cb();
    return () => {};
  }
  window.addEventListener(PRELOADER_DONE, cb, { once: true });
  return () => window.removeEventListener(PRELOADER_DONE, cb);
}

export function markPreloaderDone() {
  document.documentElement.dataset.loading = "false";
  window.dispatchEvent(new Event(PRELOADER_DONE));
}
