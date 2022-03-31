import { MenuItem } from "react-aria-menubutton";

import { ConstraintParams, ConstraintType } from '../libs/constraints';
import { ActionType } from "../stateManagement";

import "./ConstraintStatement.css";
import HasNumber from "./constraint-statement-types/HasNumber";
import CantHaveNumber from "./constraint-statement-types/CantHaveNumber";
import HasNumberInPlace from "./constraint-statement-types/HasNumberInPlace";
import CantHaveNumberInPlace from "./constraint-statement-types/CantHaveNumberInPlace";
import NOfNumsListInNumber from "./constraint-statement-types/NOfNumsListInNumber";

export type ConstraintStatementProps = ConstraintParams & { index: number, dispatch: React.Dispatch<ActionType | ActionType[]> };

export default function ConstraintStatements(props: ConstraintStatementProps & { digits: number, className: string, }): JSX.Element {
    const {
        HAS_NUMBER,
        HAS_NUMBER_IN_PLACE,
        CANT_BE_NUMBER,
        CANT_BE_NUMBERS_IN_PLACE,
        N_OF_NUMS_LIST_IN_NUMBER,
        N_OF_NUMS_LIST_IN_PLACES,
    } = ConstraintType;


    const { index, dispatch } = props;

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
            />;

        case CANT_BE_NUMBER:
            return <CantHaveNumber
                className={props.className}
                constraint={props}
                digits={props.digits}
                dispatch={dispatch}
                index={index}
            />;

        case CANT_BE_NUMBERS_IN_PLACE: 
            return <CantHaveNumberInPlace
                className={props.className}
                constraint={props}
                digits={props.digits}
                dispatch={dispatch}
                index={index}
            />

        case N_OF_NUMS_LIST_IN_NUMBER:
            return <NOfNumsListInNumber
                className={props.className}
                constraint={props}
                digits={props.digits}
                dispatch={dispatch}
                index={index}
            />;

        case N_OF_NUMS_LIST_IN_PLACES:
            return <></>;

        default:
            return <></>;
    }
}


export function newConstraintOfType(constraintType: ConstraintType): ConstraintParams {
    const {
        HAS_NUMBER,
        HAS_NUMBER_IN_PLACE,
        CANT_BE_NUMBER,
        CANT_BE_NUMBERS_IN_PLACE,
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
                place: 1,
            }
        
        case CANT_BE_NUMBER:
            return {
                cType: CANT_BE_NUMBER,
                nums: [],
            }

        case CANT_BE_NUMBERS_IN_PLACE:
            return {
                cType: CANT_BE_NUMBERS_IN_PLACE,
                nums: [],
                place: 1,
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
        CANT_BE_NUMBERS_IN_PLACE,
        N_OF_NUMS_LIST_IN_NUMBER,
        N_OF_NUMS_LIST_IN_PLACES,
    } = ConstraintType;
    switch (cType) {
        case HAS_NUMBER:
            return <MenuItem value={cType}>
                <div className="demo-constraint-statement"><span className="positive">YES!</span> <code>&lt;digit list&gt;</code></div>
            </MenuItem>;

        case HAS_NUMBER_IN_PLACE:
            return <MenuItem value={cType}>
                <div className="demo-constraint-statement"><span className="positive">YES!</span> <code>&lt;digit&gt;</code> in <code>&lt;place&gt;</code></div>
            </MenuItem>;

        case CANT_BE_NUMBER:
            return <MenuItem value={cType}>
                <div className="demo-constraint-statement"><span className="negative">NO!</span> <code>&lt;digit list&gt;</code></div>
            </MenuItem>;

        case CANT_BE_NUMBERS_IN_PLACE:
            return <MenuItem value={cType}>
                <div className="demo-constraint-statement"><span className="negative">NO!</span> <code>&lt;digit&gt;</code> in <code>&lt;place&gt;</code></div>
            </MenuItem>;

        case N_OF_NUMS_LIST_IN_NUMBER:
            return <MenuItem value={cType}>
                <div className="demo-constraint-statement"><span className="some">SOME!</span> <code>&lt;number&gt;</code> of <code>&lt;digit list&gt;</code></div>
            </MenuItem>;

        case N_OF_NUMS_LIST_IN_PLACES:
            return <></>;
            // return <MenuItem value={cType}>
            //     <div className="demo-constraint-statement">The number has <code>&lt;number&gt;</code> of the digits <code>&lt;digit list&gt;</code> in the <code>&lt;place&gt;</code>.</div>
            // </MenuItem>;
    }
}