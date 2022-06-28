/* eslint-disable react/prop-types */
import { Autocomplete, TextField } from '@mui/material';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
interface IProps {
  name: string;
  label?: string;
  defaultValue?: any;
  placeholder?: string;
  rules?: any;
  options: any[];
  getOptionLabel?: (option: any) => string;
  isOptionEqualToValue?: (option: any, value: any) => boolean;
  transformValue?: (value: any) => any;
  TextFieldProps?: any;
  [key: string]: any;
}

export default function AutoCompleteField({
  name,
  label,
  defaultValue,
  placeholder,
  rules,
  TextFieldProps = {},
  ...other
}: IProps) {
  const { control } = useFormContext();
  const { transformValue, multiple, disabled } = other as any;

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={multiple ? [] : ''}
      rules={rules}
      render={({ field, fieldState }) => (
        <Autocomplete
          {...field}
          value={field.value ? field.value : multiple ? [] : null}
          onChange={(event, newValue) => {
            const updateValue = transformValue ? transformValue(newValue) : newValue;
            field.onChange(updateValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              {...other}
              {...TextFieldProps}
              variant="outlined"
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message}
              label={label}
              placeholder={placeholder}
              disabled={disabled}
            />
          )}
          filterOptions={(options, state) => options}
          {...other}
        />
      )}
    />
  );
}
