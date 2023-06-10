import React, { useState, forwardRef } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Button, CardActions, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import { CSSTransition } from 'react-transition-group';

export default function RecommendationCard (params : { title : string, index : number}) {

    const { title, index } = params;
    const [isExpanded, setIsExpanded] = useState(false);

    return <Card className='activityCategoryCard' sx={{
        transitionDelay: `${150 * index}ms !important`
    }}>
        <CardContent style={{
                color : 'white',
                backgroundColor : '#50ff7f'
            }} className='visible'>
            <Stack spacing={1.5}>
            <Stack direction='row' justifyContent='space-between' alignItems='center'>
                <Box sx={{
                    fontSize : 24,
                    fontWeight : 500
                }}>
                {title}
                </Box>
                <IconButton onClick={()=>setIsExpanded(prev=>!prev)}>
                    <ExpandMoreIcon sx={{
                        color : 'white',
                        transform : isExpanded ? 'rotate(180deg)' : 'rotate(0)'
                    }}/>
                </IconButton>
            </Stack>
            <Box>
                Круглый год
            </Box>
            <Stack direction='row' spacing={2}>
                <Box className='activityTagsMain' style={{backgroundColor : 'green'}}>Рекомендованное</Box>
            </Stack>
            </Stack>
        </CardContent>
        <Collapse className='expanding' in={isExpanded}>
            <CardContent sx={{
                backgroundColor : 'white',
                color : 'black',
                textAlign : 'justify'
                }}>
                Данная категория сгенерирована нейросетью в соответствии
                с вашими ответами на вопросы о предпочтениях (Вы можете это проверить
                пройдя подбор активностей несколько раз и выбирая разные варианты ответов).
                В дальнейшем планируется осуществлять подбор релеватных направлений с данными
                о группах с расписанием, адресами, координатами для карты
                известных активностей через микросервис бэкенда
                с рекомендательной системой.
            </CardContent>
            <CardActions
            style={{backgroundColor : 'white'}}
            sx={{
                display: 'flex',
                justifyContent: 'space-around'
            }}>
                <Button
                style={{backgroundColor : 'white'}}
                disabled
                className="activityCategoryActionButtonList">Выбрать в списке</Button>
                <Button
                style={{backgroundColor : 'white'}}
                disabled
                className="activityCategoryActionButtonMap">Выбрать на карте</Button>
            </CardActions>
        </Collapse>
        </Card>
}