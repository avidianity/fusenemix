interface Error {
  toString(indentLevel?: number): string;
  toJSON(): Record<string, any>;
}
