const EnumPriceTableType = {
  PRICE: "Preço",
  TRANSFER: "Transferência",
  INTERMEDIATION: "Intermediação",
} as const;

const EnumPriceTableTypeCaption = {
  [EnumPriceTableType.PRICE]: "Preço",
  [EnumPriceTableType.TRANSFER]: "Transferência",
  [EnumPriceTableType.INTERMEDIATION]: "Intermediação",
} as const satisfies Record<EnumPriceTableTypeValue, string>;

const EnumPriceTableTypeOptions = Object.values(EnumPriceTableType).map((value) => ({
  value,
  caption: EnumPriceTableTypeCaption[value],
}));

type EnumPriceTableTypeKey = keyof typeof EnumPriceTableType;
type EnumPriceTableTypeValue = (typeof EnumPriceTableType)[EnumPriceTableTypeKey];

export {
  EnumPriceTableType,
  EnumPriceTableTypeCaption,
  type EnumPriceTableTypeKey,
  EnumPriceTableTypeOptions,
  type EnumPriceTableTypeValue,
};
