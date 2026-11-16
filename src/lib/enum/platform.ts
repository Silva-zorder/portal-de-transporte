const EnumPlatform = {
  MAGAZORD: "MZ",
  TRAY: "Tray",
  NUVEMSHOP: "Nuvemshop",
} as const;

const EnumPlatformCaption = {
  [EnumPlatform.MAGAZORD]: "MZ",
  [EnumPlatform.TRAY]: "Tray",
  [EnumPlatform.NUVEMSHOP]: "Nuvemshop",
} as const satisfies Record<EnumPlatformValue, string>;

const EnumPlatformOptions = Object.values(EnumPlatform).map((value) => ({
  value,
  caption: EnumPlatformCaption[value],
}));

type EnumPlatformKey = keyof typeof EnumPlatform;
type EnumPlatformValue = (typeof EnumPlatform)[EnumPlatformKey];

export {
  EnumPlatform,
  EnumPlatformCaption,
  type EnumPlatformKey,
  EnumPlatformOptions,
  type EnumPlatformValue,
};
