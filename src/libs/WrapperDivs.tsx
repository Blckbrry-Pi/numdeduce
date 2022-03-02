export interface WrapperDivsProps {
    classNames: string[];
    children?: JSX.Element | JSX.Element[];
}

export default function WrapperDivs(
    { classNames, children }: WrapperDivsProps,
): JSX.Element {
    if (classNames.length === 0) return <>{children}</>;
    else return <div className={classNames[0]} >
        <WrapperDivs classNames={classNames.slice(1)}>
            {children}
        </WrapperDivs>
    </div> 
}
