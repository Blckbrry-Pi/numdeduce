import { Guess } from "../stateManagement";
import AuthCode from "../libs/AuthCode";

export interface DoneGuessProps extends Guess {
    digits: number;
    guessIdx: number;
}


export default function DoneGuess({ digits, guess, numCor, numPla, guessIdx }: DoneGuessProps) {
    return <div className="guess-container">
            <span className="guess-number">{guessIdx + 1}</span>
            <AuthCode
                characters={digits}
                allowedCharacters={/\d/}
                defaultValue={guess}
                disabled={true}
                onChange={() => void(0)}
                containerClassName='guess-number-container'
                inputClassName='guess-cell'
                inputType="tel"
            />
            <span className="returned-guess-data">{numCor}</span>
            <span className="returned-guess-data">{numPla}</span>
        </div>;
}