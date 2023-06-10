import React, { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useAppSelector,
    useAppDispatch
  } from '../stateManager/hooks';
import { selectedAndPrevPagesSlice } from '../stateManager/SelectedAndPrevPage';
import RecoLogo from '../pages/svg/recoLogo.svg';
import { answerSlice } from '../stateManager/Answers';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { GigachatAnswerSlice } from '../stateManager/gigachatAnswers';
import { GigachatQuestionSlice } from '../stateManager/gigachatQuestions';
import CircularProgress from '@mui/material/CircularProgress';

export default function RecoSecondCategory (props) {

    const [selectedQuestion, setSelectedQuestion] = useState(0);

    const selectedQuestionInfo = useAppSelector(state=>state.GigachatQuestionReducer)[selectedQuestion]

    const match = useMediaQuery('not (max-width:600px)');
    const { pageIndex } = props;
    const dispatch = useAppDispatch();
    const { changeAnswer } = answerSlice.actions;
    const { selectedAndPrevPageResolver } = selectedAndPrevPagesSlice.actions;
    const {selectedPageIndex, prevPageIndex} = useAppSelector(state=>state.selectedAndPrevPageReducer);
    const { setGigachatAnswer } = GigachatAnswerSlice.actions;
    const navigation = useNavigate();
    const history = useAppSelector(state=>state.HistoryReducer);
    const answers = useAppSelector(state=>state.GigachatAnswerReducer);
    const questions = useAppSelector(state=>state.GigachatQuestionReducer);
    const userId = useAppSelector(state=>state.SelectedCharacterReducer.id);
    const [isLoading, setIsLoading] = useState(false);

    console.log(selectedQuestionInfo);

    const setRecos = async () => {

        console.log(history);

        console.log(answers);

        let ttemp = answers.map(
            (item, index)=>({
                [questions[index]['text']] : item
            })
         )

        setIsLoading(true);
        let responce = await fetch('https://alexhlins1.fvds.ru:1339/send_q2/', {
                            method : 'POST',
                            headers : {
                                accept : 'application/json',
                                'Content-Type' : 'application/json'
                            },
                            body : JSON.stringify(
                                {
                                 history : history,
                                 answers : Object.fromEntries(answers.map(
                                    (item, index)=>[
                                        [questions[index]['text']], item
                                    ]
                                 ))
                                }
                            )
                        });
        
        let reccomends = await responce.json();

        responce = await fetch(`https://alexhlins1.fvds.ru:1338/users/${userId}/recommendations/categories`,
            {
                method : 'POST',
                headers : {
                    accept : 'application/json',
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify(reccomends.recomendations.filter(item=>(item != '')).map(item=>item.replaceAll('"', '').trim()))
            },
        );
        setIsLoading(false);
    }

    return <CSSTransition
        timeout={500}
        classNames={selectedPageIndex > prevPageIndex ? 'page-transition-forward' : 'page-transition-backward'}
        unmountOnExit
        in={pageIndex == selectedPageIndex}
        key={pageIndex}>
        <Box sx={{
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
        <TransitionGroup component={null} appear>
            <CSSTransition
                timeout={500}
                classNames='answersGigachat'
                key={selectedQuestion}
                unmountOnExit
            >
                <Stack
                className='answersGigachat'
                spacing={3}
                sx={{
                    position : 'absolute',
                    top : 120,
                    left : 40,
                }}>

                    <Box sx={{
                        fontSize : 36,
                        color : '#0D54CA',
                        letterSpacing: '-0.015em',
                        fontWeight : 700
                    }}>
                        {selectedQuestionInfo.text}
                    </Box>

                    <Stack
                    spacing={1}
                    sx={{
                        zIndex : 3,
                        width : 300
                    }}>
                        { selectedQuestionInfo.answers.map(item=>
                            <Button
                            key={item}
                            disabled={isLoading}
                            onClick={async ()=>{
                                dispatch(setGigachatAnswer({
                                    index  : selectedQuestion,
                                    text : item
                                }));
                                if (selectedQuestion < 4) setSelectedQuestion(prev=>prev + 1);
                                else {
                                    await setRecos();
                                    dispatch(selectedAndPrevPageResolver(3));
                                    setTimeout(()=>navigation('/main'), 0);
                                }
                            }}
                            className="questionButton"
                            variant="contained">
                                <Box>{item}</Box>
                            </Button>)
                        }
                    </Stack>
                </Stack>
            </CSSTransition>
        </TransitionGroup>

            <Button
            disabled={isLoading}
            onClick={()=>{
                dispatch(selectedAndPrevPageResolver(10));
                setTimeout(()=>navigation('/questionthree'), 0);
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
    </Box>
    {/* <Box></Box> */}
    </CSSTransition>
}