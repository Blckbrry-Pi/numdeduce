import { useEffect, useState } from "react";
import { MenuItem } from "react-aria-menubutton";
import AuthCode from '../left/AuthCode';
import { OptionValue, SimpleSelect } from "react-selectize";
import { ReactSVG } from "react-svg";

import { ConstraintParams, ConstraintType, NONLINConstraint } from '../libs/constraints';

import "./ConstraintStatement.css";
import TrashIcon from '../trashIcon.svg';
import { ActionType, ActionTypeTag } from "../stateManagement";
import HasNumber from "./constraint-statement-types/HasNumber";
import CantHaveNumber from "./constraint-statement-types/CantHaveNumber";
import HasNumberInPlace from "./constraint-statement-types/HasNumberInPlace";

export type ConstraintStatementProps = ConstraintParams & { index: number, dispatch: React.Dispatch<ActionType | ActionType[]> };

export default function ConstraintStatements(props: ConstraintStatementProps & { digits: number, className: string, }): JSX.Element {
    const {
        HAS_NUMBER,
        HAS_NUMBER_IN_PLACE,
        CANT_BE_NUMBER,
        CANT_BE_NUMBER_IN_PLACE,
        N_OF_NUMS_LIST_IN_NUMBER,
        N_OF_NUMS_LIST_IN_PLACES,
    } = ConstraintType;

    const [numError, setNumError] = useState<boolean>(false);
    const options = Array(props.digits).fill(null).map((_, index) => ({label: `${10 ** index}s place`, value: 10 ** index}));

    useEffect(() => setNumError(false), [props.cType]);

    const { index, dispatch } = props;

    const deleteConstraint = () => dispatch({ _tag: ActionTypeTag.DELETE_CONSTRAINT, index });

    switch (props.cType) {
        case HAS_NUMBER:
            return <HasNumber
                className={props.className}
                constraint={props}
                digits={props.digits}
                dispatch={dispatch}
                index={index}
            />;
            

        case HAS_NUMBER_IN_PLACE:
            return <HasNumberInPlace
                className={props.className}
                constraint={props}
                digits={props.digits}
                dispatch={dispatch}
                index={index}
                options={options}
            />;

        case CANT_BE_NUMBER:
            return <CantHaveNumber
                className={props.className}
                constraint={props}
                digits={props.digits}
                dispatch={dispatch}
                index={index}
            />;

        case CANT_BE_NUMBER_IN_PLACE: {
            const onNumChangeClosure = (value: string) => {
                const { cType, place } = props;
                dispatch({
                    _tag: ActionTypeTag.UPDATE_CONSTRAINT,
                    index: index,
                    constraint: { cType, place, num: value ? Number(value) : null },
                });
                setNumError(!value);
            };

            const onPlaceChangeClosure = (value: OptionValue) => {
                if (!options.some(option => option.label === value.label && option.value === value.value)) return;
                const { cType, num } = props;
                dispatch({
                    _tag: ActionTypeTag.UPDATE_CONSTRAINT,
                    index: index,
                    constraint: { cType, num, place: value.value },
                });
                setNumError(false);
            };

            return <div className={`constraint-statement ${props.className}`}>
                <div className="constraint-statement-content">The number can't have a <AuthCode
                    characters={1}
                    allowedCharacters={/\d/}
                    onChange={onNumChangeClosure}
                    containerClassName="constraint-digit-container"
                    inputClassName={`constraint-digit-input ${numError ? "constraint-digit-input-error" : ""}`}
                    inputType="tel"
                /> in the <SimpleSelect
                    className="constraint-dropdown-menu"
                    onValueChange={onPlaceChangeClosure}
                    options = {options}
                    theme = "material"
                    defaultValue={{label: "place", value: props.place}}
                    transitionEnter = {true}
                />.</div>
                <ReactSVG src={TrashIcon} className="constraint-statement-remove-icon" onClick={deleteConstraint}/>
            </div>;
        }

        case N_OF_NUMS_LIST_IN_NUMBER: {
            const onNumsChangeClosure = (value: string) => {
                const { cType, n } = props;
                dispatch({
                    _tag: ActionTypeTag.UPDATE_CONSTRAINT,
                    index: index,
                    constraint: { cType, n, nums: value.split("").map(Number) },
                });
                setNumError(false);
            };

            const onNChangeClosure = (value: string) => {
                const { cType, nums } = props;
                dispatch({
                    _tag: ActionTypeTag.UPDATE_CONSTRAINT,
                    index: index,
                    constraint: { cType, nums, n: value ? Number(value) : null },
                });
                setNumError(!value);
            };

            return <ConstraintStatementNonlin
                onNumsChangeClosure={onNumsChangeClosure}
                onNChangeClosure={onNChangeClosure}
                deleteConstraint={deleteConstraint}
                {...props}
                numError={numError}
            />;
        }

        case N_OF_NUMS_LIST_IN_PLACES:
            return <></>;

        default:
            return <></>;
    }
}

type NonlinConstraintData = NONLINConstraint & { digits: number, className: string, } & {
    onNumsChangeClosure: (value: string) => void;
    onNChangeClosure: (value: string) => void;
    deleteConstraint: () => void;
} & { numError: boolean };

function ConstraintStatementNonlin(constraintData: NonlinConstraintData) {
    const { onNumsChangeClosure, onNChangeClosure, deleteConstraint } = constraintData;
    const { numError } = constraintData;

    const [ digitCount, setDigitCount ] = useState<number>(0);

    //new RegExp(`[1-${value}]`);
    return <div className={`constraint-statement ${constraintData.className}`}>
        <div className="constraint-statement-content">The number has <AuthCode
            characters={1}
            allowedCharacters={new RegExp(`[0-${digitCount}]`)}
            onChange={onNChangeClosure}
            containerClassName="constraint-digit-container"
            inputClassName={`constraint-digit-input ${numError ? "constraint-digit-input-error" : ""}`}
            inputType="tel"
        /> of the digits <AuthCode
            characters={Math.min(digitCount + 1, 9)}
            allowedCharacters={/\d/}
            onChange={value => {
                setDigitCount(value.length);
                onNumsChangeClosure(value);
            }}
            containerClassName="constraint-digit-container"
            inputClassName={`constraint-digit-input ${numError ? "constraint-digit-input-error" : ""}`}
            inputType="tel"
        /> in it.</div>
        <ReactSVG src={TrashIcon} className="constraint-statement-remove-icon" onClick={deleteConstraint}/>
    </div>;
}

export function newConstraintOfType(constraintType: ConstraintType): ConstraintParams {
    const {
        HAS_NUMBER,
        HAS_NUMBER_IN_PLACE,
        CANT_BE_NUMBER,
        CANT_BE_NUMBER_IN_PLACE,
        N_OF_NUMS_LIST_IN_NUMBER,
        N_OF_NUMS_LIST_IN_PLACES,
    } = ConstraintType;
    switch (constraintType) {
        case HAS_NUMBER:
            return {
                cType: HAS_NUMBER,
                nums: [],
            }
        
        case HAS_NUMBER_IN_PLACE:
            return {
                cType: HAS_NUMBER_IN_PLACE,
                num: null,
                place: null,
            }
        
        case CANT_BE_NUMBER:
            return {
                cType: CANT_BE_NUMBER,
                nums: [],
            }

        case CANT_BE_NUMBER_IN_PLACE:
            return {
                cType: CANT_BE_NUMBER_IN_PLACE,
                num: null,
                place: null,
            }

        case N_OF_NUMS_LIST_IN_NUMBER:
            return {
                cType: N_OF_NUMS_LIST_IN_NUMBER,
                nums: [],
                n: 0,
            }

        case N_OF_NUMS_LIST_IN_PLACES:
            return {
                cType: N_OF_NUMS_LIST_IN_PLACES,
                nums: [],
                n: 0,
                place: null
            }
    }
}

export function NewConstraintStatementDemo({ cType }: { cType: ConstraintType } ): JSX.Element {
    const {
        HAS_NUMBER,
        HAS_NUMBER_IN_PLACE,
        CANT_BE_NUMBER,
        CANT_BE_NUMBER_IN_PLACE,
        N_OF_NUMS_LIST_IN_NUMBER,
        N_OF_NUMS_LIST_IN_PLACES,
    } = ConstraintType;
    switch (cType) {
        case HAS_NUMBER:
            return <MenuItem value={cType}>
                <div className="demo-constraint-statement">The number has the digits <code>&lt;digit list&gt;</code> in it.</div>
            </MenuItem>;

        case HAS_NUMBER_IN_PLACE:
            return <MenuItem value={cType}>
                <div className="demo-constraint-statement">The number has a <code>&lt;digit&gt;</code> in the <code>&lt;place&gt;</code>.</div>
            </MenuItem>;

        case CANT_BE_NUMBER:
            return <MenuItem value={cType}>
                <div className="demo-constraint-statement">The number can't have the digits <code>&lt;digit list&gt;</code> anywhere in it.</div>
            </MenuItem>;

        case CANT_BE_NUMBER_IN_PLACE:
            return <MenuItem value={cType}>
                <div className="demo-constraint-statement">The number can't have a <code>&lt;digit&gt;</code> in the <code>&lt;place&gt;</code>.</div>
            </MenuItem>;

        case N_OF_NUMS_LIST_IN_NUMBER:
            return <MenuItem value={cType}>
                <div className="demo-constraint-statement">The number has <code>&lt;number&gt;</code> of the digits <code>&lt;digit list&gt;</code> in it.</div>
            </MenuItem>;

        case N_OF_NUMS_LIST_IN_PLACES:
            return <MenuItem value={cType}>
                <div className="demo-constraint-statement">The number has <code>&lt;number&gt;</code> of the digits <code>&lt;digit list&gt;</code> in the <code>&lt;place&gt;</code>.</div>
            </MenuItem>;
    }
}