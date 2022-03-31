import { useCallback, useState } from "react";
import { ReactSVG } from "react-svg";

import AuthCode from "../../libs/AuthCode";
import { CBNIPConstraint } from "../../libs/constraints";
import PlaceSlider from "../../libs/place-slider/PlaceSlider";
import { ActionTypeTag, ActionType } from "../../stateManagement";
import TrashIcon from '../../trashIcon.svg';

interface HasNumberInPlaceProps {
    className: string;
    constraint: CBNIPConstraint;
    digits: number;
    dispatch: React.Dispatch<ActionType | ActionType[]>;
    index: number;
}

export default function CantHaveNumberInPlace( { className, constraint, digits, dispatch, index }: HasNumberInPlaceProps ) {
    const [ digitCount, setDigitCount ] = useState<number>(0);

    const { cType, nums, place } = constraint;

    const onNumsChangeClosure = (value: string) => {
        const newNumList = value.split("").map(Number).filter(n => !Number.isNaN(n));
        dispatch({
            _tag: ActionTypeTag.UPDATE_CONSTRAINT,
            index: index,
            constraint: { cType, place, nums: newNumList },
        });
        setDigitCount(newNumList.length);
    };

    const onPlaceChangeClosure = (value: number) => {
        dispatch({
            _tag: ActionTypeTag.UPDATE_CONSTRAINT,
            index: index,
            constraint: { cType, nums, place: value },
        });
    };

    const deleteConstraint = useCallback(() => dispatch({ _tag: ActionTypeTag.DELETE_CONSTRAINT, index }), [dispatch, index] );

    return <div className={`constraint-statement ${className}`}>
        <div className="constraint-statement-content"><span className="negative">NO!</span> <AuthCode
            characters={Math.min(digitCount + 1, 10)}
            allowedCharacters={/\d/}
            onChange={onNumsChangeClosure}
            containerClassName="constraint-digit-container"
            inputClassName="constraint-digit-input"
            inputType="tel"
        /> in <PlaceSlider
            placeValue={place}
            setPlaceValue={onPlaceChangeClosure}
            digits={digits}
        /></div>
        <ReactSVG src={TrashIcon} className="constraint-statement-remove-icon" onClick={deleteConstraint}/>
    </div>;
}