import React, { useRef } from 'react';
import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import { CSSTransition } from 'react-transition-group';
import { selectedAndPrevPagesSlice } from '../stateManager/SelectedAndPrevPage';
import { useAppSelector, useAppDispatch } from '../stateManager/hooks';
import SuccessLogo from '../pages/svg/success.svg';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

export default function SuccessBook (props) {

  const nodeRef = useRef(null);
  const { pageIndex } = props;
  const {selectedPageIndex, prevPageIndex} = useAppSelector(state=>state.selectedAndPrevPageReducer);
  const dispatch = useAppDispatch();
  const { selectedAndPrevPageResolver } = selectedAndPrevPagesSlice.actions;
  const booking = useAppSelector(state=>state.BookingReducer[state.BookingReducer.length - 1]);
  const navigate = useNavigate();

  return <CSSTransition
      timeout={500}
      nodeRef={nodeRef}
      classNames={selectedPageIndex > prevPageIndex ? 'page-transition-forward' : 'page-transition-backward'}
      unmountOnExit
      in={pageIndex == selectedPageIndex}
      key={pageIndex}>
        {booking &&
        <Stack ref={nodeRef} className='mainContainer' height='100%' spacing={2}>
            <Box sx={{
                height : 30
            }}></Box>
            <Stack spacing={2} justifyContent='center' alignItems='center' direction='column'>
                <img width={200} height={200} src={SuccessLogo}></img>
                <Box sx={{
                    fontWeight : 700,
                    fontSize: 24
                }}>Вы записаны</Box>
                <Box sx={{
                    fontSize: 16,
                    fontWeight: 700,
                }}>{booking.title}</Box>
                <Box sx={{
                    fontSize: 14
                }}>{booking.timeslot}</Box>
                <Box sx={{
                    fontSize: 14
                }}>{booking.location.address}</Box>
            </Stack>
            <Stack height='100%' justifyContent='end' flexWrap='wrap' alignContent='end'>
                <Button
                onClick={()=>{
                    dispatch(selectedAndPrevPageResolver(3));
                    setTimeout(()=>navigate('/main'), 0);
                }}
                className="actionButton"
                variant="contained"
                endIcon={<ArrowBackIcon/>}>
                    <Box>На главную</Box>
                </Button>
            </Stack>
        </Stack>}
        </CSSTransition>
};