const EnumMongoSyncStatus = {
  DONE: "Concluída",
  RUNNING: "Em andamento",
  FAILED: "Erro",
} as const;

const EnumMongoSyncStatusCaption = {
  [EnumMongoSyncStatus.DONE]: "Concluída",
  [EnumMongoSyncStatus.RUNNING]: "Em andamento",
  [EnumMongoSyncStatus.FAILED]: "Erro",
} as const satisfies Record<EnumMongoSyncStatusValue, string>;

const EnumMongoSyncStatusOptions = Object.values(EnumMongoSyncStatus).map((value) => ({
  value,
  caption: EnumMongoSyncStatusCaption[value],
}));

type EnumMongoSyncStatusKey = keyof typeof EnumMongoSyncStatus;
type EnumMongoSyncStatusValue = (typeof EnumMongoSyncStatus)[EnumMongoSyncStatusKey];

export {
  EnumMongoSyncStatus,
  EnumMongoSyncStatusCaption,
  type EnumMongoSyncStatusKey,
  EnumMongoSyncStatusOptions,
  type EnumMongoSyncStatusValue,
};
