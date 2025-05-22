// Equivalent of date_custom
export function dateCustom(value) {
  if (!value) return "";
  const date = new Date(value);
  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
}

// Equivalent of date_custom_nozeros_incident
export function dateCustomNoZerosIncident(value) {
  if (!value) return "";
  const date = new Date(value);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

// Equivalent of date_custom_nozeros
export function dateCustomNoZeros(value) {
  if (!value) return "";
  const date = new Date(value);
  return `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}/${date.getFullYear()}`;
}

// Equivalent of time_custom
export function timeCustom(value) {
  if (!value) return "";
  const date = new Date(value);
  return date.toTimeString().split(" ")[0];
}

// Equivalent of time_similar_notes
export function timeSimilarNotes(value) {
  if (!value) return "";
  const date = new Date(value);
  return date
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
    .toLowerCase();
}

// Equivalent of weekday_word
export function weekdayWord(value) {
  const date = new Date(value);
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

// Equivalent of custom_date_format
export function customDateFormat(value) {
  if (!value) return value;
  const date = new Date(value);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

// Equivalent of format_num
export function formatNum(value) {
  if (!value) return "0.00";
  return parseFloat(value)
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, "$&,");
}

// Equivalent of get_item
export function getItem(dictionary, key) {
  return dictionary[key];
}

// Equivalent of compare_dates
export function compareDates(first, second) {
  const firstDate = new Date(first);
  const secondDate = new Date(second);
  return firstDate > secondDate;
}

export function formatDateInputValue(dateObject) {
  if (!dateObject) return "";
  const date = new Date(dateObject);
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
}
