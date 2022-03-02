import { ConstraintParams, ConstraintType, NONLINConstraint, NONLIPConstraint } from "./constraints";
import checkIfValid from "./validation";

export function returnWithEditedElement<T>(arr: T[], newElement: T, index: number) {
    const newArr = [...arr];
    newArr[index] = newElement;
    return newArr;
}

export function digitDeactivated(digit: number, constraints: (ConstraintParams | null)[], places: number[]) {
    const remainingPlaces = new Set(places);
    const {
        CANT_BE_NUMBER,
        CANT_BE_NUMBER_IN_PLACE,
    } = ConstraintType;

    for (const constraint of constraints) {
        if (!constraint) continue;
        
        switch (constraint.cType) {
            case CANT_BE_NUMBER:
                if (constraint.num === digit) return true;
                break;

            case CANT_BE_NUMBER_IN_PLACE:
                if (constraint.num === digit) remainingPlaces.delete(constraint.place || 0);
                if (remainingPlaces.size === 0) return true;
                break;

            default:
                break;
        }
    }

    return false;
}
export function digitDefinite(digit: number, constraints: (ConstraintParams | null)[]) {
    const {
        HAS_NUMBER,
        CANT_BE_NUMBER,
    } = ConstraintType;

    for (const constraint of constraints) {
        if (!constraint) continue;
        
        switch (constraint.cType) {
            case HAS_NUMBER:
                if (constraint.num === digit) return true;
                break;

            case CANT_BE_NUMBER:
                if (constraint.num === digit) return false;
                break;

            default:
                break;
        }
    }

    return false;
}


export function placeValueDeactivated(digit: number, placeValue: number, constraints: (ConstraintParams | null)[]) {
    const {
        HAS_NUMBER_IN_PLACE,
        CANT_BE_NUMBER,
        CANT_BE_NUMBER_IN_PLACE,
    } = ConstraintType;

    for (const constraint of constraints) {
        if (!constraint) continue;

        switch (constraint.cType) {
            case HAS_NUMBER_IN_PLACE:
                if (constraint.place === placeValue && constraint.num !== digit) return true;
                if (constraint.place !== placeValue && constraint.num === digit) return true;
                break;

            case CANT_BE_NUMBER:
                if (constraint.num === digit) return true;
                break;

            case CANT_BE_NUMBER_IN_PLACE:
                if (constraint.place === placeValue && constraint.num === digit) return true;
                break;

            default:
                break;
        }
    }

    return false;
}

export function placeValueDefinite(digit: number, placeValue: number, constraints: (ConstraintParams | null)[]) {
    const {
        HAS_NUMBER_IN_PLACE,
        CANT_BE_NUMBER,
        CANT_BE_NUMBER_IN_PLACE,
    } = ConstraintType;

    for (const constraint of constraints) {
        if (!constraint) continue;

        switch (constraint.cType) {

            case HAS_NUMBER_IN_PLACE:
                if (constraint.num === digit && constraint.place === placeValue) return true;
                break;

            
            case CANT_BE_NUMBER:
                if (constraint.num === digit) return false;
                break;
            
            case CANT_BE_NUMBER_IN_PLACE:
                if (constraint.num === digit && constraint.place === placeValue) return false;
                break;

            default:
                break;
        }
    }

    return false;
}

export function getNeedWrappers(constraints: (ConstraintParams | null)[]): (NONLINConstraint | NONLIPConstraint)[] {
    return constraints.filter(
        constraint => constraint && [
            ConstraintType.N_OF_NUMS_LIST_IN_NUMBER,
            ConstraintType.N_OF_NUMS_LIST_IN_PLACES
        ].includes(constraint.cType)
    ) as (NONLINConstraint | NONLIPConstraint)[];
}

export function digitInWrapperConstraints(digit: number, constraints: (NONLINConstraint | NONLIPConstraint)[]): boolean[] {
    return constraints.map(
        constraint =>
            (constraint.cType === ConstraintType.N_OF_NUMS_LIST_IN_NUMBER)
            && (constraint.n !== null)
            && (constraint.nums.includes(digit))
    );
}

export function generateNumber(digits: number): string {
    while (true) {
        let x = String((Math.random() * Number.MAX_SAFE_INTEGER) % (10 ** digits));
        if (checkIfValid(x, [], digits) === null) return x;
    }
}

export function getValues(answerFunction: () => string, guess: string): { numCor: number, numPla: number } {
    let sum = (arr: boolean[]) => arr.reduce((oldSum, newVal) => oldSum + Number(newVal), 0);
    return {
         numCor: sum(guess.split("").map((c, _) => answerFunction().includes(c))),
         numPla: sum(guess.split("").map((c, i) => answerFunction().charAt(i) === c)),
    }
}