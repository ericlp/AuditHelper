import styles from './Snackbar.module.css';

export const Snackbar = () => <div id="snackbar" className={styles.snackbar}></div>;

type ToastType = 'success' | 'error' | 'info' | 'warning';

const ToastToColor: Record<ToastType, string> = {
  success: '#4caf50',
  error: '#f44336',
  info: '#2196f3',
  warning: '#ff9800',
};

const constrastingTextColor = (background: string) => {
  const r = parseInt(background.slice(1, 3), 16);
  const g = parseInt(background.slice(3, 5), 16);
  const b = parseInt(background.slice(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#000000' : '#ffffff';
};

export const pushToast = (text: string, variant: ToastType = 'info') => {
  // Get the snackbar div
  const x = document.getElementById('snackbar');
  if (x == null) return;

  // Add the "show" class to DIV
  x.textContent = text;
  x.style.backgroundColor = ToastToColor[variant];
  x.style.color = constrastingTextColor(ToastToColor[variant]);
  x.className = `${styles.snackbar} ${styles.show}`;

  // After 3 seconds, remove the show class from DIV
  setTimeout(function () {
    x.className = styles.snackbar;
  }, 5000);
};
