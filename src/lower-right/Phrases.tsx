import React from 'react';

import { ConstraintParams } from '../libs/constraints';
import ConstraintStatements, { newConstraintOfType } from './ConstraintStatements';
import NewPhraseDropdown from './NewPhraseDropdown';
import './Phrases.css';
import { ActionType, ActionTypeTag } from '../stateManagement';

interface PhrasesProps {
    constraints: (ConstraintParams | null)[];
    dispatch: React.Dispatch<ActionType | ActionType[]>;
    digits: number;
}

function Phrases(
    { constraints, dispatch, digits, }: PhrasesProps
) {
    return (
        <div className="phrases-wrapper">
            <NewPhraseDropdown onMenuSelected={constraintType => dispatch({
                _tag: ActionTypeTag.ADD_CONSTRAINT,
                constraint: newConstraintOfType(constraintType),
            })}/>
            {constraints.map(
                (constraint, index) => constraint === null ? <React.Fragment key={index} ></React.Fragment> : <ConstraintStatements
                    className="phrase"
                    key={index}
                    index={index}
                    digits={digits}
                    {...constraint}
                    dispatch={dispatch}
                />
            )}
        </div>
    );
}

export default Phrases;