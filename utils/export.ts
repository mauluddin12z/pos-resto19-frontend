type CSVRow = (string | number | null | undefined)[];

type CSVExportParams = {
  filename: string;
  headers: string[];
  rows: CSVRow[];
};

type XLSXExportParams<T extends Record<string, any>> = {
  filename: string;
  data: T[];
};

export const exportToCSV = ({
  filename,
  headers,
  rows,
}: CSVExportParams): void => {
  const csvContent = [headers, ...rows]
    .map((row) => row.map((v) => `"${v ?? ""}"`).join(","))
    .join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportToXLSX = async <T extends Record<string, any>>({
  filename,
  data,
}: XLSXExportParams<T>): Promise<void> => {
  const { utils, writeFile } = await import("xlsx");

  const ws = utils.json_to_sheet(data);
  const wb = utils.book_new();

  utils.book_append_sheet(wb, ws, "Sheet1");
  writeFile(wb, filename);
};
