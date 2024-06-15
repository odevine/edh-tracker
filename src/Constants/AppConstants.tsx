interface DeckType {
  label: string;
  value: string;
}

export const DECK_TYPES: DeckType[] = [
  { label: "precon/precon(u)", value: "precon" },
  { label: "constructed", value: "constructed" },
];

export const LOCAL_STORAGE_VERSION = 3;
