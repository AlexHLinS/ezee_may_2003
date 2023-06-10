import React from 'react';
import { Stack, Box } from "@mui/material";
import curlyArrowOne from '../svg/curlyArrowOne.svg';

export default function DisplayOne() {
    return <Stack
    className='onboardingDisplay'
    direction='column'
    justifyContent='space-between'
    alignItems='start'
    paddingTop={21}
    paddingBottom={2}
    paddingRight={2}
    paddingLeft={2}
    sx={{
        left : -10,
        position : 'absolute',
        width : '110%',
        height : 'inherit',
        background : 'rgba(0, 0, 0, 0.8)',
        color : 'white',
        zIndex : 1,
        fontWeight : 400,
        fontSize : 24,
        overflowY : 'hidden'
    }}>
        <Stack direction='row'>
            <Stack
                direction='column'
                justifyContent='center'
                spacing={2}
            >
                <Box>
                    Первый раз? Или<br></br>посещал многое?
                </Box>
                <Box>
                    <text style={{color : '#FFCC00'}}>Ответь</text> на вопросы и<br></br>получи индивидуальные<br></br>рекомендации по<br></br>активностям!
                </Box>
                <Box>
                    Жми <text style={{color : '#FFCC00'}}>подобрать<br></br>активность</text> для<br></br>подходящей<br></br>рекомендации
                </Box>
            </Stack>
            <img src={curlyArrowOne} style={{
                height : 250
            }}/>
        </Stack>
        <Stack direction='row' spacing={1} justifyContent='center' sx={{
            width : '100%'
        }}>
            <Box sx={{borderRadius : '50%', width : 12, height : 12, backgroundColor : '#FFCC00'}}></Box>
            <Box sx={{borderRadius : '50%', width : 12, height : 12, border : '1px solid #FFCC00'}}></Box>
            <Box sx={{borderRadius : '50%', width : 12, height : 12, border : '1px solid #FFCC00'}}></Box>
        </Stack>
</Stack>
}