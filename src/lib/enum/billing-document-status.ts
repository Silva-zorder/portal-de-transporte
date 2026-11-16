const EnumBillingDocumentStatus = {
  SENT: "Enviado",
  PAID: "Pago",
  PENDING: "Pendente",
} as const;

const EnumBillingDocumentStatusCaption = {
  [EnumBillingDocumentStatus.SENT]: "Enviado",
  [EnumBillingDocumentStatus.PAID]: "Pago",
  [EnumBillingDocumentStatus.PENDING]: "Pendente",
} as const satisfies Record<EnumBillingDocumentStatusValue, string>;

const EnumBillingDocumentStatusOptions = Object.values(EnumBillingDocumentStatus).map((value) => ({
  value,
  caption: EnumBillingDocumentStatusCaption[value],
}));

type EnumBillingDocumentStatusKey = keyof typeof EnumBillingDocumentStatus;
type EnumBillingDocumentStatusValue = (typeof EnumBillingDocumentStatus)[EnumBillingDocumentStatusKey];

export {
  EnumBillingDocumentStatus,
  EnumBillingDocumentStatusCaption,
  type EnumBillingDocumentStatusKey,
  EnumBillingDocumentStatusOptions,
  type EnumBillingDocumentStatusValue,
};
