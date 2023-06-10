import React, { useRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CSSTransition } from 'react-transition-group';
import { useAppSelector,
    useAppDispatch
  } from '../stateManager/hooks';
import { selectedAndPrevPagesSlice } from '../stateManager/SelectedAndPrevPage';
import RecoLogo from '../pages/svg/recoLogo.svg';
import { answerSlice } from '../stateManager/Answers';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function RecoPageOne (props) {

    const match = useMediaQuery('not (max-width:600px)');

    const nodeRef = useRef(null);
    const { pageIndex } = props;
    const dispatch = useAppDispatch();
    const { changeAnswer } = answerSlice.actions;
    const { selectedAndPrevPageResolver } = selectedAndPrevPagesSlice.actions;
    const {selectedPageIndex, prevPageIndex} = useAppSelector(state=>state.selectedAndPrevPageReducer);
    const navigation = useNavigate();


    return <CSSTransition
        timeout={500}
        nodeRef={nodeRef}
        classNames={selectedPageIndex > prevPageIndex ? 'page-transition-forward' : 'page-transition-backward'}
        unmountOnExit
        in={pageIndex == selectedPageIndex}
        key={pageIndex}>
        <Box ref={nodeRef} sx={{
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
            background: 'linear-gradient(-30deg, #0D54CA, white)',
            }}>
        <img src={RecoLogo}
            style={{
                position: 'absolute',
                top : 200,
                right : 0,
                // transform : 'rotate(-4deg)',
                zIndex : 0,
            }}
        />
        <Box sx={{
            position : 'absolute',
            top : 120,
            left : 40,
            fontSize : 36,
            color : '#0D54CA',
            letterSpacing: '-0.015em',
            fontWeight : 700
        }}>
            Есть ли<br></br>у вас проблемы<br></br>со здоровьем?
        </Box>

        <Stack
        spacing={1}
        sx={{
            zIndex : 3,
            width : 300,
            position : 'absolute',
            top : 280,
            left : 20
        }}>
        <Button
        onClick={()=>{
            dispatch(changeAnswer(
                {
                    answer : 'health_issue',
                    value : 'C cердечно-сосудистой системой'
                }
            ))
            dispatch(selectedAndPrevPageResolver(9));
            setTimeout(()=>navigation('/questiontwo'), 0);
        }}
        className="questionButton"
        variant="contained">
            <Box>C cердечно-сосудистой системой</Box>
        </Button>
        <Button
        className="questionButton"
        onClick={()=>{
            dispatch(changeAnswer(
                {
                    answer : 'health_issue',
                    value : 'С опорно-двигательным аппаратом'
                }
            ))
            dispatch(selectedAndPrevPageResolver(9));
            setTimeout(()=>navigation('/questiontwo'), 0);
        }}
        variant="contained">
            <Box>С опорно-двигательным аппаратом</Box>
        </Button>
        <Button
        className="questionButton"
        onClick={()=>{
            dispatch(changeAnswer(
                {
                    answer : 'health_issue',
                    value : 'Со слухом'
                }
            ))
            dispatch(selectedAndPrevPageResolver(9));
            setTimeout(()=>navigation('/questiontwo'), 0);
        }}
        variant="contained">
            <Box>Co cлухом</Box>
        </Button>
        <Button
        className="questionButton"
        onClick={()=>{
            dispatch(changeAnswer(
                {
                    answer : 'health_issue',
                    value : 'Со зрением'
                }
            ))
            dispatch(selectedAndPrevPageResolver(9));
            setTimeout(()=>navigation('/questiontwo'), 0);
        }}
        variant="contained">
            <Box>Со зрением</Box>
        </Button>

        <Button
        className="questionButton"
        onClick={()=>{
            dispatch(changeAnswer(
                {
                    answer : 'health_issue',
                    value : 'Проблем нет'
                }
            ))
            dispatch(selectedAndPrevPageResolver(9));
            setTimeout(()=>navigation('/questiontwo'), 0);
        }}
        variant="contained">
            <Box>Проблем нет</Box>
        </Button>
        </Stack>

        <Button
        onClick={()=>{
            dispatch(selectedAndPrevPageResolver(3));
            setTimeout(()=>navigation('/main'), 0);
        }}
        className="questionButton"
        variant="contained"
        startIcon={<ArrowBackIcon/>}
        sx={{
            zIndex: 6,
            position: 'absolute',
            top : 750,
            right : 10
        }}>
            <Box>Назад</Box>
        </Button>
        </Box>
    </Box></CSSTransition>
}