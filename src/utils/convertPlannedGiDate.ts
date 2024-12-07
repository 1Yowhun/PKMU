export function convertStringToDate(dateString: string): Date {
  const day = parseInt(dateString.slice(0, 2), 10);
  const month = parseInt(dateString.slice(2, 4), 10) - 1;
  const year = parseInt(dateString.slice(4, 8), 10);

  // Menggunakan Date.UTC untuk mencegah perubahan waktu oleh zona waktu lokal
  return new Date(Date.UTC(year, month, day));
}
