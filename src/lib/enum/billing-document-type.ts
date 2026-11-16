const EnumBillingDocumentType = {
  NFSE: "NFS-e",
  BOLETO: "Boleto",
} as const;

const EnumBillingDocumentTypeCaption = {
  [EnumBillingDocumentType.NFSE]: "NFS-e",
  [EnumBillingDocumentType.BOLETO]: "Boleto",
} as const satisfies Record<EnumBillingDocumentTypeValue, string>;

const EnumBillingDocumentTypeOptions = Object.values(EnumBillingDocumentType).map((value) => ({
  value,
  caption: EnumBillingDocumentTypeCaption[value],
}));

type EnumBillingDocumentTypeKey = keyof typeof EnumBillingDocumentType;
type EnumBillingDocumentTypeValue = (typeof EnumBillingDocumentType)[EnumBillingDocumentTypeKey];

export {
  EnumBillingDocumentType,
  EnumBillingDocumentTypeCaption,
  type EnumBillingDocumentTypeKey,
  EnumBillingDocumentTypeOptions,
  type EnumBillingDocumentTypeValue,
};
