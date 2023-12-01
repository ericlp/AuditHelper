import { pushToast } from '../components/Snackbar/Snackbar';

export function handleFile<T>(formatter: (input: string) => T | null, file: File | null, callback: (data: T) => void) {
  if (file == null) return;
  const reader = new FileReader();
  reader.readAsText(file, 'ISO-8859-4');
  reader.onload = () => {
    if (typeof reader.result === 'string') {
      const result = formatter(reader.result);
      if (result != null) {
        callback(result);
      } else {
        pushToast('Kunde inte läsa filen', 'error');
      }
    }
  };
}
