import React, { useRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Text from './svg/text.svg';
import GrandmomOne from './svg/hellopage_grandmom_one.svg';
import GrandmomTwo from './svg/hellopage_grandmom_two.svg';
import GrandDad from './svg/hellopage_granddad.svg';
import PlateOne from './svg/hellopage_plate_one.svg';
import PlateTwo from './svg/hellopage_plate_two.svg';
import PlateThree from './svg/hellopage_plate_three.svg';
import { useAppSelector,
    useAppDispatch
  } from '../stateManager/hooks';
import { selectedAndPrevPagesSlice } from '../stateManager/SelectedAndPrevPage';
import { useNavigate } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function Hello (props) {

    const match = useMediaQuery('not (max-width:600px)');

    console.log(match)

    const { pageIndex } = props;
    const dispatch = useAppDispatch();
    const { selectedAndPrevPageResolver } = selectedAndPrevPagesSlice.actions;
    const {selectedPageIndex, prevPageIndex} = useAppSelector(state=>state.selectedAndPrevPageReducer);
    const navigate = useNavigate();

    console.log(selectedPageIndex, pageIndex)


    return <Box
        sx={{
            position : 'absolute',
            width : match ? 600 : 'inherit',
            height : 'inherit',
            overflow : 'hidden'
        }}>
            <Box sx={{
            position : 'relative',
            width : 'inherit',
            height : 'inherit',
            overflowY : 'scroll',
            overflowX : 'hidden',
            background: 'linear-gradient(70deg, #2d6bd1, #e5edf9)',
            }}>
        <img style={{
            position: 'absolute',
            top : 450,
            left : -30,
            transform : 'rotate(-30deg)',
            zIndex : 4
        }} src={GrandDad}/>
        <img  src={GrandmomOne}
        style={{
            position: 'absolute',
            top : 10,
            right : -60,
            transform : 'rotate(10deg)'
        }}/>
        <img
        style={{
            position: 'absolute',
            top : 80,
            left : 10
        }}
        src={Text}/>
        <Box sx={{
            paddingTop : 2,
            paddingLeft : 2,
            color : 'white',
            fontSize : 16,
            fontFamily : 'RF Dewi',
            fontWeight : 700
        }}
        >Мобильная версия<br></br>вэб-сайта</Box>
        <img src={PlateOne}
        style={{
            position: 'absolute',
            top : 280,
            left : 140,
            transform : 'rotate(-4deg)',
            zIndex : 3,
            opacity : 1,
            backdropFilter: 'blur(10px)'
        }}
        />
        <img
        style={{
            position: 'absolute',
            top : 260,
            left : 30,
            transform : 'rotate(3deg)',
            zIndex : 2,
            backdropFilter: 'blur(10px)'
        }}
        src={PlateTwo}/>
        <img src={PlateThree}
            style={{
                position: 'absolute',
                top : 180,
                left : -30,
                transform : 'rotate(-3deg)',
                zIndex : 1
                // transform : 'rotate(-30deg)'
            }}
        />
        <img src={GrandmomTwo}
            style={{
                position: 'absolute',
                top : 530,
                right : 10,
                transform : 'rotate(10deg)',
                zIndex : 5
            }}
        />
        <Button
        onClick={()=>{
            dispatch(selectedAndPrevPageResolver(1));
            setTimeout(()=>navigate('/inputfirst'), 0);
        }}
        size='large'
        className="actionButton"
        variant="contained"
        endIcon={<ArrowForwardIcon/>}
        sx={{
            zIndex: 6,
            position: 'absolute',
            fontSize : 24,
            top : 640,
            right : 10,
            width : 130,
            height : 60
        }}>
            <Box>Вперед</Box>
        </Button>
        </Box>
    </Box>
}