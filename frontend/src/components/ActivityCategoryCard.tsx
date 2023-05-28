import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Button, CardActions, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import { useAppSelector, useAppDispatch } from '../stateManager/hooks';
import { ActivityCategorySlice } from '../stateManager/ActivityCategories';
import { selectedAndPrevPagesSlice } from '../stateManager/SelectedAndPrevPage';
import { ActivitySlice } from '../stateManager/Activities';

export default function ActivityCategoryCard (params : { activityCategoryId : number}) {

    const { activityCategoryId } = params;
    const dispatch = useAppDispatch();
    const activityCategory = useAppSelector(state=>state.ActivityCategoriesReducer.find(item=>item.id==activityCategoryId));
    const { selectedAndPrevPageResolver } = selectedAndPrevPagesSlice.actions;
    const { userId } = useAppSelector(state=>state.UserProfileReducer);
    const { setActivities } = ActivitySlice.actions;

    const fetchGroups = async () => {
        const response = await fetch(`http://62.109.9.1:1337/users/${userId}/recommendations/groups?category=${activityCategoryId}`);
        const resJSON = await response.json();
        const newRes = resJSON.map(item=>{
            item.location.estimatedTime = Math.floor(Math.random() * 100);
            return item;
        })
        dispatch(setActivities(newRes));
    }

    console.log(activityCategoryId)
    const [isExpanded, setIsExpanded] = useState(false);

    return <Card className='activityCategoryCard'>
        <CardContent className='visible'>
            <Stack spacing={1.5}>
            <Stack direction='row' justifyContent='space-between' alignItems='center'>
                <Box sx={{
                    fontSize : 24,
                    fontWeight : 500
                }}>
                {activityCategory?.title}
                </Box>
                <IconButton onClick={()=>setIsExpanded(prev=>!prev)}>
                    <ExpandMoreIcon sx={{
                        transform : isExpanded ? 'rotate(180deg)' : 'rotate(0)'
                    }}/>
                </IconButton>
            </Stack>
            <Box>
                {activityCategory?.season}
            </Box>
            <Stack direction='row' spacing={2}>
                {activityCategory?.tags.map((tag, index)=>{
                    return <Box className={index ==0 ? 'activityTagsMain' : 'activityTagsOther'}>{tag}</Box>
                })}
            </Stack>
            </Stack>
        </CardContent>
        <Collapse className='expanding' in={isExpanded}>
            <CardContent>
                {activityCategory?.description}
            </CardContent>
            <CardActions sx={{
                display: 'flex',
                justifyContent: 'space-around'
            }}>
                <Button
                className="activityCategoryActionButtonList"
                onClick={()=>{
                    fetchGroups();
                    dispatch(selectedAndPrevPageResolver(4))
                }}
                >Выбрать в списке</Button>
                <Button
                className="activityCategoryActionButtonMap"
                onClick={()=>{
                    fetchGroups();
                    dispatch(selectedAndPrevPageResolver(5))
                }}
                >Выбрать на карте</Button>
            </CardActions>
        </Collapse>
    </Card>
}