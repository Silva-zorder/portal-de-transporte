const EnumReconciliationStatus = {
  IN_REVIEW: "Em análise",
  DONE: "Concluída",
} as const;

const EnumReconciliationStatusCaption = {
  [EnumReconciliationStatus.IN_REVIEW]: "Em análise",
  [EnumReconciliationStatus.DONE]: "Concluída",
} as const satisfies Record<EnumReconciliationStatusValue, string>;

const EnumReconciliationStatusOptions = Object.values(EnumReconciliationStatus).map((value) => ({
  value,
  caption: EnumReconciliationStatusCaption[value],
}));

type EnumReconciliationStatusKey = keyof typeof EnumReconciliationStatus;
type EnumReconciliationStatusValue = (typeof EnumReconciliationStatus)[EnumReconciliationStatusKey];

export {
  EnumReconciliationStatus,
  EnumReconciliationStatusCaption,
  type EnumReconciliationStatusKey,
  EnumReconciliationStatusOptions,
  type EnumReconciliationStatusValue,
};
