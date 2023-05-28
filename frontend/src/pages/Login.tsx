import React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import { IMaskInput } from 'react-imask';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FormControl from '@mui/material/FormControl';

interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

  const TextMaskCustom = React.forwardRef<HTMLInputElement, CustomProps>(
    function TextMaskCustom(props, ref) {
      const { onChange, ...other } = props;
      return (
        <IMaskInput
          {...other}
          mask="+7 (9##) ###-####"
          definitions={{
            '#': /[0-9]/,
          }}
          inputRef={ref}
          onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
          overwrite
        />
      );
    },
  );

  interface State {
    phonenumber: string;
    password: string;
  }

export default function Login() {

    const [values, setValues] = React.useState<State>({
        phonenumber: '',
        password: '',
    });

    const [
      secondInputFieldType,
      setSecondInputFieldType
    ] = useState<'password' | 'text'>('password');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({
        ...values,
        [event.target.name]: event.target.value,
      });
    };

    return (
        <Stack spacing={2}>
            <Stack
                position='relative'
                direction='row'
                justifyContent='center'
                alignItems='center'
            >
                <IconButton sx={{
                    position : 'absolute',
                    left : 0
                }}>
                    <ArrowBackIcon sx={{
                        color : 'black'
                    }}/>
                </IconButton>
                <Box className='mainLabel'>Вход</Box>
            </Stack>
            <Box height='15vh'/>
            <Box className='hintLabel'>
                Если вы забыли пароль или никогда не создавали его,
                пройдите регистрацию заново
            </Box>
            <TextField
                className='inputTextField'
                label='телефон'
                value={values.phonenumber}
                onChange={handleChange}
                name="phonenumber"
                id="formatted-text-mask-input"
                InputProps={{
                    inputComponent : TextMaskCustom as any
                }}
            />
            <TextField
                className='inputTextField'
                type={secondInputFieldType}
                label="пароль"
                value={values.password}
                onChange={handleChange}
                name="password"
                id="formatted-numberformat-input"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={()=>{
                        setSecondInputFieldType(secondInputFieldType == 'password' ? 'text' : 'password');
                      }}>
                      {secondInputFieldType == 'password' ? <VisibilityIcon /> : <VisibilityOffIcon/>}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
            />
            <Stack direction='row' justifyContent='flex-end' className='hintLabel'>
              Я забыл логин или пароль
            </Stack>
            <Stack direction='row' justifyContent='flex-end'>
                <Button className="actionButton" variant="contained" endIcon={<ArrowForwardIcon/>}>
                  <Box>Вперед</Box>
                </Button>
            </Stack>
        </Stack>
    )
}