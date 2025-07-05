export function jsonToCSV(jsonArray) {
    if (!jsonArray || !jsonArray.length) return "";
  
    const headers = Object.keys(jsonArray[0]);
    const csvRows = [headers.join(",")];
  
    for (const row of jsonArray) {
      const values = headers.map((header) => {
        let val = row[header];
        if (typeof val === "object" && val !== null) {
          val = JSON.stringify(val);
        }
        if (typeof val === "string") {
          val = `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      });
      csvRows.push(values.join(","));
    }
  
    return csvRows.join("\n");
  }
  