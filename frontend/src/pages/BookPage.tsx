import React, { useRef } from 'react';
import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { CSSTransition } from 'react-transition-group';
import { selectedAndPrevPagesSlice } from '../stateManager/SelectedAndPrevPage';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import ActivityCategoryCard from '../components/ActivityCategoryCard';
import { ActivityCategorySlice } from '../stateManager/ActivityCategories';
import { SelectedActivitySlice } from '../stateManager/SelectedActivity';
import { useAppSelector, useAppDispatch } from '../stateManager/hooks';
import BookCard from '../components/BookCard';
import { useNavigate } from 'react-router-dom';

export default function BookPage (props) {

  const nodeRef = useRef(null);
  const { pageIndex } = props;
  const {selectedPageIndex, prevPageIndex} = useAppSelector(state=>state.selectedAndPrevPageReducer);
  const dispatch = useAppDispatch();
  const { selectedAndPrevPageResolver } = selectedAndPrevPagesSlice.actions;
  const navigation = useNavigate();

  const activityCategoriesId = useAppSelector(state=>state.ActivityCategoriesReducer.map(item=>item.id));

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
                    dispatch(selectedAndPrevPageResolver(prevPageIndex));
                    setTimeout(()=>navigation(prevPageIndex == 5 ? '/groupsmap' : '/groupslist'), 0)
                }}
                sx={{
                    position : 'absolute',
                    left : 0
                }}>
                    <ArrowBackIcon sx={{
                        color : 'black'
                    }}/>
                </IconButton>
                <Box className='mainLabel'>Запись</Box>
            </Stack>
            <BookCard  activityId={activityCategoriesId[0]}/>
            {/* {activityCategoriesId.map(id=>{
                return <ActivityCategoryCard activityCategoryId={id}/>
            })} */}
        </Stack>
        </CSSTransition>
};