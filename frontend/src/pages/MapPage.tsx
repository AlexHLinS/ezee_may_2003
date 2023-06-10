import React, { useRef, useEffect, useState } from 'react';
import { YMaps, Map, Placemark} from '@pbe/react-yandex-maps';
import { CSSTransition } from 'react-transition-group';
import { useAppSelector, useAppDispatch } from '../stateManager/hooks';
import Box from '@mui/material/Box';
import {createPortal} from 'react-dom';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MapInfoCard from '../components/MapInfoCard';
import { selectedAndPrevPagesSlice } from '../stateManager/SelectedAndPrevPage';
import { useNavigate } from 'react-router-dom';
import MapMarker from './svg/mapMarker.svg';
import HomeMarker from './svg/home.svg';

var activityId = -1;

export default function MapPage(props) {
    
    const userInfo = useAppSelector(state=>state.SelectedCharacterReducer)
    const nodeRef = useRef(null);
    const { pageIndex } = props;
    const dispatch = useAppDispatch();
    const { selectedAndPrevPageResolver } = selectedAndPrevPagesSlice.actions;
    const {selectedPageIndex, prevPageIndex} = useAppSelector(state=>state.selectedAndPrevPageReducer);
    const [ activePortal, setActivePortal ] = useState(false);
    const activitiesInfo = useAppSelector(state=>state.ActivityReducer.map(item=>({
        id  : item.id,
        latitude : item.location.latitude,
        longitude : item.location.longitude,
    })))
    const navigation = useNavigate();
    const [ userSettings, setUserSettings ] = useState({});

    const userId = useAppSelector(state=>state.SelectedCharacterReducer.id);

    const fetchUserSettings = async () => {
        const response = await fetch(`https://alexhlins1.fvds.ru:1338/users/${userId}/settings`);
        const resJSON = await response.json();

        setUserSettings(resJSON);
    }

    useEffect(()=>{
        fetchUserSettings();
    }, []);

    // const layout = 

    const Portal =
        ( { children, elementId } ) => {
            // находим искомый HTML по id
            const mount = document.getElementById(elementId)
            // создаём свой div
            const el = document.createElement('div');
    
            useEffect(() => {
                // добавляем свой див к искомому элементу
                if (mount) mount.appendChild(el)
                return () => {
                    // удаляем элемент от искомого при завершении компоненты
                    if (mount) {
                        mount.removeChild(el);
                    }
                }
            }, [ el, mount ])
           
            // отменяем отрисовку при отсутствии искомого элемента
            if (!mount) return null
            // собственно, пририсовываем React-элемент в div к искомому HTML
            return createPortal(children, el)
        }

    const removeBaloonHandler = (event) => {
        if (event.target.className.split(' ').includes('ymaps-2-1-79-events-pane')) {
            setActivePortal(false);
        }
    }

    useEffect(()=>{
        document.getElementById('root')?.addEventListener('click', removeBaloonHandler);
        return ()=>{document.getElementById('root')?.removeEventListener('click', removeBaloonHandler);}
    })

  return <CSSTransition
    timeout={500}
    nodeRef={nodeRef}
    classNames={selectedPageIndex > prevPageIndex ? 'page-transition-forward' : 'page-transition-backward'}
    unmountOnExit
    in={pageIndex == selectedPageIndex}
    key={pageIndex}>
        <Box className="mainContainer" sx={{
                padding : 0
            }}>
            <YMaps version={ '2.1.79' }>
                <IconButton
                onClick={()=>{
                    dispatch(selectedAndPrevPageResolver(3));
                    setTimeout(()=>navigation('/main'), 0);
                }}
                sx={{
                    top : 5,
                    left : 5,
                    position : 'absolute',
                    zIndex : 10}}>
                    <ArrowBackIcon sx={{
                        color : 'black'
                    }}/>
                </IconButton>
                <Map
                    width='100%'
                    height='100vh'
                    defaultState={{
                        center: Object.keys(userSettings).length ? [
                            parseFloat(userSettings.location.latitude),
                            parseFloat(userSettings.location.longitude)
                        ] : [55.75, 37.57],
                        zoom : 15,
                        controls : ["zoomControl"],
                    }}
                    modules={["control.ZoomControl", 'geoObject.addon.balloon']}
                >
                    {activitiesInfo.map(item=>(
                        <Placemark key={item.id} geometry={ [parseFloat(item.latitude), parseFloat(item.longitude)] }
                        options={
                            {
                                iconLayout: 'default#image',
                                iconImageHref: MapMarker,
                                iconImageSize: [50, 50],
                            }}
                        properties={
                            {
                                balloonContent: '<div id="driver-2" class="driver-card"></div>',
                            }}
                        onClick={ () => {
                        setTimeout(() => {
                            activityId = item.id;
                            setActivePortal(true);
                        }, 100)
                        } } />
                    ))}
                    {Object.keys(userSettings).length &&
                        <Placemark key={userSettings.id} geometry={
                            [
                                parseFloat(userSettings.location.latitude),
                                parseFloat(userSettings.location.longitude)
                            ] }
                        properties={
                            {
                                balloonContent: userSettings.location.address,
                            }}
                        options={
                            {
                                iconLayout: 'default#image',
                                iconImageHref: HomeMarker,
                                iconImageSize: [50, 50],
                            }}/>
                    }
                </Map>
                {
                    activePortal && <Portal elementId={'driver-2'}>
                            <MapInfoCard id={activityId}/>
						</Portal>
                    }
            </YMaps>
        </Box>
    </CSSTransition>
};