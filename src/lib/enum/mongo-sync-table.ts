const EnumMongoSyncTable = {
  CLIENT_SERVICE: "VW_Client_Service",
  PRICE_TABLE: "VW_Price_Table",
} as const;

const EnumMongoSyncTableCaption = {
  [EnumMongoSyncTable.CLIENT_SERVICE]: "VW_Client_Service",
  [EnumMongoSyncTable.PRICE_TABLE]: "VW_Price_Table",
} as const satisfies Record<EnumMongoSyncTableValue, string>;

const EnumMongoSyncTableOptions = Object.values(EnumMongoSyncTable).map((value) => ({
  value,
  caption: EnumMongoSyncTableCaption[value],
}));

type EnumMongoSyncTableKey = keyof typeof EnumMongoSyncTable;
type EnumMongoSyncTableValue = (typeof EnumMongoSyncTable)[EnumMongoSyncTableKey];

export {
  EnumMongoSyncTable,
  EnumMongoSyncTableCaption,
  type EnumMongoSyncTableKey,
  EnumMongoSyncTableOptions,
  type EnumMongoSyncTableValue,
};
