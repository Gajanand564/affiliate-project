export const AMAZON_STOREFRONT_URL = import.meta.env.VITE_AMAZON_STOREFRONT_URL || "";
export const AMAZON_STOREFRONT_NAME = import.meta.env.VITE_AMAZON_STOREFRONT_NAME || "Gajanand";

export const hasAmazonStorefront = Boolean(AMAZON_STOREFRONT_URL);
