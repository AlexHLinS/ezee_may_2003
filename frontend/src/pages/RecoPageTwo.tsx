import React, { useRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FormControl from '@mui/material/FormControl';
import Text from './svg/text.svg';
import GrandmomOne from './svg/hellopage_grandmom_one.svg';
import GrandmomTwo from './svg/hellopage_grandmom_two.svg';
import GrandDad from './svg/hellopage_granddad.svg';
import PlateOne from './svg/hellopage_plate_one.svg';
import PlateTwo from './svg/hellopage_plate_two.svg';
import PlateThree from './svg/hellopage_plate_three.svg';
import { CSSTransition } from 'react-transition-group';
import { useAppSelector,
    useAppDispatch
  } from '../stateManager/hooks';
import { selectedAndPrevPagesSlice } from '../stateManager/SelectedAndPrevPage';
import RecoLogo from '../pages/svg/recoLogo.svg';

export default function RecoPageTwo (props) {

    const nodeRef = useRef(null);
    const { pageIndex } = props;
    const dispatch = useAppDispatch();
    const { selectedAndPrevPageResolver } = selectedAndPrevPagesSlice.actions;
    const {selectedPageIndex, prevPageIndex} = useAppSelector(state=>state.selectedAndPrevPageReducer);
    console.log(selectedPageIndex, prevPageIndex, pageIndex);


    return <CSSTransition
        timeout={500}
        nodeRef={nodeRef}
        classNames={selectedPageIndex > prevPageIndex ? 'page-transition-forward' : 'page-transition-backward'}
        unmountOnExit
        in={pageIndex == selectedPageIndex}
        key={pageIndex}>
        <Box ref={nodeRef} sx={{
            position : 'absolute',
            width : 'inherit',
            height : 'inherit',
            overflow : 'hidden'
        }}>
            <Box sx={{
            position : 'relative',
            width : 'inherit',
            height : 'inherit',
            overflow : 'hidden',
            background: 'linear-gradient(70deg, #cd3931, #ccb280)',
            }}>
        <img src={RecoLogo}
            style={{
                position: 'absolute',
                top : 280,
                left : 140,
                transform : 'rotate(-4deg)',
                zIndex : 3,
                // backdropFilter: 'blur(10px)'
            }}
        />
        <Box sx={{
            position : 'absolute',
            top : 110,
            left : 20,
            fontSize : 36,
            color : 'white',
            letterSpacing: '-0.015em'
        }}>
            Что вам больше нравится:<br></br>заниматься одному<br></br>или в группе?
        </Box>

        <Button
        onClick={()=>{
            dispatch(selectedAndPrevPageResolver(10))
        }}
        className="actionButton"
        variant="contained"
        sx={{
            zIndex: 6,
            position: 'absolute',
            top : 280,
            left : 30
        }}>
            <Box>Одному</Box>
        </Button>
        <Button
        onClick={()=>{
            dispatch(selectedAndPrevPageResolver(10))
        }}
        className="actionButton"
        variant="contained"
        sx={{
            zIndex: 6,
            position: 'absolute',
            top : 330,
            left : 30
        }}>
            <Box>В группе, коллективе</Box>
        </Button>

        <Button
        onClick={()=>dispatch(selectedAndPrevPageResolver(8))}
        className="actionButton"
        variant="contained"
        startIcon={<ArrowBackIcon/>}
        sx={{
            zIndex: 6,
            position: 'absolute',
            top : 600,
            right : 10
        }}>
            <Box>Назад</Box>
        </Button>
        </Box>
    </Box></CSSTransition>
}