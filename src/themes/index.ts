import { system7 } from "./system7";
import { macosx } from "./macosx";
import { xp } from "./xp";
import { win98 } from "./win98";
import { timeless } from "./timeless";
import { OsTheme, OsThemeId } from "./types";

export const themes: Record<OsThemeId, OsTheme> = {
  system7,
  macosx,
  xp,
  win98,
  timeless,
};

export function getTheme(id: OsThemeId): OsTheme {
  return themes[id];
}

export type { OsTheme, OsThemeId } from "./types";
