import type { ResultLine } from '@/types';

export type RootStackParamList = {
  Home: undefined;
  Calculator: { calculatorId: string };
  Paywall: undefined;
  Settings: undefined;
  Privacy: undefined;
  Projects: undefined;
  ProjectDetail: { projectId: string };
  SaveToProject: {
    calcId: string;
    calcTitle: string;
    values: Record<string, number>;
    results: ResultLine[];
  };
};
