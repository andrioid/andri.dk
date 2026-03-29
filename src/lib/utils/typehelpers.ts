type LiteralUnion<T extends string> = T | (string & {});
export type KeysWithSuggestions<T extends object> = LiteralUnion<Extract<keyof T, string>>;