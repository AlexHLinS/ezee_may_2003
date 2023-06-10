import React from 'react';
import { Stack, Box } from "@mui/material";
import curlyArrowTwo from '../svg/curlyArrowTwo.svg';

export default function DisplayTwo() {
    return <Stack
    className='onboardingDisplay'
    direction='column'
    justifyContent='space-between'
    alignItems='start'
    paddingTop={33}
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
        </Stack>
        <img src={curlyArrowTwo} style={{
            height : 150
        }}/>
        <Box sx={{textAlign : 'end', width : 200}}>
            Здесь вы найдете <text style={{color : '#FFCC00'}}>интересные Вам занятия</text>, которые находятся <text style={{color : '#FFCC00'}}>поблизости</text>
        </Box>
    </Stack>
    <Stack direction='row' spacing={1} justifyContent='center' sx={{
            width : '100%'
        }}>
        <Box sx={{borderRadius : '50%', width : 12, height : 12, border : '1px solid #FFCC00'}}></Box>
        <Box sx={{borderRadius : '50%', width : 12, height : 12, backgroundColor : '#FFCC00'}}></Box>
        <Box sx={{borderRadius : '50%', width : 12, height : 12, border : '1px solid #FFCC00'}}></Box>
    </Stack>
</Stack>
}