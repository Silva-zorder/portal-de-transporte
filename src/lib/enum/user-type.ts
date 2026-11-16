const EnumUserType = {
  COGNITO: "Cognito",
  MASTER: "Master",
} as const;

const EnumUserTypeCaption = {
  [EnumUserType.COGNITO]: "Cognito",
  [EnumUserType.MASTER]: "Master",
} as const satisfies Record<EnumUserTypeValue, string>;

const EnumUserTypeOptions = Object.values(EnumUserType).map((value) => ({
  value,
  caption: EnumUserTypeCaption[value],
}));

type EnumUserTypeKey = keyof typeof EnumUserType;
type EnumUserTypeValue = (typeof EnumUserType)[EnumUserTypeKey];

export {
  EnumUserType,
  EnumUserTypeCaption,
  type EnumUserTypeKey,
  EnumUserTypeOptions,
  type EnumUserTypeValue,
};
