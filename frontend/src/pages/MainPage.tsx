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
import { useAppSelector, useAppDispatch } from '../stateManager/hooks';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ActivityCategories from './ActivityCategories';
import Bookings from './Bookings';

export default function MainPage (props) {

  const nodeRef = useRef(null);
  const { pageIndex } = props;
  const {selectedPageIndex, prevPageIndex} = useAppSelector(state=>state.selectedAndPrevPageReducer);
  const dispatch = useAppDispatch();
  const { selectedAndPrevPageResolver } = selectedAndPrevPagesSlice.actions;

  const activityCategoriesId = useAppSelector(state=>state.ActivityCategoriesReducer.map(item=>item.id));

  console.log(selectedPageIndex, prevPageIndex, pageIndex);

  const [tab, setTab] = React.useState<string>('bookings');
  const handleTab = (
      __: React.MouseEvent<HTMLElement>,
      newTab: string | null
    ) => {
      if (newTab != null) {
        setTab(newTab);
      }
    };

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
                onClick={()=>dispatch(selectedAndPrevPageResolver(2))}
                sx={{
                    position : 'absolute',
                    left : 0
                }}>
                    <ArrowBackIcon sx={{
                        color : 'black'
                    }}/>
                </IconButton>
                <Box className='mainLabel'>Главная</Box>
            </Stack>
            <ToggleButtonGroup
                className='toggleGroupButton'
                value={tab}
                exclusive
                onChange={handleTab}
                >
                <ToggleButton className='activityCategoriesBookingsTab' value={'activityCategories'}>
                    <Stack width='100%' spacing={2} direction='column' justifyContent='start' alignItems='start'>
                        <Stack direction='column' alignItems='start'>
                            <Box sx={{
                                fontSize : 20,
                                fontWeight: 700
                            }}>Вам</Box>
                            <Box sx={{
                                fontSize : 20,
                                fontWeight: 700
                            }}>подойдут</Box>
                        </Stack>
                        <Box sx={{
                                fontSize : 14,
                                fontWeight: 400
                            }}>находятся рядом</Box>
                    </Stack>
                </ToggleButton>
                <ToggleButton className='activityCategoriesBookingsTab' value={'bookings'}>
                <Stack width='100%' spacing={2} direction='column' justifyContent='start' alignItems='start'>
                        <Stack direction='column' alignItems='start'>
                            <Box sx={{
                                width : '100%',
                                fontSize : 20,
                                fontWeight: 700
                            }}>Текущие</Box>
                            <Box sx={{
                                fontSize : 20,
                                fontWeight: 700
                            }}>записи</Box>
                        </Stack>
                        <Box sx={{
                                fontSize : 14,
                                fontWeight: 400,
                            }}>акутальные активности</Box>
                    </Stack>
                </ToggleButton>
            </ToggleButtonGroup>
            <Button className='startChat' onClick={()=>{
                dispatch(selectedAndPrevPageResolver(8));
            }}>
                <Stack width='100%' direction='column' alignItems='start'>
                    <Box>Подобрать активность</Box>
                    <Box sx={{
                        fontSize : 16,
                        fontWeight : 400}}>Выбери новую активность</Box>
                </Stack>
            </Button>
            {tab == 'activityCategories' ? <ActivityCategories/> : null}
            {tab == 'bookings' ? <Bookings/> : null}
            {/* {activityCategoriesId.map(id=>{
                return <ActivityCategoryCard activityCategoryId={id}/>
            })}
            <Box>Можно попробовать</Box>
            {activityCategoriesId.map(id=>{
                return <ActivityCategoryCard activityCategoryId={id}/>
            })} */}
        </Stack>
        </CSSTransition>
};