const EnumLoadType = {
  WEIGHT: "1 - Peso",
  INVOICE_VALUE: "2 - Valor da nota",
  VOLUME: "3 - Volume",
} as const;

const EnumLoadTypeCaption = {
  [EnumLoadType.WEIGHT]: "1 - Peso",
  [EnumLoadType.INVOICE_VALUE]: "2 - Valor da nota",
  [EnumLoadType.VOLUME]: "3 - Volume",
} as const satisfies Record<EnumLoadTypeValue, string>;

const EnumLoadTypeOptions = Object.values(EnumLoadType).map((value) => ({
  value,
  caption: EnumLoadTypeCaption[value],
}));

type EnumLoadTypeKey = keyof typeof EnumLoadType;
type EnumLoadTypeValue = (typeof EnumLoadType)[EnumLoadTypeKey];

export {
  EnumLoadType,
  EnumLoadTypeCaption,
  type EnumLoadTypeKey,
  EnumLoadTypeOptions,
  type EnumLoadTypeValue,
};
