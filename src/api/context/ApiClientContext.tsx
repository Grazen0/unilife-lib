'use client';
import { createContext } from 'react';
import { ApiClient } from '../util/client';

export interface ApiClientContextValue {
  apiClient: ApiClient;
}

export const ApiClientContext = createContext<Partial<ApiClientContextValue>>(
  {},
);
