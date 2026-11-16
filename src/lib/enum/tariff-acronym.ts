const EnumTariffAcronym = {
  AC_CAP: "AC-CAP",
  SC_CAP: "SC-CAP",
  SC_INT: "SC-INT",
  PR_CAP: "PR-CAP",
  PR_INT: "PR-INT",
  RS_CAP: "RS-CAP",
  RS_INT: "RS-INT",
  SP_CAP: "SP-CAP",
  SP_INT: "SP-INT",
  RJ_CAP: "RJ-CAP",
  RJ_INT: "RJ-INT",
} as const;

const EnumTariffAcronymCaption = {
  [EnumTariffAcronym.AC_CAP]: "AC-CAP",
  [EnumTariffAcronym.SC_CAP]: "SC-CAP",
  [EnumTariffAcronym.SC_INT]: "SC-INT",
  [EnumTariffAcronym.PR_CAP]: "PR-CAP",
  [EnumTariffAcronym.PR_INT]: "PR-INT",
  [EnumTariffAcronym.RS_CAP]: "RS-CAP",
  [EnumTariffAcronym.RS_INT]: "RS-INT",
  [EnumTariffAcronym.SP_CAP]: "SP-CAP",
  [EnumTariffAcronym.SP_INT]: "SP-INT",
  [EnumTariffAcronym.RJ_CAP]: "RJ-CAP",
  [EnumTariffAcronym.RJ_INT]: "RJ-INT",
} as const satisfies Record<EnumTariffAcronymValue, string>;

const EnumTariffAcronymOptions = Object.values(EnumTariffAcronym).map((value) => ({
  value,
  caption: EnumTariffAcronymCaption[value],
}));

type EnumTariffAcronymKey = keyof typeof EnumTariffAcronym;
type EnumTariffAcronymValue = (typeof EnumTariffAcronym)[EnumTariffAcronymKey];

export {
  EnumTariffAcronym,
  EnumTariffAcronymCaption,
  type EnumTariffAcronymKey,
  EnumTariffAcronymOptions,
  type EnumTariffAcronymValue,
};
