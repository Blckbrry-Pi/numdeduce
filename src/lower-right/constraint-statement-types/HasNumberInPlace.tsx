import { useCallback, useState } from "react";
import { ReactSVG } from "react-svg";

import AuthCode from "../../libs/AuthCode";
import { HNIPConstraint } from "../../libs/constraints";
import PlaceSlider from "../../libs/place-slider/PlaceSlider";
import { ActionTypeTag, ActionType } from "../../stateManagement";
import TrashIcon from '../../trashIcon.svg';

interface HasNumberInPlaceProps {
    className: string;
    constraint: HNIPConstraint;
    digits: number;
    dispatch: React.Dispatch<ActionType | ActionType[]>;
    index: number;
}

export default function HasNumberInPlace( { className, constraint, dispatch, index, digits }: HasNumberInPlaceProps ) {
    const [numError, setNumError] = useState<boolean>(false);

    const deleteConstraint = useCallback(() => dispatch({ _tag: ActionTypeTag.DELETE_CONSTRAINT, index }), [dispatch, index] );

    const { cType, num, place } = constraint;

    const onNumChangeClosure = (value: string) => {
        if (value) {
            dispatch({
                _tag: ActionTypeTag.UPDATE_CONSTRAINT,
                index: index,
                constraint: { cType, place, num: Number(value) },
            });
            setNumError(false);
        } else {
            dispatch({
                _tag: ActionTypeTag.UPDATE_CONSTRAINT,
                index: index,
                constraint: { cType, place, num: null },
            });
            setNumError(true);
        }
    };

    const onPlaceChangeClosure = (value: number) => {
        dispatch({
            _tag: ActionTypeTag.UPDATE_CONSTRAINT,
            index: index,
            constraint: { cType, num, place: value },
        });
        console.log(num);
    };

    return <div className={`constraint-statement ${className}`}>
        <div className="constraint-statement-content"><span className="positive">YES!</span> <AuthCode
            characters={1}
            allowedCharacters={/\d/}
            onChange={onNumChangeClosure}
            containerClassName="constraint-digit-container"
            inputClassName={`constraint-digit-input ${numError ? "constraint-digit-input-error" : ""}`}
            inputType="tel"
        /> in <PlaceSlider
            placeValue={place}
            setPlaceValue={onPlaceChangeClosure}
            digits={digits}
        /></div>
        <ReactSVG src={TrashIcon} className="constraint-statement-remove-icon" onClick={deleteConstraint}/>
    </div>;
}