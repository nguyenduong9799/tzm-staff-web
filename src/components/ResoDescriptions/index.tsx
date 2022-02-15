import { InfoOutlined } from '@mui/icons-material';
import { Box, Grid, Stack, StackProps, Tooltip, Typography } from '@mui/material';
import { TTableColumn } from '../../types/table';
import Label from 'components/Label';
import { get } from 'lodash';
import React, { ReactElement } from 'react';
import { fDate, fDateTime } from 'utils/formatTime';
import { formatCurrency } from 'utils/utils';
import { fNumber } from 'utils/formatNumber';

export type ResoDescriptionColumnType<T> = TTableColumn<T> & {
  span?: number;
  tooltip?: string;
};

export const renderText = (
  valueType: TTableColumn['valueType'],
  data: any,
  formatProps: any = {}
) => {
  switch (valueType) {
    case 'date':
      return fDate(data);
    case 'time':
      return fDate(data, 'HH:mm');
    case 'datetime':
      return fDateTime(data);
    case 'digit':
      return fNumber(data);
    case 'money':
      return formatCurrency(data);
    default:
      return data;
  }
};

export interface ResoDescriptionsProps<T extends object = {}> {
  children?: React.ReactNode;
  title?: React.ReactNode;
  extra?: React.ReactNode;
  /** Column must be < 12 (Grid size) */
  column?: number;
  layout?: 'row' | 'column';
  colon?: boolean;
  columns: ResoDescriptionColumnType<T>[];
  datasource?: any;
  labelProps?: StackProps;
}

const ResoDescriptions = ({
  title,
  extra,
  column = 3,
  columns,
  colon = true,
  datasource = {},
  layout = 'row',
  labelProps = {},
}: ResoDescriptionsProps) => {
  const renderRows = () => {
    const rows: ReactElement[] = [];

    columns?.forEach((columnConfig, idx) => {
      const gridSpan = Math.floor((12 * (columnConfig.span ?? 1)) / column);

      const label = <Typography>{columnConfig.title}</Typography>;
      const dataIndex = columnConfig.dataIndex ?? '';
      let cell;

      if (typeof columnConfig.render === 'function') {
        cell = columnConfig.render(get(datasource, dataIndex, '-'), datasource, idx) ?? '-';
      } else {
        if (columnConfig.valueEnum) {
          const opt = columnConfig.valueEnum?.find(
            (opt) => opt.value === get(datasource, dataIndex)
          );

          const optLabel = opt?.label ?? get(datasource, dataIndex, '-');

          cell = (
            <Label color={(opt?.color as any) ?? 'default'}>
              <Typography variant="subtitle2" noWrap>
                {optLabel}
              </Typography>
            </Label>
          );
        } else {
          cell = (
            <Typography variant="subtitle2" noWrap>
              {dataIndex === 'index'
                ? idx + 1
                : renderText(
                    columnConfig.valueType,
                    get(datasource, dataIndex) ?? '-',
                    columnConfig.formatProps
                  )}
            </Typography>
          );
        }
      }

      rows.push(
        <Grid item xs={gridSpan}>
          <Stack direction={layout} spacing={1}>
            <Stack direction="row" alignItems="center" {...labelProps}>
              {label}
              {columnConfig.tooltip && (
                <Tooltip title={columnConfig.tooltip} placement="right" arrow>
                  <InfoOutlined sx={{ width: 14, height: 14 }} />
                </Tooltip>
              )}
              {colon && ':'}
            </Stack>
            <Box>{cell}</Box>
          </Stack>
        </Grid>
      );
    });

    return rows;
  };

  const descriptionTitle = React.isValidElement(title) ? (
    title
  ) : (
    <Typography variant="h5">{title}</Typography>
  );

  return (
    <Box>
      <Stack spacing={1} pb={2}>
        {descriptionTitle}
        {extra}
      </Stack>
      <Grid container spacing={2}>
        {/* ROWS */}
        {renderRows()}
      </Grid>
    </Box>
  );
};

export default ResoDescriptions;
