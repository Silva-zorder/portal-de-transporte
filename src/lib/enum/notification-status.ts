const EnumNotificationStatus = {
  SENT: "Enviado",
  FAILED: "Falha",
} as const;

const EnumNotificationStatusCaption = {
  [EnumNotificationStatus.SENT]: "Enviado",
  [EnumNotificationStatus.FAILED]: "Falha",
} as const satisfies Record<EnumNotificationStatusValue, string>;

const EnumNotificationStatusOptions = Object.values(EnumNotificationStatus).map((value) => ({
  value,
  caption: EnumNotificationStatusCaption[value],
}));

type EnumNotificationStatusKey = keyof typeof EnumNotificationStatus;
type EnumNotificationStatusValue = (typeof EnumNotificationStatus)[EnumNotificationStatusKey];

export {
  EnumNotificationStatus,
  EnumNotificationStatusCaption,
  type EnumNotificationStatusKey,
  EnumNotificationStatusOptions,
  type EnumNotificationStatusValue,
};
