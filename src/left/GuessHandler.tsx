import { ActionType, ActionTypeTag, Guess } from "../stateManagement";
import AuthCode from "../libs/AuthCode";
import DoneGuess from "./DoneGuess";

import "./GuessHandler.css";

export interface GuessHandlerProps {
    dispatch: React.Dispatch<ActionType | ActionType[]>;
    onSubmitAttempt: (value: string | null) => void;
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
            guessIdx={index}
            {...singleGuess}
        /> )}
        <div className="guess-container">
            <span className="guess-number">{guessData.length + 1}</span>
            <AuthCode
                characters={digits}
                allowedCharacters={/\d/}
                onChange={value => dispatch({ _tag: ActionTypeTag.SET_CURR_GUESS, guess: value })}
                onSubmit={onSubmitAttempt}
                containerClassName='guess-number-container'
                inputClassName={`guess-cell`}

                key={-guessData.length - 1}
            />
            <button onClick={() => onSubmitAttempt(null)}>Submit</button>
        </div>
        
    </>
}
