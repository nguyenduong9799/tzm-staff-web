import { ReactElement } from 'react';

type Level = 0 | 1 | 2 | 3 | 4 | 5 | 'max'; // this solves the infinite loop error issue
type NextLevel<Level> = Level extends 0
  ? 1
  : Level extends 1
  ? 2
  : Level extends 2
  ? 3
  : Level extends 3
  ? 4
  : Level extends 4
  ? 5
  : 'max'; // this type enables iterating from 0 to 5, with the end as 'max'

type NestedKeyof<T, L extends Level = 0> = L extends 'max'
  ? never
  : {
      [K in keyof T]: T[K] extends object ? K | NestedKeyof<T[K], NextLevel<L>> : K;
    }[keyof T];

export type TTableColumn<T = void> = {
  title: string | ReactElement;
  dataIndex?: keyof T | 'index' | string[] | [NestedKeyof<T>];
  fixed?: 'left' | 'right' | undefined;
  render?: (value: any, data: T, index: number) => string | JSX.Element | string | undefined;
  renderFormItem?: (columnSetting: TTableColumn<T>, formProps: any) => JSX.Element;
  width?: number | string;
  hideInSearch?: boolean;
  hideInTable?: boolean;
  formatProps?: any;
} & (
  | {
      valueEnum?: TableValueEnum[];
      valueType?: TableValueType;
      formProps?: {
        fullWidth?: boolean;
        [key: string]: any;
      };
    }
  | {
      valueType: 'select';
      valueEnum: TableValueEnum[];
      formProps?: {
        options?: TableValueEnum[];
        [key: string]: any;
      };
    }
);

export type TableValueType =
  | 'text'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'option'
  | 'date'
  | 'datetime'
  | 'dateRange'
  | 'time'
  | 'switch'
  | 'digit'
  | 'money';

type TableValueEnum = {
  label: any;
  value: any;
  color?: string;
};
