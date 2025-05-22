export const formatPanelDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

function mixColorWithWhite(hex, percentage) {
  console.log(hex);
  if (hex === undefined || hex === null) return "#ffffff";
  const whitePercentage = (100 - percentage) / 100;

  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  // Mix each channel with white
  r = Math.floor(r + (255 - r) * whitePercentage);
  g = Math.floor(g + (255 - g) * whitePercentage);
  b = Math.floor(b + (255 - b) * whitePercentage);
  console.log(
    `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
  );
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export default mixColorWithWhite;

export const formatPhoneNumber = (phoneNumber) => {
  const cleaned = phoneNumber.replace(/\D/g, "");

  if (cleaned.length !== 10) {
    return phoneNumber;
  }

  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return "--/--/----";
  const date = new Date(dateString);

  console.log("Date Finder ===>", date);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  console.log("Date Finder 2 ===>", day);

  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

export function created_at_format(string_date) {
  const date = new Date(string_date);
  const options = {
    timeZone: "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  const formattedDateTime = date.toLocaleString("en-US", options);
  return formattedDateTime;
}

// Parse dates in the format M/DD/YYYY to YYYY-MM-DD for input fields
export const formatDateForInput = (dateString) => {
  if (!dateString) return "";

  // If it's already a date object
  if (dateString instanceof Date && !isNaN(dateString)) {
    return dateString.toISOString().split("T")[0];
  }

  // If it's a string in format like "3/03/2025"
  if (typeof dateString === "string") {
    const parts = dateString.split("/");
    if (parts.length === 3) {
      // Make sure month is two digits
      const month = parts[0].padStart(2, "0");
      const day = parts[1];
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
  }

  // As a fallback, try to parse with the Date constructor and format
  try {
    const date = new Date(dateString);
    if (!isNaN(date)) {
      return date.toISOString().split("T")[0];
    }
  } catch (e) {
    console.error("Could not parse date:", dateString);
  }

  return "";
};
export const formatDateForInputTreatment = (dateString) => {
  if (!dateString) return "";

  if (dateString instanceof Date && !isNaN(dateString)) {
    return dateString.toISOString().split("T")[0];
  }

  // If it's a string in format like "3/03/2025"
  if (typeof dateString === "string") {
    const parts = dateString.split("/");
    if (parts.length === 3) {
      // Make sure month is two digits
      const month = parts[0].padStart(2, "0");
      const day = parts[1];
      const year = parts[2];
      return `${month}/${day}/${year}`;
    }
  }

  // As a fallback, try to parse with the Date constructor and format
  try {
    const date = new Date(dateString);
    if (!isNaN(date)) {
      return date.toISOString().split("T")[0];
    }
  } catch (e) {
    console.error("Could not parse date:", dateString);
  }

  return "";
};

export const formatDateForInputTreatmentShowcase = (dateString) => {
  if (!dateString) return "";
  console.log(dateString);
  if (dateString instanceof Date && !isNaN(dateString)) {
    return dateString.toISOString().split("T")[0];
  }

  // If it's a string in format like "3/03/2025"
  if (typeof dateString === "string") {
    const parts = dateString.split("/");
    if (parts.length === 3) {
      // Make sure month is two digits
      const month = parseInt(parts[0], 10).toString(); // Remove leading zero
      const day = parseInt(parts[1], 10).toString();
      const year = parts[2];
      return `${month}/${day}/${year}`;
    }
  }

  // As a fallback, try to parse with the Date constructor and format
  try {
    const date = new Date(dateString);
    if (!isNaN(date)) {
      return date.toISOString().split("T")[0];
    }
  } catch (e) {
    console.error("Could not parse date:", dateString);
  }

  return "";
};
export function created_at_format_verification(string_date) {
  if (!string_date) return "";
  const date = new Date(string_date);

  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1; // getUTCMonth() is zero-based
  const day = String(date.getUTCDate()).padStart(2, "0"); // Always two digits
  const hours = date.getUTCHours() % 12 || 12; // Convert to 12-hour format
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const ampm = date.getUTCHours() >= 12 ? "PM" : "AM";

  return `${month}/${day}/${year}, ${hours}:${minutes} ${ampm}`;
}

export const formatDateForInputTreatmentDatesModal = (dateString) => {
  if (!dateString) return "";

  // If it's already a date object
  console.log(dateString);
  if (dateString instanceof Date && !isNaN(dateString)) {
    return dateString.toISOString().split("T")[0];
  }

  // If it's a string in format like "3/03/2025"
  if (typeof dateString === "string") {
    const parts = dateString.split("-");
    if (parts.length === 3) {
      // Make sure month is two digits
      const month = parseInt(parts[1], 10).toString(); // Remove leading zero
      const day = parseInt(parts[2], 10).toString();
      const year = parts[0];
      return `${month}/${day}/${year}`;
    }
  }

  // As a fallback, try to parse with the Date constructor and format
  try {
    const date = new Date(dateString);
    if (!isNaN(date)) {
      // Format with month without leading zeros
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString(); // getMonth() is zero-based
      const day = date.getDate().toString();
      return `${month}/${day}/${year}`;
    }
  } catch (e) {
    console.error("Could not parse date:", dateString);
  }

  return "";
};

export const formatDateForInputDisplayVisits = (dateString) => {
  if (!dateString) return "";

  // If it's already a date object
  if (dateString instanceof Date && !isNaN(dateString)) {
    return dateString.toISOString().split("T")[0];
  }

  // If it's a string in format like "3/03/2025"
  if (typeof dateString === "string") {
    const parts = dateString.split("/");
    if (parts.length === 3) {
      // Make sure month is two digits
      const month = parts[0].padStart(2, "0");
      const day = parts[1];
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
  }

  // As a fallback, try to parse with the Date constructor and format
  try {
    const date = new Date(dateString);
    if (!isNaN(date)) {
      return date.toISOString().split("T")[0];
    }
  } catch (e) {
    console.error("Could not parse date:", dateString);
  }

  return "";
};

export const formatDateVisitsDates = (dateString) => {
  if (!dateString) return "--/--/----";

  // Parse the input date string components directly
  // For a string like "2020-04-27"
  const [year, month, day] = dateString.split("-").map(Number);

  // Create a UTC date directly from the components
  // Note: months in JavaScript are 0-indexed, so we subtract 1 from the month
  const utcDate = new Date(Date.UTC(year, month - 1, day));

  console.log("Original dateString:", dateString);
  console.log("UTC date object:", utcDate);

  // Extract UTC components to ensure consistent display
  const displayMonth = utcDate.getUTCMonth() + 1; // Add 1 because getUTCMonth() returns 0-11
  const displayDay = utcDate.getUTCDate();
  const displayYear = utcDate.getUTCFullYear();

  // Return formatted date
  return `${displayMonth}/${displayDay}/${displayYear}`;
};
