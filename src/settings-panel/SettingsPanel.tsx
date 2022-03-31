import { useState } from "react";
import ReactModal, { Styles } from "react-modal";
import AuthCode from "../libs/AuthCode";
import { ActionType, ActionTypeTag, AppState } from "../stateManagement";

import "./SettingsPanel.css";

interface SettingsPanelProps {
    state: AppState;
    dispatch: React.Dispatch<ActionType | ActionType[]>;
}

const customStyles: Styles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: "max-content",
    },
};

ReactModal.setAppElement("#root");

export default function SettingsPanel({ state, dispatch }: SettingsPanelProps) {
    const [  , setNumErr ] = useState<boolean>(false);

    const digitCountChange = (digits: string) => {
        if (digits === "" || !Number(digits)) setNumErr(true);
        else {
            setNumErr(false);
            dispatch({
                _tag: ActionTypeTag.SET_DIGITS,
                numDigits: Number(digits),
            });
        }
    };

    return <ReactModal
        isOpen={state.settingsOpen}
        style={customStyles}
        onRequestClose={() => dispatch({ _tag: ActionTypeTag.SET_SETTINGS_OPEN, open: false })}
        shouldCloseOnOverlayClick={true}
    >
        Number of digits: <AuthCode
            characters={1}
            onChange={digitCountChange}
            defaultValue={state.digits.toString()}
            allowedCharacters={/[1-9]/}
        />
    </ReactModal>;
}