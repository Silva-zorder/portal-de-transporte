const EnumCarrierApiType = {
  JT: "J&T Express",
  JADLOG: "Jadlog",
  CORREIOS: "Correios",
  LOGGI: "Loggi",
  MELHOR_ENVIO: "Melhor Envio",
} as const;

const EnumCarrierApiTypeCaption = {
  [EnumCarrierApiType.JT]: "J&T Express",
  [EnumCarrierApiType.JADLOG]: "Jadlog",
  [EnumCarrierApiType.CORREIOS]: "Correios",
  [EnumCarrierApiType.LOGGI]: "Loggi",
  [EnumCarrierApiType.MELHOR_ENVIO]: "Melhor Envio",
} as const satisfies Record<EnumCarrierApiTypeValue, string>;

const EnumCarrierApiTypeOptions = Object.values(EnumCarrierApiType).map((value) => ({
  value,
  caption: EnumCarrierApiTypeCaption[value],
}));

type EnumCarrierApiTypeKey = keyof typeof EnumCarrierApiType;
type EnumCarrierApiTypeValue = (typeof EnumCarrierApiType)[EnumCarrierApiTypeKey];

export {
  EnumCarrierApiType,
  EnumCarrierApiTypeCaption,
  type EnumCarrierApiTypeKey,
  EnumCarrierApiTypeOptions,
  type EnumCarrierApiTypeValue,
};
