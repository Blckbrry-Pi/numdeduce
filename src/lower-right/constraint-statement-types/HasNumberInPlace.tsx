import { useCallback, useState } from "react";
import { OptionValue, SimpleSelect } from "react-selectize";
import { ReactSVG } from "react-svg";

import AuthCode from "../../left/AuthCode";
import { HNIPConstraint } from "../../libs/constraints";
import { ActionTypeTag, ActionType } from "../../stateManagement";
import TrashIcon from '../../trashIcon.svg';

interface HasNumberInPlaceProps {
    className: string;
    constraint: HNIPConstraint;
    digits: number;
    dispatch: React.Dispatch<ActionType | ActionType[]>;
    index: number;
    options: OptionValue[];
}

export default function HasNumberInPlace( { className, constraint, dispatch, index, options }: HasNumberInPlaceProps ) {
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

    const onPlaceChangeClosure = (value: OptionValue) => {
        if (!options.some(option => value && option.label === value.label && option.value === value.value)) return;
        dispatch({
            _tag: ActionTypeTag.UPDATE_CONSTRAINT,
            index: index,
            constraint: { cType, num, place: value.value },
        });
    };

    return <div className={`constraint-statement ${className}`}>
        <div className="constraint-statement-content">The number has a <AuthCode
            characters={1}
            allowedCharacters={/\d/}
            onChange={onNumChangeClosure}
            containerClassName="constraint-digit-container"
            inputClassName={`constraint-digit-input ${numError ? "constraint-digit-input-error" : ""}`}
            inputType="tel"
        /> in the {<SimpleSelect
            className="constraint-dropdown-menu"
            options = {options}
            theme = "material"
            onValueChange={onPlaceChangeClosure}
            defaultValue={{label: "place", value: place}}
            transitionEnter = {true}
        />}.</div>
        <ReactSVG src={TrashIcon} className="constraint-statement-remove-icon" onClick={deleteConstraint}/>
    </div>;
}