import {
  Button,
  LabeledTextfield,
  Select,
  ToggleButton,
} from '@/components/ui';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Stack,
  styled,
  ToggleButtonGroup,
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
  size: string;
};

const StyledInputLabel = styled(InputLabel)(() => ({
  marginLeft: '-13px',
  fontSize: '17px',
  fontWeight: 500,
  color: 'rgb(92, 92, 92)',
}));

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
      <Box display={'flex'}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <LabeledTextfield
              label="Product name"
              placeholder="Nike Air Max 90"
              {...register('productName')}
            />
            <LabeledTextfield
              label="Price"
              placeholder="$160"
              {...register('price')}
            />

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
                    <MenuItem value="Blue">Blue</MenuItem>
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

            {/* <Controller
              name="description"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <FormControl sx={{ width: 436, mt: 2 }}>
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
            /> */}

            <Controller
              name="description"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Box sx={{ width: 436 }}>
                  <Typography
                    sx={{
                      ml: '0',
                      fontSize: '15px',
                      fontWeight: 500,
                      color: '#494949',
                      borderRadius: '8px',
                    }}
                  >
                    Description
                  </Typography>
                  <TextareaAutosize
                    {...field}
                    aria-label="Description"
                    minRows={3}
                    placeholder="Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book. It usually begins with"
                    style={{
                      marginTop: '8px',
                      padding: '15px',
                      fontFamily: 'inherit',
                      width: '100%',
                    }}
                  />
                </Box>
              )}
            />

            <Controller
              name="size"
              control={control}
              render={({ field }) => (
                <Box>
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

            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </Stack>
        </form>
      </Box>
    </Box>
  );
}
