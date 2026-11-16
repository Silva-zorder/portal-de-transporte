const EnumCteStatus = {
  RECONCILED: "Conciliado",
  DIVERGENT: "Divergente",
  PENDING: "Pendente",
} as const;

const EnumCteStatusCaption = {
  [EnumCteStatus.RECONCILED]: "Conciliado",
  [EnumCteStatus.DIVERGENT]: "Divergente",
  [EnumCteStatus.PENDING]: "Pendente",
} as const satisfies Record<EnumCteStatusValue, string>;

const EnumCteStatusOptions = Object.values(EnumCteStatus).map((value) => ({
  value,
  caption: EnumCteStatusCaption[value],
}));

type EnumCteStatusKey = keyof typeof EnumCteStatus;
type EnumCteStatusValue = (typeof EnumCteStatus)[EnumCteStatusKey];

export {
  EnumCteStatus,
  EnumCteStatusCaption,
  type EnumCteStatusKey,
  EnumCteStatusOptions,
  type EnumCteStatusValue,
};
