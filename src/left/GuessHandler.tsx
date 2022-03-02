import { ActionType, ActionTypeTag, Guess } from "../stateManagement";
import AuthCode from "./AuthCode";
import DoneGuess from "./DoneGuess";

import "./GuessHandler.css";

export interface GuessHandlerProps {
    dispatch: React.Dispatch<ActionType | ActionType[]>;
    onSubmitAttempt: (value: string) => void;
    digits: number;
    guessData: Guess[];
}

export default function GuessHandler({ dispatch, onSubmitAttempt, digits, guessData }: GuessHandlerProps) {

    return <>

        <div className="guess-header-container">
            <span className="guess-number-container"> Guess</span>
            <span className="guess-data-header"># correct</span>
            <span className="guess-data-header"># placed correctly</span>
        </div>
        {guessData.map((singleGuess, index) => <DoneGuess
            key={index}
            digits={digits}
            {...singleGuess}
        /> )}
        <div className="guess-container">
            <AuthCode
                characters={digits}
                allowedCharacters={/\d/}
                onChange={value => dispatch({ _tag: ActionTypeTag.SET_CURR_GUESS, guess: value })}
                onSubmit={onSubmitAttempt}
                containerClassName='guess-number-container'
                inputClassName={`guess-cell`}
                inputType="tel"
                key={-guessData.length - 1}
            />
            <span className="returned-guess-data">?</span>
            <span className="returned-guess-data">?</span>
        </div>
        
    </>
}