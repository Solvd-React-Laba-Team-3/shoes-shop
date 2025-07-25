import {
  Button,
  LabeledTextfield,
  Select,
  ToggleButton,
} from '@/components/ui';
import {
  Box,
  FormControl,
  MenuItem,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import {
  StyledInputLabel,
  StyledDescriptionLabel,
  StyledTextArea,
  StyledAiButton,
} from './EditPageStyles';

type FormData = {
  productName: string;
  price: string;
  gender: string;
  description: string;
  color: string;
  brand: string;
  size: string;
};

export default function EditPage() {
  const { register, control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      productName: '',
      price: '',
      gender: 'Male',
      description: '',
      color: 'Black',
      brand: 'Nike',
      size: '',
    },
  });

  const onSubmit = (data: FormData) => {
    console.log('Form Data:', data);
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <LabeledTextfield
            label="Product name"
            placeholder="Nike Air Max 90"
            {...register('productName')}
          />
        </Box>

        <Box sx={{ margin: '8px 0 20px 0' }}>
          <LabeledTextfield
            label="Price"
            placeholder="$160"
            {...register('price')}
          />
        </Box>

        <Controller
          name="color"
          control={control}
          render={({ field }) => (
            <FormControl variant="outlined">
              <StyledInputLabel id="color-label" shrink variant="outlined">
                Color
              </StyledInputLabel>
              <Select
                {...field}
                labelId="color-label"
                sx={{ mt: '18px', width: '436px', padding: '8px 0' }}
              >
                <MenuItem value="Black">Black</MenuItem>
              </Select>
            </FormControl>
          )}
        />

        <Box display="flex" gap={2} sx={{ margin: '20px 0 14px 0' }}>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <FormControl
                variant="outlined"
                sx={{ maxWidth: '210px', width: '100%' }}
              >
                <StyledInputLabel id="gender-label" shrink>
                  Gender
                </StyledInputLabel>
                <Select {...field} labelId="gender-label" sx={{ mt: '20px' }}>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name="brand"
            control={control}
            render={({ field }) => (
              <FormControl
                variant="outlined"
                sx={{ maxWidth: '210px', width: '100%' }}
              >
                <StyledInputLabel id="brand-label" shrink>
                  Brand
                </StyledInputLabel>
                <Select {...field} labelId="brand-label" sx={{ mt: '20px' }}>
                  <MenuItem value="Nike">Nike</MenuItem>
                  <MenuItem value="Puma">Puma</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Box>

        <Controller
          name="description"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Box sx={{ width: 436 }}>
              <StyledDescriptionLabel>Description</StyledDescriptionLabel>

              <Box sx={{ position: 'relative' }}>
                <StyledTextArea
                  {...field}
                  aria-label="Description"
                  minRows={3}
                  placeholder="Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book. It usually begins with"
                />

                <StyledAiButton />
              </Box>
            </Box>
          )}
        />

        <Box sx={{ marginTop: '8px' }}>
          <Controller
            name="size"
            control={control}
            render={({ field }) => (
              <Box>
                <Typography
                  component="h6"
                  variant="caption"
                  sx={(theme) => ({
                    mb: 0,
                    fontWeight: 500,
                    color: theme.palette.text.secondary,
                  })}
                >
                  Add size
                </Typography>

                <ToggleButtonGroup
                  {...field}
                  exclusive
                  onChange={(_, value) => field.onChange(value)}
                  size="small"
                >
                  {['EU-36', 'EU-37', 'EU-38', 'EU-39', 'EU-40'].map(
                    (size, index, arr) => (
                      <Box
                        key={size}
                        sx={{ mr: index < arr.length - 1 ? 0.39 : 0 }}
                      >
                        <ToggleButton value={size}>{size}</ToggleButton>
                      </Box>
                    )
                  )}
                </ToggleButtonGroup>
              </Box>
            )}
          />
        </Box>

        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </form>
    </Box>
  );
}
