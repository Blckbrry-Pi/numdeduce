import { useState } from 'react';
import { Wrapper, Button, Menu } from 'react-aria-menubutton';
import { ReactSVG } from 'react-svg'

import { ConstraintType } from '../libs/constraints';
import { NewConstraintStatementDemo } from './ConstraintStatements';

import "./NewPhraseDropdown.css";
import PlusIcon from '../plusIcon.svg';

export default function NewPhraseDropdown({ onMenuSelected }: { onMenuSelected: (constraintType: ConstraintType) => void }) {

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const menuItemWords = Object.keys(ConstraintType).filter(item => !isNaN(Number(item))).map(Number);
    const menuItems = menuItemWords.map((cType, i) => {
        return <NewConstraintStatementDemo cType={cType} key={i}/>;
    });

    return <Wrapper
        className='new-phrase-menu'
        onSelection={onMenuSelected}
        onMenuToggle={stateValue => setIsOpen(stateValue.isOpen)}
    >
        <Button className={`new-phrase-menu-open-button ${isOpen ? "new-phrase-menu-open-button-open" : ""}`}>
            <ReactSVG src={PlusIcon} alt="Plus Icon" id="plus-icon-svg" /> New Constraint
        </Button>
        <Menu className='new-phrase-menu-menu'>
            <>{menuItems}</>
        </Menu>
    </Wrapper>;
}