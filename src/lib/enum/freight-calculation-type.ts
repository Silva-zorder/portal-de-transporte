const EnumFreightCalculationType = {
  REAL_WEIGHT: "Peso real",
  CUBED_WEIGHT: "Peso cubado",
  HIGHEST_WEIGHT: "Maior peso",
} as const;

const EnumFreightCalculationTypeCaption = {
  [EnumFreightCalculationType.REAL_WEIGHT]: "Peso real",
  [EnumFreightCalculationType.CUBED_WEIGHT]: "Peso cubado",
  [EnumFreightCalculationType.HIGHEST_WEIGHT]: "Maior peso",
} as const satisfies Record<EnumFreightCalculationTypeValue, string>;

const EnumFreightCalculationTypeOptions = Object.values(EnumFreightCalculationType).map((value) => ({
  value,
  caption: EnumFreightCalculationTypeCaption[value],
}));

type EnumFreightCalculationTypeKey = keyof typeof EnumFreightCalculationType;
type EnumFreightCalculationTypeValue = (typeof EnumFreightCalculationType)[EnumFreightCalculationTypeKey];

export {
  EnumFreightCalculationType,
  EnumFreightCalculationTypeCaption,
  type EnumFreightCalculationTypeKey,
  EnumFreightCalculationTypeOptions,
  type EnumFreightCalculationTypeValue,
};
