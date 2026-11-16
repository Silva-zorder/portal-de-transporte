const EnumMarketplace = {
  MERCADO_LIVRE: "Mercado Livre",
  SHOPEE: "Shopee",
  AMAZON: "Amazon",
  MAGALU: "Magalu",
} as const;

const EnumMarketplaceCaption = {
  [EnumMarketplace.MERCADO_LIVRE]: "Mercado Livre",
  [EnumMarketplace.SHOPEE]: "Shopee",
  [EnumMarketplace.AMAZON]: "Amazon",
  [EnumMarketplace.MAGALU]: "Magalu",
} as const satisfies Record<EnumMarketplaceValue, string>;

const EnumMarketplaceOptions = Object.values(EnumMarketplace).map((value) => ({
  value,
  caption: EnumMarketplaceCaption[value],
}));

type EnumMarketplaceKey = keyof typeof EnumMarketplace;
type EnumMarketplaceValue = (typeof EnumMarketplace)[EnumMarketplaceKey];

export {
  EnumMarketplace,
  EnumMarketplaceCaption,
  type EnumMarketplaceKey,
  EnumMarketplaceOptions,
  type EnumMarketplaceValue,
};
