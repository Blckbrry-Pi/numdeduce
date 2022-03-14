import { useCallback, useState } from "react";
import { ReactSVG } from "react-svg";

import AuthCode from "../../left/AuthCode";
import { HNConstraint } from "../../libs/constraints";
import { ActionTypeTag, ActionType } from "../../stateManagement";
import TrashIcon from '../../trashIcon.svg';

interface HasNumberProps {
    className: string;
    constraint: HNConstraint;
    digits: number;
    dispatch: React.Dispatch<ActionType | ActionType[]>;
    index: number;
}

export default function HasNumber( { className, constraint, digits, dispatch, index }: HasNumberProps ) {
    const [ digitCount, setDigitCount ] = useState<number>(0);

    const { cType } = constraint;

    const onNumsChangeClosure = (value: string) => {
        const newNumList = value.split("").map(Number).filter(n => !Number.isNaN(n));
        dispatch({
            _tag: ActionTypeTag.UPDATE_CONSTRAINT,
            index: index,
            constraint: { cType, nums: newNumList },
        });
        setDigitCount(newNumList.length);
    };

    const deleteConstraint = useCallback(() => dispatch({ _tag: ActionTypeTag.DELETE_CONSTRAINT, index }), [dispatch, index] );

    return <div className={`constraint-statement ${className}`}>
        <div className="constraint-statement-content"><span className="positive">YES!</span> <AuthCode
            characters={Math.min(digitCount + 1, digits)}
            allowedCharacters={/\d/}
            onChange={onNumsChangeClosure}
            containerClassName="constraint-digit-container"
            inputClassName="constraint-digit-input"
            inputType="tel"
        /></div>
        <ReactSVG src={TrashIcon} className="constraint-statement-remove-icon" onClick={deleteConstraint}/>
    </div>;
}