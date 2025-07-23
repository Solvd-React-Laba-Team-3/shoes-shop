import { LabeledTextfield, Select } from '@/components/ui';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

type FormData = {
  productName: string;
  price: string;
  gender: string;
};

export default function EditPage() {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      productName: '',
      price: '',
      gender: 'Male',
    },
  });

  const onSubmit = (data: FormData) => {
    console.log('Form Data:', data);
  };

  return (
    <Box>
      <Typography variant="h2">Edit product</Typography>
      <Typography variant="caption">
        Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in
        laying out print, graphic or web designs...
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          {/* Replace this with your RHF-compatible text field if needed */}
          <LabeledTextfield
            label="Product name"
            placeholder="Nike Air Max 90"
          />
          <LabeledTextfield label="Price" placeholder="$160" />

          <Box display="flex" gap={2}>
            {/* First Gender Select */}
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <FormControl
                  variant="outlined"
                  sx={{ maxWidth: '210px', width: '100%' }}
                >
                  <InputLabel id="gender-label-1">Gender</InputLabel>
                  <Select {...field} labelId="gender-label-1" label="Gender">
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </Select>
                </FormControl>
              )}
            />

            {/* Second Gender Select — uses same field (duplicate) */}
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <FormControl
                  variant="outlined"
                  sx={{ maxWidth: '210px', width: '100%' }}
                >
                  <InputLabel id="gender-label-2">Gender</InputLabel>
                  <Select {...field} labelId="gender-label-2" label="Gender">
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Box>
        </Stack>
      </form>
    </Box>
  );
}
