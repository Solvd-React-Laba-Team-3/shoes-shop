import { LabeledTextfield, Select, ToggleButton } from '@/components/ui';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import TextareaAutosize from '@mui/material/TextareaAutosize';

type FormData = {
  productName: string;
  price: string;
  gender: string;
  description: string;
  color: string;
  brand: string;
};

const StyledInputLabel = styled(InputLabel)(() => ({
  marginLeft: '-13px',
  fontSize: '17px',
  fontWeight: 500,
  color: 'rgb(92, 92, 92)',
}));

export default function EditPage() {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      productName: '',
      price: '',
      gender: 'Male',
      description: '',
      color: 'Black',
      brand: 'Nike',
    },
  });

  const onSubmit = (data: FormData) => {
    console.log('Form Data:', data);
  };

  return (
    <Box>
      <Box display={'flex'}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <LabeledTextfield
              label="Product name"
              placeholder="Nike Air Max 90"
            />
            <LabeledTextfield label="Price" placeholder="$160" />

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

            <Box display="flex" gap={2}>
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
                    <Select
                      {...field}
                      labelId="gender-label"
                      sx={{ mt: '20px' }}
                    >
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
                    <Select
                      {...field}
                      labelId="brand-label"
                      sx={{ mt: '20px' }}
                    >
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
                <FormControl sx={{ width: 436 }}>
                  <InputLabel
                    shrink
                    sx={{
                      ml: '-13px',
                      fontSize: '17px',
                      fontWeight: 500,
                      color: 'rgb(92, 92, 92)',
                    }}
                  >
                    Description
                  </InputLabel>
                  <TextareaAutosize
                    {...field}
                    aria-label="Description"
                    minRows={3}
                    placeholder="Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book. It usually begins with"
                    style={{
                      marginTop: '24px',
                      padding: '15px',
                      fontFamily: 'inherit',
                    }}
                  />
                </FormControl>
              )}
            />

            <Box display="flex" flexDirection="column" gap={0.5}>
              <Typography
                component="h6"
                variant="caption"
                sx={{
                  mb: 0,
                  fontSize: '15px',
                  fontWeight: 500,
                  color: 'rgb(92, 92, 92)',
                }}
              >
                Add size
              </Typography>

              <Box display="inline-flex" gap={0.39}>
                <ToggleButton value="EU-36" size="small">
                  EU-36
                </ToggleButton>
                <ToggleButton value="EU-37" size="small">
                  EU-37
                </ToggleButton>
                <ToggleButton value="EU-38" size="small">
                  EU-38
                </ToggleButton>
                <ToggleButton value="EU-39" size="small">
                  EU-39
                </ToggleButton>
                <ToggleButton value="EU-40" size="small">
                  EU-40
                </ToggleButton>
              </Box>
            </Box>
          </Stack>
        </form>
      </Box>
    </Box>
  );
}
