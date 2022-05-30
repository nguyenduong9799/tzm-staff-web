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
  const { translate } = useLocales();

  return (
    <Controller
      render={({ field, fieldState }) => (
        <DateRangePicker
          calendars={2}
          {...field}
          value={field.value ?? [null, null]}
          renderInput={(startProps, endProps) => (
            <Stack width="100%" spacing={2} direction="row">
              <Box flex={1}>
                <TextField
                  size="small"
                  fullWidth
                  {...startProps}
                  label={translate('common.fromTime')}
                  placeholder={translate('common.fromTime')}
                />
              </Box>
              <Box flex={1}>
                <TextField
                  size="small"
                  fullWidth
                  {...endProps}
                  label={translate('common.toTime')}
                  placeholder={translate('common.toTime')}
                />
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
