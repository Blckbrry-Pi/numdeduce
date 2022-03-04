import { useCallback, useState } from "react";
import { ReactSVG } from "react-svg";

import AuthCode from "../../left/AuthCode";
import { CBNConstraint } from "../../libs/constraints";
import { ActionTypeTag, ActionType } from "../../stateManagement";
import TrashIcon from '../../trashIcon.svg';

interface CantHaveNumberProps {
    className: string;
    constraint: CBNConstraint;
    digits: number;
    dispatch: React.Dispatch<ActionType | ActionType[]>;
    index: number;
}

export default function CantHaveNumber( { className, constraint, dispatch, index }: CantHaveNumberProps ) {
    const [ digitCount, setDigitCount ] = useState<number>(0);

    const { cType } = constraint;

    const onNumChangeClosure = (value: string) => {
        const newNumList = value.split("").map(Number).filter(Boolean);
        dispatch({
            _tag: ActionTypeTag.UPDATE_CONSTRAINT,
            index: index,
            constraint: { cType, nums: newNumList },
        });
        setDigitCount(newNumList.length);
    };

    const deleteConstraint = useCallback(() => dispatch({ _tag: ActionTypeTag.DELETE_CONSTRAINT, index }), [dispatch, index] );

    return <div className={`constraint-statement ${className}`}>
        <div className="constraint-statement-content">The number can't have the digits <AuthCode
            characters={Math.min(digitCount + 1, 10)}
            allowedCharacters={/\d/}
            onChange={onNumChangeClosure}
            containerClassName="constraint-digit-container"
            inputClassName="constraint-digit-input"
            inputType="tel"
        /> anywhere in it.</div>
        <ReactSVG src={TrashIcon} className="constraint-statement-remove-icon" onClick={deleteConstraint}/>
    </div>;
}