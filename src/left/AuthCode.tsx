/**
 * Credit to Luis Guerrero (drac94), with their repository at:
 * https://github.com/drac94/react-auth-code-input.
 */


import React, { useRef, useEffect } from 'react';

type Props = {
  allowedCharacters?: RegExp;
  characters?: number;
  containerClassName?: string;
  defaultValue?: string;
  disabled?: boolean;
  inputClassName?: string;
  inputType?: 'number' | 'password' | 'text' | 'tel';
  onChange: (res: string) => void;
  onSubmit?: (res: string) => void;
  refs?: React.MutableRefObject<HTMLInputElement[]>;
};

const AuthCode: React.FC<Props> = ({
  allowedCharacters = '^[A-Za-z0-9]*$',
  characters = 6,
  containerClassName,
  defaultValue,
  disabled,
  inputClassName,
  inputType = 'text',
  onChange,
  onSubmit,
  refs,
}) => {
  const inputsRef = useRef<Array<HTMLInputElement>>([]);

  if (refs) refs.current = inputsRef.current;

  useEffect(() => {
    inputsRef.current[0].focus();
  }, []);

  const getResult = () => inputsRef.current.filter(val => val).map((input) => input.value).join('');

  const sendResult = () => {
    const res = getResult();
    onChange && onChange(res);
  };

  const sendSubmit = () => {
    const res = getResult();
    onSubmit && onSubmit(res);
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.match(allowedCharacters)) {
      if (e.target.nextElementSibling !== null) {
        (e.target.nextElementSibling as HTMLInputElement).focus();
      }
    } else {
      e.target.value = '';
    }
    sendResult();
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;
    const target = e.target as HTMLInputElement;
    if (key === 'Backspace') {
      if (target.value === '' && target.previousElementSibling !== null) {
        if (target.previousElementSibling !== null) {
          (target.previousElementSibling as HTMLInputElement).focus();
          e.preventDefault();
        }
      } else {
        target.value = '';
      }
      sendResult();
    } else if (key === 'Enter') {
      sendSubmit();
    }
  };

  const handleOnFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const handleOnPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const value = e.clipboardData.getData('Text');
    if (value.match(allowedCharacters)) {
      for (let i = 0; i < characters && i < value.length; i++) {
        inputsRef.current[i].value = value.charAt(i);
        if (inputsRef.current[i].nextElementSibling !== null) {
          (inputsRef.current[i].nextElementSibling as HTMLInputElement).focus();
        }
      }
      sendResult();
    }
    e.preventDefault();
  };

  const inputs = [];
  for (let i = 0; i < characters; i++) {
    let defaultToken: string | undefined = undefined;
    
    if (defaultValue) {
      const possChar = defaultValue.charAt(i);
      if (possChar.match(allowedCharacters)) {
        defaultToken = possChar;
      }
    }

    inputs.push(
      <input
        key={i}
        defaultValue={defaultToken}
        onChange={handleOnChange}
        onKeyDown={handleOnKeyDown}
        onFocus={handleOnFocus}
        onPaste={handleOnPaste}
        type={inputType}
        ref={(el: HTMLInputElement) => (inputsRef.current[i] = el)}
        maxLength={1}
        className={inputClassName}
        disabled={disabled}
      />
    );
  }

  return <div className={containerClassName}>{inputs}</div>;
};

export default AuthCode;
