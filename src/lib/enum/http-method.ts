const EnumHttpMethod = {
  GET: "GET",
  POST: "POST",
  DELETE: "DELETE",
} as const;

const EnumHttpMethodCaption = {
  [EnumHttpMethod.GET]: "GET",
  [EnumHttpMethod.POST]: "POST",
  [EnumHttpMethod.DELETE]: "DELETE",
} as const satisfies Record<EnumHttpMethodValue, string>;

const EnumHttpMethodOptions = Object.values(EnumHttpMethod).map((value) => ({
  value,
  caption: EnumHttpMethodCaption[value],
}));

type EnumHttpMethodKey = keyof typeof EnumHttpMethod;
type EnumHttpMethodValue = (typeof EnumHttpMethod)[EnumHttpMethodKey];

export {
  EnumHttpMethod,
  EnumHttpMethodCaption,
  type EnumHttpMethodKey,
  EnumHttpMethodOptions,
  type EnumHttpMethodValue,
};
