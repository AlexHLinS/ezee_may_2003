import React from 'react';
import { Stack, Box } from "@mui/material";
import curlyArrowThree from '../svg/curlArrowThree.svg';

export default function DisplayThree() {
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
            <Box sx={{textAlign : 'start', width : 200}}>
                А здесь - занятия, на которые вы <text style={{color : '#FFCC00'}}>записались сходить</text>
            </Box>
            <img src={curlyArrowThree} style={{
                height : 150
            }}/>
        </Stack>
        <Stack direction='row' spacing={1} justifyContent='center' sx={{
            width : '100%'
        }}>
            <Box sx={{borderRadius : '50%', width : 12, height : 12, border : '1px solid #FFCC00'}}></Box>
            <Box sx={{borderRadius : '50%', width : 12, height : 12, border : '1px solid #FFCC00'}}></Box>
            <Box sx={{borderRadius : '50%', width : 12, height : 12, backgroundColor : '#FFCC00'}}></Box>
        </Stack>
</Stack>
}