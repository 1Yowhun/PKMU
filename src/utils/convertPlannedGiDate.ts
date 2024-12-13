export function convertStringToDate(dateString: string): Date {
  let day: number, month: number, year: number;
  if (dateString.length === 7) {
    // Format DMMYYYY (contoh: 2122024 -> 2-12-2024)
    day = parseInt(dateString.slice(0, 1), 10); // 1 digit untuk hari
    month = parseInt(dateString.slice(1, 3), 10) - 1; // 2 digit untuk bulan
    year = parseInt(dateString.slice(3), 10); // 4 digit untuk tahun
  } else if (dateString.length === 8) {
    // Format DDMMYYYY (contoh: 02122024 -> 02-12-2024)
    day = parseInt(dateString.slice(0, 2), 10); // 2 digit untuk hari
    month = parseInt(dateString.slice(2, 4), 10) - 1; // 2 digit untuk bulan
    year = parseInt(dateString.slice(4), 10); // 4 digit untuk tahun
  } else {
    console.error("Format tanggal tidak didukung");
    return new Date(Date.UTC(1970, 0, 1));
  }
  return new Date(Date.UTC(year, month, day));
}
