import { createContext } from 'react';

export declare interface GraphqlOptions {
  url: string;
}

export const GraphqlContext = createContext<GraphqlOptions | void>(void 0)
export const GraphqlProvider = GraphqlContext.Provider