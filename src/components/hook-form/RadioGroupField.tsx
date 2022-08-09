// form
import { Controller, useFormContext } from 'react-hook-form';
// @mui
import {
  FormControlLabel, FormHelperText, Grid, Radio,
  RadioGroup, RadioGroupProps, Typography
} from '@mui/material';

// ----------------------------------------------------------------------

interface IProps {
  name: string;
  options: any[];
  getOptionLabel?: string[];
}

export default function RadioGroupField({
  name,
  options,
  getOptionLabel,
  ...other
}: IProps & RadioGroupProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <Grid container spacing={1}>
            <Grid item xs={10}>
              <RadioGroup {...field} row {...other}>
                {options.map(({ value, label }) => (
                  <FormControlLabel
                    key={value}
                    value={value}
                    control={<Radio />}
                    label={<Typography fontSize={'1.1rem'}>{label}</Typography>}
                  />
                ))}
              </RadioGroup>

              {!!error && (
                <FormHelperText error sx={{ px: 2 }}>
                  {error.message}
                </FormHelperText>
              )}
            </Grid>
          </Grid>
        </div>
      )}
    />
  );
}
