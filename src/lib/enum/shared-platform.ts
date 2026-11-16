const EnumSharedPlatform = {
  MAGAZORD: "Magazord",
  MZ_TRAY: "MZ, Tray",
  MZ: "MZ",
} as const;

const EnumSharedPlatformCaption = {
  [EnumSharedPlatform.MAGAZORD]: "Magazord",
  [EnumSharedPlatform.MZ_TRAY]: "MZ, Tray",
  [EnumSharedPlatform.MZ]: "MZ",
} as const satisfies Record<EnumSharedPlatformValue, string>;

const EnumSharedPlatformOptions = Object.values(EnumSharedPlatform).map((value) => ({
  value,
  caption: EnumSharedPlatformCaption[value],
}));

type EnumSharedPlatformKey = keyof typeof EnumSharedPlatform;
type EnumSharedPlatformValue = (typeof EnumSharedPlatform)[EnumSharedPlatformKey];

export {
  EnumSharedPlatform,
  EnumSharedPlatformCaption,
  type EnumSharedPlatformKey,
  EnumSharedPlatformOptions,
  type EnumSharedPlatformValue,
};
