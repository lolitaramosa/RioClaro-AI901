import * as XLSX from "xlsx";

export async function leerExcel(ruta) {
  const response = await fetch(ruta);
  const data = await response.arrayBuffer();

  const workbook = XLSX.read(data);

  const hoja = workbook.SheetNames[0];

  const worksheet = workbook.Sheets[hoja];

  return XLSX.utils.sheet_to_json(worksheet);
}