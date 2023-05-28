import React, { useEffect } from 'react';
import ActivityCategoryCard from '../components/ActivityCategoryCard';
import { useAppSelector, useAppDispatch } from '../stateManager/hooks';
import { ActivityCategorySlice } from '../stateManager/ActivityCategories';
import Box from '@mui/material/Box';

export default function ActivityCategories(props) {

    const dispatch = useAppDispatch();
    const activityCategories = useAppSelector(state=>state.ActivityCategoriesReducer);
    const { userId } = useAppSelector(state=>state.UserProfileReducer);
    const { setActivityCategories } = ActivityCategorySlice.actions;

    const fetchRecs = async () => {
        const responce = await fetch(`http://62.109.9.1:1337/users/${userId}/recommendations/categories`);
        const resJSON = await responce.json();
        
        dispatch(setActivityCategories(resJSON.map((item, index)=>{
            item.id = index;
            return item;
        })));
    }

    useEffect(()=>{
        fetchRecs();
    }, []);

    const activityCategoriesId = useAppSelector(state=>state.ActivityCategoriesReducer.map(item=>item.id));

    console.log(activityCategoriesId);

    return <>
        {activityCategoriesId.map(id=>{
            return <ActivityCategoryCard activityCategoryId={id}/>
        })}
    </>
}