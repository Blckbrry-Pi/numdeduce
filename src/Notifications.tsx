import { HardValidationFailure } from "./libs/validation";

export function ConfirmConstraintOverride({ callback }: { callback: () => void }): JSX.Element {
    return <>
        Click here to override the constraints and submit anyway. <br/> <button onClick={callback}> Override</button>
    </>;
}

export function HardError( { reason }: { reason: HardValidationFailure } ): JSX.Element {
    switch (reason) {
        case "wrongLength": return <>Make sure your guess has as many digits as the target number!</>;

        case "beginsWith0": return <>Leading 0s aren't allowed!</>;
        
        case "digitRepeat": return <>All the digits in your guess must be unique!</>;
        
        case "guessRepeat": return <>You've already guessed this number before!</>;
    }
}