const EnumCalculationBase = {
  INVOICE_PERCENT: "1 - % da nota",
  FREIGHT_PERCENT: "2 - % do frete",
  FIXED_VALUE: "3 - Valor fixo",
} as const;

const EnumCalculationBaseCaption = {
  [EnumCalculationBase.INVOICE_PERCENT]: "1 - % da nota",
  [EnumCalculationBase.FREIGHT_PERCENT]: "2 - % do frete",
  [EnumCalculationBase.FIXED_VALUE]: "3 - Valor fixo",
} as const satisfies Record<EnumCalculationBaseValue, string>;

const EnumCalculationBaseOptions = Object.values(EnumCalculationBase).map((value) => ({
  value,
  caption: EnumCalculationBaseCaption[value],
}));

type EnumCalculationBaseKey = keyof typeof EnumCalculationBase;
type EnumCalculationBaseValue = (typeof EnumCalculationBase)[EnumCalculationBaseKey];

export {
  EnumCalculationBase,
  EnumCalculationBaseCaption,
  type EnumCalculationBaseKey,
  EnumCalculationBaseOptions,
  type EnumCalculationBaseValue,
};
