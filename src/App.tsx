import React, { useEffect, useReducer } from 'react';

import './App.css';

import Phrases from './lower-right/Phrases';

import ConstraintChart from './top-right/ConstraintChart';
import dispatch, { ActionTypeTag } from './stateManagement';
import { ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/scss/notification.scss';
import checkIfValid, { fitsConstraints, HardValidationFailure } from './libs/validation';
import { Store } from "react-notifications-component";
import { ConfirmConstraintOverride, HardError } from "./Notifications";
import GuessHandler from './left/GuessHandler';




function App() {
    const [state, stateAction] = useReducer(dispatch, {
        digits: 4,
        currGuess: "",
        prevGuesses: [],
        constraints: [],
    });

    useEffect(() => stateAction({ _tag: ActionTypeTag.SET_DIGITS, numDigits: 4 }), []);

    console.log(state.getAnswer?.());

    const { prevGuesses: guesses, digits, constraints } = state;

    const constraintError = (value: string): void => {
        const idObj = {
            id: "",
        };

        Store.removeAllNotifications();
        idObj.id = Store.addNotification({
            title: "Guess does not fit constraints!",
            message: <ConfirmConstraintOverride callback={() => {
                const idObjSelf = idObj;
                Store.removeNotification(idObjSelf.id);
                stateAction({ _tag: ActionTypeTag.ADD_GUESS, guess: value });
            }} />,

            type: "warning",
            container: "bottom-right",

            dismiss: {
                duration: 3000,
                pauseOnHover: true,
                showIcon: true,
            }
        });
    };
    const hardError = (reason: HardValidationFailure): void => {
        Store.removeAllNotifications();
        Store.addNotification({
            title: "Guess is not valid!",
            message: <HardError reason={reason} />,

            type: "danger",
            container: "bottom-right",

            dismiss: {
                duration: 3000,
                pauseOnHover: true,
                showIcon: true,
            }
        });
    };

    const onSubmitAttempt = (guess: string) => {
        const hardValid = checkIfValid(guess, guesses.map(g => g.guess), digits);
        if (hardValid !== null) hardError(hardValid);
        else if (!fitsConstraints(guess, constraints)) constraintError(guess);
        else stateAction({ _tag: ActionTypeTag.ADD_GUESS, guess });
    };

    return (
        <div className="App side-side-parent">
            <div className="side-side-child" id="left-side">
                <GuessHandler
                    dispatch={stateAction}
                    onSubmitAttempt={onSubmitAttempt}
                    digits={digits}
                    guessData={guesses}
                />
            </div>
            <div className="side-side-child">
                <ConstraintChart constraints={constraints} digits={digits}/>
                <Phrases constraints={constraints} dispatch={stateAction} digits={digits}/>
            </div>
            
            <ReactNotifications />
        </div>
    );
}

export default App;
