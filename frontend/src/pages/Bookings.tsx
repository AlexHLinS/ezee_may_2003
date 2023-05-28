import React from 'react';
import { useAppSelector } from "../stateManager/hooks";
import BookedCard from "../components/BookedCard";

export default function Bookings () {
    const bookings = useAppSelector(state=>state.BookingReducer);

    console.log(bookings)

    return <> {bookings.map((item, index)=>(
            <BookedCard key={index} activityInfo={item}/>
        ))}
    </>
}