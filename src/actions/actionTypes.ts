export type ActionFunction = (...args: any[]) => any;

export interface ActionFile {
  [key: string]: ActionFunction;
}
