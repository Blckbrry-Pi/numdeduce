import { useCallback, useState } from "react";
import { ReactSVG } from "react-svg";


import AuthCode from "../../left/AuthCode";
import { NONLINConstraint } from "../../libs/constraints";
import { ActionType, ActionTypeTag } from "../../stateManagement";
import TrashIcon from '../../trashIcon.svg';

interface HasNumberInPlaceProps {
    className: string;
    constraint: NONLINConstraint;
    digits: number;
    dispatch: React.Dispatch<ActionType | ActionType[]>;
    index: number;
}

export default function NOfNumsListInNumber({ className, constraint, dispatch, index }: HasNumberInPlaceProps) {
    const [ digitCount, setDigitCount ] = useState<number>(0);
    const [numError, setNumError] = useState<boolean>(false);

    const { n } = constraint;

    const onNChangeClosure = (value: string) => {
        let newN = Number(value);
        let invalidNum = Number.isNaN(newN);
        dispatch({
            _tag: ActionTypeTag.UPDATE_CONSTRAINT,
            index: index, 
            constraint: { ...constraint, n: invalidNum ? null : newN },
        });
        setNumError(invalidNum);
    };

    const onNumsChangeClosure = (value: string) => {
        const newNumList = value.split("").map(Number).filter(n => !Number.isNaN(n));
        const newN = n && Math.min(newNumList.length, n);
        dispatch({
            _tag: ActionTypeTag.UPDATE_CONSTRAINT,
            index: index, 
            constraint: { ...constraint, nums: newNumList, n: newN  },
        });
        setDigitCount(newNumList.length);
    };

    const deleteConstraint = useCallback(() => dispatch({ _tag: ActionTypeTag.DELETE_CONSTRAINT, index }), [dispatch, index] );

    //new RegExp(`[1-${value}]`);
    return <div className={`constraint-statement ${className}`}>
        <div className="constraint-statement-content"><span className="positive">YES!</span> <AuthCode
            characters={1}
            allowedCharacters={new RegExp(`[0-${digitCount}]`)}
            onChange={onNChangeClosure}
            containerClassName="constraint-digit-container"
            inputClassName={`constraint-digit-input ${numError ? "constraint-digit-input-error" : ""}`}
            inputType="tel"
        /> of <AuthCode
            characters={Math.min(digitCount + 1, 9)}
            allowedCharacters={/\d/}
            onChange={onNumsChangeClosure}
            containerClassName="constraint-digit-container"
            inputClassName={`constraint-digit-input ${numError ? "constraint-digit-input-error" : ""}`}
            inputType="tel"
        /></div>
        <ReactSVG src={TrashIcon} className="constraint-statement-remove-icon" onClick={deleteConstraint}/>
    </div>;
}