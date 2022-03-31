import { ConstraintParams } from "./libs/constraints";
import { generateNumber, getValues, returnWithEditedElement } from "./libs/utils";

export namespace Popup {
    export interface PopupActions {
        close: () => void;
        action?: () => void;
    };
    
    export interface Popup extends PopupActions {
        popup: (props: PopupActions) => JSX.Element;
    }
}

export interface Guess {
    guess: string;
    numCor: number;
    numPla: number;
}

export interface AppState {
    digits: number;
    settingsOpen: boolean;

    currGuess: string;
    prevGuesses: Guess[];

    constraints: (ConstraintParams | null)[];

    getAnswer?: () => string;

    popupBox?: Popup.Popup | null;
}



export namespace ActionTypes {
    export enum ActionTypeTag {
        SET_DIGITS,
        SET_SETTINGS_OPEN,
        
        SET_CURR_GUESS,
        ADD_GUESS,
        
        ADD_CONSTRAINT,
        UPDATE_CONSTRAINT,
        DELETE_CONSTRAINT,

        SET_INFO_POPUP,
        UNSET_INFO_POPUP,
    }

    export interface SetDigitsAction {
        _tag: ActionTypeTag.SET_DIGITS;
        numDigits: number;
    }
    export interface SetSettingsOpenAction {
        _tag: ActionTypeTag.SET_SETTINGS_OPEN;
        open: boolean;
    }


    export interface SetCurrGuessAction {
        _tag: ActionTypeTag.SET_CURR_GUESS;
        guess: string;
    }
    export interface AddGuessAction {
        _tag: ActionTypeTag.ADD_GUESS;
        guess: string;
    }


    export interface AddConstraintAction {
        _tag: ActionTypeTag.ADD_CONSTRAINT;
        constraint: ConstraintParams;
    }
    export interface UpdateConstraintAction {
        _tag: ActionTypeTag.UPDATE_CONSTRAINT;
        constraint: ConstraintParams;
        index: number;
    }
    export interface DeleteConstraintAction {
        _tag: ActionTypeTag.DELETE_CONSTRAINT;
        index: number;
    }


    export interface SetInfoPopupAction extends Popup.Popup {
        _tag: ActionTypeTag.SET_INFO_POPUP;
    }
    export interface UnsetInfoPopupAction {
        _tag: ActionTypeTag.UNSET_INFO_POPUP;
    }
}


export const ActionTypeTag = ActionTypes.ActionTypeTag;

export type ActionType = ActionTypes.SetDigitsAction
                | ActionTypes.SetSettingsOpenAction
                | ActionTypes.SetCurrGuessAction
                | ActionTypes.AddGuessAction
                | ActionTypes.AddConstraintAction
                | ActionTypes.UpdateConstraintAction
                | ActionTypes.DeleteConstraintAction
                | ActionTypes.SetInfoPopupAction
                | ActionTypes.UnsetInfoPopupAction;

function singleDispatch(oldState: AppState, action: ActionType): AppState {

    const {
        SET_DIGITS,
        SET_SETTINGS_OPEN,
        SET_CURR_GUESS,
        ADD_GUESS,
        ADD_CONSTRAINT,
        UPDATE_CONSTRAINT,
        DELETE_CONSTRAINT,
        SET_INFO_POPUP,
        UNSET_INFO_POPUP,
    } = ActionTypes.ActionTypeTag;

    switch (action._tag) {
        case SET_DIGITS:
            return {
                ...oldState,
                digits: action.numDigits,
                getAnswer: ((value) => () => value)(generateNumber(action.numDigits))
            };
        
        case SET_SETTINGS_OPEN:
            return {
                ...oldState,
                settingsOpen: action.open,
            };
        
        case SET_CURR_GUESS:
            return {
                ...oldState,
                currGuess: action.guess,
            };

        case ADD_GUESS:
            return {
                ...oldState,
                prevGuesses: [
                    ...oldState.prevGuesses,
                    {
                        guess: action.guess,
                        ...getValues(oldState.getAnswer ?? (() => ""), action.guess),
                    },
                ],
            };
        
        case ADD_CONSTRAINT:
            return {
                ...oldState,
                constraints: [...oldState.constraints, action.constraint],
            };

        case UPDATE_CONSTRAINT:
            return {
                ...oldState,
                constraints: returnWithEditedElement(oldState.constraints, action.constraint, action.index),
            };

        case DELETE_CONSTRAINT:
            return {
                ...oldState,
                constraints: returnWithEditedElement(oldState.constraints, null, action.index),
            };

            case SET_INFO_POPUP:
                return {
                    ...oldState,
                };

            case UNSET_INFO_POPUP:
                return {
                    ...oldState,
                };
        
    }
}

export default function dispatch(oldState: AppState, action: ActionType | ActionType[]): AppState {
    if (Array.isArray(action)) {
        let currState = oldState;
        for (const singleAction of action) currState = singleDispatch(currState, singleAction);
        return currState;
    } else return singleDispatch(oldState, action);
}