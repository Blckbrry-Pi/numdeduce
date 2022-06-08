import React, { useEffect, useRef } from 'react';
import { placeValueMapping } from '../../top-right/ConstraintChart';

import "./PlaceSlider.css";

type Props = {
    digits: number;
    className?: string;
    placeValue: number;
    setPlaceValue: (pv: number | ((old: number) => number)) => void;
};

const Tickmarks: React.FC<{ digits: number }> = ({ digits }) => {
    const tickmarks = [<div className="place-slider-big-tick" key={-1}/>];

    for (let i = 0; i < digits - 1; i++) tickmarks.push(
        <div className="place-slider-dash" key={i * 2}/>,
        <div className="place-slider-little-tick" key={i * 2 + 1}/>,
    );

    tickmarks[tickmarks.length - 1] = <div className="place-slider-big-tick" key={tickmarks.length - 2}/>;

    return <>{tickmarks}</>;
}

const PlaceSlider: React.FC<Props> = ({
    digits,
    className,
    placeValue,
    setPlaceValue,
}) => {
    let handleRef = useRef<HTMLDivElement>(null);
    let fullRef = useRef<HTMLDivElement>(null);

    let dragInProgress = useRef(false);
    
    useEffect(() => {
        const handleOrNull = handleRef.current;
        const fullOrNull = fullRef.current;

        if (handleOrNull === null || fullOrNull === null) return;

        const handle = handleOrNull;
        const full = fullOrNull;


        const start = (event: [TouchEvent, 'touch'] | [MouseEvent, 'mouse']) => {
            dragInProgress.current = true;

            event[0].stopPropagation();
            event[0].preventDefault();
        };
        const touchStart = (event: TouchEvent) => start([event, 'touch']);
        const mouseStart = (event: MouseEvent) => start([event, 'mouse']);



        const move = (event: [TouchEvent, 'touch'] | [MouseEvent, 'mouse']) => {
            if (dragInProgress.current) {
                event[0].stopPropagation();
                event[0].preventDefault();
    
                const clientX = event[1] === 'mouse' ? event[0].clientX : event[0].touches[0].clientX;
    
                const bcr = full!.getBoundingClientRect();
                const width = bcr.width;
    
                const position = clientX - bcr.left;
    
                let lowestSeen = Infinity;
                let lowestSeenIndex = -1;
                for (let i = 0; i < digits; i++) {
                    const thisDist = Math.abs(position - width / (digits - 1) * (digits - i - 1));
                    if (thisDist < lowestSeen) {
                        lowestSeen = thisDist;
                        lowestSeenIndex = i;
                    }
                }
                
                const newPlaceValue = 10 ** lowestSeenIndex;
    
                if (newPlaceValue !== placeValue) setPlaceValue(_ => newPlaceValue);
            }
        };
        const touchMove = (event: TouchEvent) => move([event, 'touch']);
        const mouseMove = (event: MouseEvent) => move([event, 'mouse']);

        const end = (event: TouchEvent | MouseEvent) => {
            if (dragInProgress.current) {
                dragInProgress.current = false;
                event.stopPropagation();
                event.preventDefault();
            }
        };


        handle.addEventListener("touchstart", touchStart);
        handle.addEventListener("mousedown",  mouseStart);

        document.addEventListener("touchmove", touchMove);
        document.addEventListener("mousemove", mouseMove);

        document.addEventListener("touchend", end);
        document.addEventListener("mouseup",  end);

        
        return () => {
            handle.removeEventListener("touchstart", touchStart);
            handle.removeEventListener("mousedown",  mouseStart);

            document.removeEventListener("touchmove", touchMove);
            document.removeEventListener("mousemove", mouseMove);

            document.removeEventListener("touchend", end);
            document.removeEventListener("mouseup",  end);
        };
    }, [handleRef, fullRef, placeValue, digits, setPlaceValue]);

    return <div className={`place-slider-parent-flex-container  ${className ?? ""}`} ref={fullRef}>
        {<Tickmarks digits={digits}/>}
        <div className={`slider-handle value-${placeValue}`} ref={handleRef}>{placeValueMapping[placeValue.toString() as keyof typeof placeValueMapping]}</div>
    </div>;
};
 
export default PlaceSlider;
 