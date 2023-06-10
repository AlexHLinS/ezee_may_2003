import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { selectedAndPrevPagesSlice } from '../stateManager/SelectedAndPrevPage';
import { useAppSelector, useAppDispatch } from '../stateManager/hooks';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';

import PieChart, {
    Series,
    Size,
    Legend
  } from 'devextreme-react/pie-chart';

export default function AdminPagePiecharts(props) {

  const [offline, setOffline] = useState([]);
  const [group, setGroup] = useState([]);
  const [outdoor, setOutdoor] = useState([]);
  const [offlineTotal, setOfflineTotal] = useState(0);
  const [groupTotal, setGroupTotal] = useState(0);
  const [outdoorTotal, setOutdoorTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStats = async () => {
    setIsLoading(true);
    let responce = await fetch('https://alexhlins1.fvds.ru:1338/admin/stats');
    let resJSON = await responce.json();
    setIsLoading(false);

    let offline = [
        {
            type : 'offline',
            percentage : Math.floor(resJSON['offline']['percentage'] * 100),
        },
        {
            type : 'online',
            percentage : Math.floor((1 - resJSON['offline']['percentage']) * 100),
        }
    ];

    let outdoor = [
        {
            type : 'outdoor',
            percentage : Math.floor(resJSON['outdoor']['percentage'] * 100),
        },
        {
            type : 'ondoor',
            percentage : Math.floor((1 - resJSON['outdoor']['percentage']) * 100),
        }
    ];

    let group = [
        {
            type : 'group',
            percentage : Math.floor(resJSON['group']['percentage'] * 100),
        },
        {
            type : 'personal',
            percentage : Math.floor((1 - resJSON['group']['percentage']) * 100),
        }
    ];

    setGroup(group);
    setOffline(offline);
    setOutdoor(outdoor);
    setGroupTotal(Math.floor(resJSON['group']['quantity'] / resJSON['group']['percentage']));
    setOfflineTotal(Math.floor(resJSON['offline']['quantity'] / resJSON['offline']['percentage']));
    setOutdoorTotal(Math.floor(resJSON['outdoor']['quantity'] / resJSON['outdoor']['percentage']));
  }

  useEffect(()=>{
    fetchStats();
  }, [])

  const dispatch = useAppDispatch();
  const { selectedAndPrevPageResolver } = selectedAndPrevPagesSlice.actions;
  const navigate = useNavigate();

  const pointClickHandler = (e) => {
    toggleVisibility(e.target);
  }

  const legendClickHandler = (e) => {
    const arg = e.target;
    const item = e.component.getAllSeries()[0].getPointsByArg(arg)[0];

    toggleVisibility(item);
  }

  const toggleVisibility = (item) => {
    item.isVisible() ? item.hide() : item.show();
  }

  return <>
        <Stack
        className='mainContainer'
        direction='column'
        alignItems='center'
        spacing={2.0}>
            <Stack
                direction='row'
                alignItems='center'
                justifyContent='space-around'
            >
                <IconButton
                onClick={()=>{
                    dispatch(selectedAndPrevPageResolver(11));
                    setTimeout(()=>navigate('/adminmain'), 0);
                }}
                sx={{
                    position : 'absolute',
                    left : 0
                }}>
                    <ArrowBackIcon sx={{
                        color : 'black'
                    }}/>
                </IconButton>
                <Box className='mainLabel'>Статистика</Box>
            </Stack>

            <Box sx={{
                paddingTop : 2,
                fontWeight : 600
            }}>Доли занятий онлайн/оффлайн в выдаче топ 5 рекомендаций</Box>
            {isLoading ? <CircularProgress size={240}/> :
            <PieChart
                id="pie"
                dataSource={offline}
                customizePoint={(e)=>{
                    switch (e.argument) {
                      case ('offline'):
                        return { color : '#79BCFF'};
                      default:
                        return { color : '#0D54CA'};
                    }
                  }}
                palette="Bright"
                //title="Area of Countries"
            >
                <Series
                argumentField="type"
                valueField="percentage"
                />
                <Legend visible={false}></Legend>
                <Size width={240} height={240}/>
            </PieChart>}
            <Stack spacing={2} width={250} sx={{
                paddingTop : 2
            }}>
                <Stack
                direction='row'
                spacing={2}
                alignItems='center'><Box sx={{
                    backgroundColor : '#79BCFF',
                    width : 20,
                    height : 20,
                    borderRadius : '50%'
                }}/><Box sx={{fontWeight : 700}}>Оффлайн {offline.length ? offline[0].percentage : 0}%</Box></Stack>
                <Stack 
                direction='row'
                spacing={2}
                alignItems='center'><Box sx={{
                    backgroundColor : '#0D54CA',
                    width : 20,
                    height : 20,
                    borderRadius : '50%'
                }}/><Box sx={{fontWeight : 700}}>Онлайн {offline.length ? offline[1].percentage : 0}%</Box></Stack>
            </Stack>

            <Box sx={{
                paddingTop : 5,
                fontWeight : 600
            }}>Доли занятий групповых/индивидуальных в выдаче топ 5 рекомендаций</Box>
            {isLoading ? <CircularProgress size={240}/> :
            <PieChart
                id="pie"
                dataSource={group}
                customizePoint={(e)=>{
                    switch (e.argument) {
                      case ('group'):
                        return { color : '#79BCFF'};
                      default:
                        return { color : '#0D54CA'};
                    }
                  }}
                palette="Bright"
                //title="Area of Countries"
            >
                <Series
                argumentField="type"
                valueField="percentage"
                />
                <Legend visible={false}></Legend>
                <Size width={240} height={240}/>
            </PieChart>}
            <Stack spacing={2} width={250} sx={{
                paddingTop : 2
            }}>
                <Stack
                direction='row'
                spacing={2}
                alignItems='center'><Box sx={{
                    backgroundColor : '#79BCFF',
                    width : 20,
                    height : 20,
                    borderRadius : '50%'
                }}/><Box sx={{fontWeight : 700}}>Групповые {group.length ? group[0].percentage : 0}%</Box></Stack>
                <Stack 
                direction='row'
                spacing={2}
                alignItems='center'><Box sx={{
                    backgroundColor : '#0D54CA',
                    width : 20,
                    height : 20,
                    borderRadius : '50%'
                }}/><Box sx={{fontWeight : 700}}>Индивидуальные {group.length ? group[1].percentage : 0}%</Box></Stack>
            </Stack>

            <Box sx={{
                paddingTop : 5,
                fontWeight : 600
            }}>Доли занятий на улице/в помещении в выдаче топ 5 рекомендаций</Box>
            {isLoading ? <CircularProgress size={240}/> :
            <PieChart
                id="pie"
                dataSource={outdoor}
                customizePoint={(e)=>{
                    switch (e.argument) {
                      case ('outdoor'):
                        return { color : '#79BCFF'};
                      default:
                        return { color : '#0D54CA'};
                    }
                  }}
                palette="Bright"
                //title="Area of Countries"
            >
                <Series
                argumentField="type"
                valueField="percentage"
                />
                <Legend visible={false}></Legend>
                <Size width={240} height={240}/>
            </PieChart>}
            <Stack spacing={2} width={250} sx={{
                paddingTop : 2,
                paddingBottom : 10
            }}>
                <Stack
                direction='row'
                spacing={2}
                alignItems='center'><Box sx={{
                    backgroundColor : '#79BCFF',
                    width : 20,
                    height : 20,
                    borderRadius : '50%'
                }}/><Box sx={{fontWeight : 700}}>На улице {outdoor.length ? outdoor[0].percentage : 0}%</Box></Stack>
                <Stack 
                direction='row'
                spacing={2}
                alignItems='center'><Box sx={{
                    backgroundColor : '#0D54CA',
                    width : 20,
                    height : 20,
                    borderRadius : '50%'
                }}/><Box sx={{fontWeight : 700}}>В помещении {outdoor.length ? outdoor[1].percentage : 0}%</Box></Stack>
            </Stack>
            
        </Stack>
        </>
};