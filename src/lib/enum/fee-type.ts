const EnumFeeType = {
  TOLL: "2 - Pedágio",
  GRIS: "3 - Gris",
  ADVALOREM: "4 - Advalorem",
  ICMS: "8 - ICMS",
} as const;

const EnumFeeTypeCaption = {
  [EnumFeeType.TOLL]: "2 - Pedágio",
  [EnumFeeType.GRIS]: "3 - Gris",
  [EnumFeeType.ADVALOREM]: "4 - Advalorem",
  [EnumFeeType.ICMS]: "8 - ICMS",
} as const satisfies Record<EnumFeeTypeValue, string>;

const EnumFeeTypeOptions = Object.values(EnumFeeType).map((value) => ({
  value,
  caption: EnumFeeTypeCaption[value],
}));

type EnumFeeTypeKey = keyof typeof EnumFeeType;
type EnumFeeTypeValue = (typeof EnumFeeType)[EnumFeeTypeKey];

export {
  EnumFeeType,
  EnumFeeTypeCaption,
  type EnumFeeTypeKey,
  EnumFeeTypeOptions,
  type EnumFeeTypeValue,
};
