import React, { useRef } from 'react';
import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { selectedAndPrevPagesSlice } from '../stateManager/SelectedAndPrevPage';
import { useAppSelector, useAppDispatch } from '../stateManager/hooks';
import ActivityCard from '../components/ActivityCard';
import { useNavigate } from 'react-router-dom';

export default function ActivityPage (props) {

  const nodeRef = useRef(null);
  const { pageIndex } = props;
  const {selectedPageIndex, prevPageIndex} = useAppSelector(state=>state.selectedAndPrevPageReducer);
  const dispatch = useAppDispatch();
  const { selectedAndPrevPageResolver } = selectedAndPrevPagesSlice.actions;
  const navigation = useNavigate();

  const activitiesId = useAppSelector(state=>state.ActivityReducer.map(item=>item.id));

  return <CSSTransition
      timeout={500}
      nodeRef={nodeRef}
      classNames={selectedPageIndex > prevPageIndex ? 'page-transition-forward' : 'page-transition-backward'}
      unmountOnExit
      in={pageIndex == selectedPageIndex}
      key={pageIndex}>
        <Stack ref={nodeRef} className='mainContainer' spacing={2}>
            <Stack
                position='relative'
                direction='row'
                justifyContent='center'
                alignItems='center'
            >
                <IconButton
                onClick={()=>{
                    dispatch(selectedAndPrevPageResolver(3));
                    setTimeout(()=>navigation('/main'), 0)
                }}
                sx={{
                    position : 'absolute',
                    left : 0
                }}>
                    <ArrowBackIcon sx={{
                        color : 'black'
                    }}/>
                </IconButton>
                <Box className='mainLabel'>Вам подойдут</Box>
            </Stack>
            <Stack spacing={2}>
            <TransitionGroup
                component={null}
                appear
            >
            {activitiesId.map((id, index)=>{
                return <CSSTransition
                            key={id}
                            classNames='activityCard'
                            timeout={500 + index * 200}
                        >
                    <ActivityCard key={id} activityId={id} index={index}/>
                </CSSTransition>
            })}
            </TransitionGroup>
            </Stack>
        </Stack>
        </CSSTransition>
};