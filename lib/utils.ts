import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseStringify = (value: unknown) => {
  return JSON.parse(JSON.stringify(value));
};

export const formatCurrency = (price: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(price);
};

export const formatDate = (date: string) => {
  const d = new Date(date);
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

export async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const copyToClipboard = async (textToCopy: string) => {
  try {
    const blob = new Blob([textToCopy], { type: "text/html" });
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/html": blob,
        "text/plain": new Blob([textToCopy], { type: "text/plain" }),
      }),
    ]);
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
};
