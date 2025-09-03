import type { Product, ProductDetailType } from "src/Types/product.ts";
import { regexPatterns } from "../Data/globalVariables.tsx";

export function getDiscountedPrice(originalPrice: string, discountPercentage: string): string {
  const discountAmount = (Number(originalPrice) * Number(discountPercentage) / 100);
  const discountedPrice = Number(originalPrice) - discountAmount;
  return discountedPrice.toFixed(2);
}

export function formatePrice(price: string): string {
  // console.log("Formatting price:", price);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(getNumericPrice(price));
}

export function getNumericPrice(num: string | number): number {
  if (num == null) {
    return NaN;
  }
  const str = String(num).replace(/[^0-9.\-]/g, "");
  return parseFloat(str);
}

export const formatTwoDigits = (num: number) => String(num).padStart(2, "0");

export function capitalize(str: string) {
  str = String(str);

  const firstChar = str[0]?.toUpperCase();
  const rest = str.slice(1)?.toLowerCase();

  return firstChar + rest;
}

export function camelCase(str: string) {
  const wordSeparatorRegex = regexPatterns.words;
  const words = String(str)
    .toLowerCase()
    .replace(wordSeparatorRegex, " ")
    .trim()
    .split(/\s+/);

  const camelCased = words.map((word, index) =>
    index === 0 ? word : capitalize(word)
  );

  return camelCased.join("");
}

export function setAfterDiscountKey(product: Product | ProductDetailType) {
  const discountedPrice = getDiscountedPrice(product.price, product.discount);
  const formattedDiscountedPrice = formatePrice(discountedPrice);
  product.afterDiscount = formattedDiscountedPrice;
}

export function setFormattedPrice(product: Product | ProductDetailType) {
  const formattedPrice = formatePrice(product.price);
  product.price = formattedPrice;
}

export function getSubTotal(cartProducts: Product[], key: keyof Product = "quantity") {
  const total = cartProducts?.reduce((acc, product) => {
    const priceAfterDiscount = getNumericPrice(product?.afterDiscount);
    const quantity = +product?.[key];
    const quantityPrice = quantity * priceAfterDiscount;
    return (acc += quantityPrice);
  }, 0);

  return total.toFixed(2);
}

export function formatDateTime(
  isoString: string,
  formatType: 'full' | 'dateOnly' | 'timeOnly' | 'short' = 'full',
  locale: string = 'en-US' // Mặc định là tiếng Anh
): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    const options: Intl.DateTimeFormatOptions = {};

    switch (formatType) {
      case 'full':
        options.year = 'numeric';
        options.month = 'long';
        options.day = 'numeric';
        options.hour = '2-digit';
        options.minute = '2-digit';
        break;
      case 'dateOnly':
        options.year = 'numeric';
        options.month = 'long';
        options.day = 'numeric';
        break;
      case 'timeOnly':
        options.hour = '2-digit';
        options.minute = '2-digit';
        break;
      case 'short':
        options.year = '2-digit';
        options.month = '2-digit';
        options.day = '2-digit';
        break;
    }

    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch (error) {
    return "Invalid Date";
  }
}