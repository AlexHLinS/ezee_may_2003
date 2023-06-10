import React, { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CSSTransition } from 'react-transition-group';
import { useAppSelector,
    useAppDispatch
  } from '../stateManager/hooks';
import { selectedAndPrevPagesSlice } from '../stateManager/SelectedAndPrevPage';
import Pyramid from '../pages/svg/pyramid.svg';
import { answerSlice } from '../stateManager/Answers';
import CircularProgress from '@mui/material/CircularProgress';
import { RecommendationSlice } from '../stateManager/Recommendations';
import { ActivityCategorySlice } from '../stateManager/ActivityCategories';
import { useNavigate } from 'react-router-dom';
import { mainTabSlice } from '../stateManager/mainTab';
import { Stack } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { historySlice } from '../stateManager/HistoryGPT';
import { GigachatQuestionSlice } from '../stateManager/gigachatQuestions';

export default function RecoPageThree (props) {

    const match = useMediaQuery('not (max-width:600px)');

    const nodeRef = useRef(null);
    const { pageIndex } = props;
    const dispatch = useAppDispatch();
    const { selectedAndPrevPageResolver } = selectedAndPrevPagesSlice.actions;
    const {selectedPageIndex, prevPageIndex} = useAppSelector(state=>state.selectedAndPrevPageReducer);
    const { changeAnswer } = answerSlice.actions;
    const { setReco } = RecommendationSlice.actions;
    const { setActivityCategories } = ActivityCategorySlice.actions;
    const userId = useAppSelector(state=>state.SelectedCharacterReducer.id);
    const navigation = useNavigate();
    const { setMainTab } = mainTabSlice.actions;
    const { setHistory } = historySlice.actions;
    const { setGigachatQuestion } = GigachatQuestionSlice.actions;
    const { age, gender} = useAppSelector(state=>state.SelectedCharacterReducer);

    const [isLoading, setIsLoading] = useState(false);

    const answers = useAppSelector(state=>state.AnswerReducer);

    
    console.log(history);

    // const getRecommends = async (activity) => {

    //     setIsLoading(true);

    //     let responce = await fetch('https://alexhlins1.fvds.ru:1339/send/', {
    //                         method : 'POST',
    //                         headers : {
    //                             accept : 'application/json',
    //                             'Content-Type' : 'application/json'
    //                         },
    //                         body : JSON.stringify(
    //                             {
    //                             "sex_male": true,
    //                             "age": 60,
    //                             "health_issue": `Есть проблемы ${answers.health_issue}`,
    //                             "sociality": `Мне больше нравится заниматься ${answers.sociality}`,
    //                             "activity": `Мне больше нравятся ${activity}`
    //                             }
    //                         )
    //                     });

    //     let reccomends = await responce.json();

    //     responce = await fetch(`https://alexhlins1.fvds.ru:1338/users/${userId}/recommendations/categories`,
    //         {
    //             method : 'POST',
    //             headers : {
    //                 accept : 'application/json',
    //                 'Content-Type' : 'application/json'
    //             },
    //             body : JSON.stringify(reccomends.recomendation.filter(item=>(item != '')).map(item=>item.replaceAll('"', '').trim()))
    //         },
    //     );

    //     console.log(reccomends.recomendation.filter(item=>(item != '')).map(item=>item.replaceAll('"', '').trim()));
    //     dispatch(setActivityCategories([]));
    //     dispatch(setMainTab('activityCategories'));
    //     setIsLoading(false);
    // }

    const getRecommendsFirst = async (activity) => {

        setIsLoading(true);

        let responce = await fetch('https://alexhlins1.fvds.ru:1339/send_q1/', {
                            method : 'POST',
                            headers : {
                                accept : 'application/json',
                                'Content-Type' : 'application/json'
                            },
                            body : JSON.stringify(
                                {
                                "sex_male": gender == 1 ? false : true,
                                "age": age,
                                "health_issue": `Есть проблемы ${answers.health_issue}`,
                                "sociality": `Мне больше нравится заниматься ${answers.sociality}`,
                                "activity": `Мне больше нравятся ${activity}`
                                }
                            )
                        });

        let resJSON = await responce.json();
        console.log(resJSON);

        dispatch(setHistory(resJSON.history));
        const { questions }  = resJSON;
        dispatch(setGigachatQuestion(
            Object.keys(questions).map(item=>({
                text : item,
                answers : questions[item]
            }))
        ))


        setIsLoading(false);
        // responce = await fetch(`https://alexhlins1.fvds.ru:1338/users/${userId}/recommendations/categories`,
        //     {
        //         method : 'POST',
        //         headers : {
        //             accept : 'application/json',
        //             'Content-Type' : 'application/json'
        //         },
        //         body : JSON.stringify(reccomends.recomendation.filter(item=>(item != '')).map(item=>item.replaceAll('"', '').trim()))
        //     },
        // );

        // console.log(reccomends.recomendation.filter(item=>(item != '')).map(item=>item.replaceAll('"', '').trim()));
        // dispatch(setActivityCategories([]));
        // dispatch(setMainTab('activityCategories'));
        // setIsLoading(false);
    }


    return <CSSTransition
        timeout={500}
        nodeRef={nodeRef}
        classNames={selectedPageIndex > prevPageIndex ? 'page-transition-forward' : 'page-transition-backward'}
        unmountOnExit
        in={pageIndex == selectedPageIndex}
        key={pageIndex}>
        <>
        {isLoading && <Box sx={{
            position : 'absolute',
            background : 'rgba(0, 0, 0, 0.6)',
            width : match ? 600 : 'inherit',
            height : '100%',
            zIndex : 10
        }}>
        </Box>}
        <Box ref={nodeRef} sx={{
            position : 'absolute',
            width : match ? 600 : 'inherit',
            height : 'inherit',
            overflow : 'hidden',
            background : 'rgba(0, 0, 0, 0.8)'
        }}>
            <Box sx={{
            position : 'relative',
            width : 'inherit',
            height : 'inherit',
            overflowY : 'scroll',
            overflowX : 'hidden',
            background: 'linear-gradient(0deg, #0D54CA, white)',
            }}>
        <img src={Pyramid}
            style={{
                position: 'absolute',
                top : 500,
                left : 30,
                zIndex : 3,
            }}
        />
        {isLoading ? <CircularProgress
        size={80}
        sx={{
            color : 'white',
            position : 'absolute',
            top : 500,
            left : 150,
            zIndex : 15
        }}/> : null}
        <Box sx={{
            position : 'absolute',
            top : 110,
            right : 20,
            fontSize : 36,
            color : '#0D54CA',
            letterSpacing: '-0.015em',
            fontWeight : 700,
            textAlign : 'end'
        }}>
            Что вам больше нравится:<br></br>активные или спокойные<br></br>занятия?
        </Box>

        <Stack
        spacing={1}
        sx={{
            zIndex : 3,
            width : 280,
            position : 'absolute',
            top : 350,
            right : 20
        }}>
            <Button
            disabled={isLoading}
            onClick={async ()=>{
                await getRecommendsFirst('Активные занятия');
                // await getRecommends('Активные занятия');
                // dispatch(selectedAndPrevPageResolver(3));
                // setTimeout(()=>navigation('/main'), 0);
                dispatch(selectedAndPrevPageResolver(14));
                setTimeout(()=>navigation('/secondrecogroup'), 0)
            }}
            className="questionButton"
            variant="contained">
                <Box>Активные занятия</Box>
            </Button>
            <Button
            disabled={isLoading}
            onClick={async ()=>{
                await getRecommendsFirst('Cпокойные занятия');
                // await getRecommends('Cпокойные занятия');
                // dispatch(selectedAndPrevPageResolver(3));
                // setTimeout(()=>navigation('/main'), 0);
                dispatch(selectedAndPrevPageResolver(14));
                setTimeout(()=>navigation('/secondrecogroup'), 0)
            }}
            className="questionButton"
            variant="contained">
                <Box>Спокойные занятия</Box>
            </Button>
        </Stack>

        <Button
        onClick={async ()=>{
            dispatch(selectedAndPrevPageResolver(9));
            setTimeout(()=>navigation('/questiontwo'), 0);
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
    </Box>
    </>
    </CSSTransition>
}