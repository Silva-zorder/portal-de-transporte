const EnumLogAction = {
  CREATE: "Nova",
  UPDATE: "Alteração",
  REMOVE: "Exclusão",
} as const;

const EnumLogActionCaption = {
  [EnumLogAction.CREATE]: "Nova",
  [EnumLogAction.UPDATE]: "Alteração",
  [EnumLogAction.REMOVE]: "Exclusão",
} as const satisfies Record<EnumLogActionValue, string>;

const EnumLogActionOptions = Object.values(EnumLogAction).map((value) => ({
  value,
  caption: EnumLogActionCaption[value],
}));

type EnumLogActionKey = keyof typeof EnumLogAction;
type EnumLogActionValue = (typeof EnumLogAction)[EnumLogActionKey];

export {
  EnumLogAction,
  EnumLogActionCaption,
  type EnumLogActionKey,
  EnumLogActionOptions,
  type EnumLogActionValue,
};
