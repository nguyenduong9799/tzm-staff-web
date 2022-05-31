/* eslint-disable react/prop-types */
import { Box, Stack, TextField } from '@mui/material';
import { DatePickerProps, DateRangePicker } from '@mui/lab';
import useLocales from 'hooks/useLocales';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type Props = {
  name: string;
  label?: string;
  rules?: any;
  defaultValue?: any;
};

const DateRangePickerField: React.FC<Props & Partial<DatePickerProps>> = ({
  name,
  label = null,
  rules,
  defaultValue = [null, null],
  ...props
}) => {
  const { control } = useFormContext();
  function formatDate(date: any) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('/');
  }
  return (
    <Controller
      render={({ field, fieldState }) => (
        <DateRangePicker
         // inputFormat="yyyy/MM/dd"
          calendars={2}
          {...field}
           value={field.value ?? [null, null]}
          renderInput={(startProps, endProps) => (
            <Stack width="100%" spacing={2} direction="row">
              {console.log(control)}
              <Box flex={1}>
                <TextField size="small" fullWidth {...startProps} label="From" placeholder="From" />
              </Box>
              <Box flex={1}>
                <TextField size="small" fullWidth {...endProps} label="To" placeholder="To" />
              </Box>
            </Stack>
          )}
        />
      )}
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
    />
  );
};

export default DateRangePickerField;
