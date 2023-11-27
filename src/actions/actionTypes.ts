export type ActionFunction = (...args: any[]) => void;

export interface ActionFile {
    [key: string]: ActionFunction
}

