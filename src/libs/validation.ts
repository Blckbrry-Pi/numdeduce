import { ConstraintParams, ConstraintType } from "./constraints";

function getPlaceIndex(place: number, digits: number) {
    return digits - Math.round(Math.log10(place)) - 1;
}

export function fitsConstraint(guess: string, constraint: ConstraintParams): boolean {
    const guessDigits = guess.split("").map(Number);

    switch (constraint.cType) {
        case ConstraintType.HAS_NUMBER:
            return constraint.nums.every(num => guessDigits.includes(num));
        
        case ConstraintType.HAS_NUMBER_IN_PLACE:
            return constraint.num !== null
                && constraint.place !== null
                && guessDigits[getPlaceIndex(constraint.place, guessDigits.length)] === constraint.num;

        case ConstraintType.CANT_BE_NUMBER:
            return !constraint.nums.some(num => guessDigits.includes(num));

        case ConstraintType.CANT_BE_NUMBERS_IN_PLACE:
            return constraint.place !== null
                && !constraint.nums.includes(guessDigits[getPlaceIndex(constraint.place, guessDigits.length)]);
        
        case ConstraintType.N_OF_NUMS_LIST_IN_NUMBER: {
            const booleansMatched = constraint.nums.map(digit => guessDigits.includes(digit));
            const totalMatched = booleansMatched.reduce((currSum, newVal) => currSum + Number(newVal), 0);

            return constraint.n !== null
                && totalMatched === constraint.n;
        }
        
        case ConstraintType.N_OF_NUMS_LIST_IN_PLACES:
            return false;
    }
}

export function fitsConstraints(guess: string, constraints: (ConstraintParams | null)[]): boolean {
    
    return constraints.filter(Boolean).every(constraint => constraint && fitsConstraint(guess, constraint));
}

export type HardValidationFailure = "wrongLength" | "beginsWith0" | "digitRepeat" | "guessRepeat";

export default function checkIfValid(guess: string, prevGuesses: string[], digits: number): HardValidationFailure | null {
    if (guess.length !== digits) return "wrongLength";
    if (String(Number(guess)).length !== digits) return "beginsWith0";

    if (new Set(guess.split("")).size !== digits) return "digitRepeat";

    // if (prevGuesses.includes(guess)) return "guessRepeat";

    return null;
    // return fitsConstraints(guess, constraints.flatMap(posConstraint => posConstraint ?? []));
}