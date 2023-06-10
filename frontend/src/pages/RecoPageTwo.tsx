import React, { useRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CSSTransition } from 'react-transition-group';
import { useAppSelector,
    useAppDispatch
  } from '../stateManager/hooks';
import { selectedAndPrevPagesSlice } from '../stateManager/SelectedAndPrevPage';
import { answerSlice } from '../stateManager/Answers';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@mui/material';
import RecoTwo from '../pages/svg/recoTwo.svg';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function RecoPageTwo (props) {

    const match = useMediaQuery('not (max-width:600px)');

    const nodeRef = useRef(null);
    const { pageIndex } = props;
    const dispatch = useAppDispatch();
    const { selectedAndPrevPageResolver } = selectedAndPrevPagesSlice.actions;
    const {selectedPageIndex, prevPageIndex} = useAppSelector(state=>state.selectedAndPrevPageReducer);
    const { changeAnswer } = answerSlice.actions;
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
            background: 'linear-gradient(30deg, #0D54CA, white)',
            }}>
        <img src={RecoTwo}
            style={{
                position: 'absolute',
                top : 550,
                left : 60,
                transform : 'rotate(-4deg)',
                zIndex : 3,
                // backdropFilter: 'blur(10px)'
            }}
        />
        <Box sx={{
            position : 'absolute',
            color : '#0D54CA',
            top : 110,
            left : 20,
            fontSize : 36,
            letterSpacing: '-0.015em',
            fontWeight : 700
        }}>
            Что вам больше нравится:<br></br>заниматься одному<br></br>или в группе?
        </Box>

        <Stack
        spacing={1}
        sx={{
            zIndex : 3,
            width : 280,
            position : 'absolute',
            top : 350,
            left : 20
        }}
        >
            <Button
            onClick={()=>{
                dispatch(changeAnswer(
                    {
                        answer : 'sociality',
                        value : 'Одному'
                    }
                ));
                dispatch(selectedAndPrevPageResolver(10))
                setTimeout(()=>navigation('/questionthree'), 0);
            }}
            className="questionButton"
            variant="contained">
                <Box>Одному</Box>
            </Button>
            <Button
            onClick={()=>{
                dispatch(changeAnswer(
                    {
                        answer : 'sociality',
                        value : 'В группе, коллективе'
                    }
                ))
                dispatch(selectedAndPrevPageResolver(10));
                setTimeout(()=>navigation('/questionthree'), 0);
            }}
            className="questionButton"
            variant="contained">
                <Box>В группе, коллективе</Box>
            </Button>
        </Stack>

        <Button
        onClick={()=>{
            dispatch(selectedAndPrevPageResolver(8));
            setTimeout(()=>navigation('/questionone'), 0);
        }}
        className="questionButton"
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