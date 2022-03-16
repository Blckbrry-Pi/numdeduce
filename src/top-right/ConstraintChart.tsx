import { ReactSVG } from 'react-svg';
import { ConstraintParams } from '../libs/constraints';
import { digitDeactivated, digitDefinite, placeValueDeactivated, placeValueDefinite, getNeedWrappers, digitInWrapperConstraints } from '../libs/utils';
import "./ConstraintChart.css";
import PlusIcon from '../plusIcon.svg';
import WrapperDivs from '../libs/WrapperDivs';

const colors = ["blue", "orange", "green", "red", "purple", "yellow"];

export const placeValueMapping = {
    "1": "O",
    "10": "T",
    "100": "H",
    "1000": "Th",
    "10000": "tTh",
    "100000": "hTh",
    "1000000": "M",
    "10000000": "tM",
    "100000000": "hM",
    "1000000000": "B",
};

interface ConstraintChartProps {
    constraints: (ConstraintParams | null)[];
    digits: number;
}

function mapToStrings(input: boolean[], constant: string): string[] {
    return input.map((isIncluded, index) => `${isIncluded ? `${colors[index]}-group` : ""} ${colors[index]}-left ${constant}`);
}


function ConstraintChart(
    { constraints, digits, }: ConstraintChartProps
) {
    const allDigits = Array(10).fill(null).map((_, index) => index);
    const placeValues = Array(digits).fill(null).map((_, index) => 10 ** index).reverse();

    const wrapperConstraints = getNeedWrappers(constraints);
    
    return (
        <div className="constraint-chart">
            {
                allDigits.map((digit, yIndex) => <div className="constraint-chart-row" key={yIndex}>
                    <WrapperDivs classNames={mapToStrings(digitInWrapperConstraints(digit, wrapperConstraints), "constraint-chart-cell ")}>
                        <span className={`constraint-chart-cell inner header ${digitDeactivated(digit, constraints, placeValues) ? "deactivated" : ""} ${digitDefinite(digit, constraints) ? "definite" : ""}`}>
                            {digit}
                            {
                                digitDeactivated(digit, constraints, placeValues)
                                    && <ReactSVG src={PlusIcon} className="constraint-chart-cross" alt="Plus Icon" id="plus-icon-svg" />
                            }
                        </span>
                    </WrapperDivs>
                    {
                        placeValues.map((placeValue, xIndex) => <span key={xIndex} className={`constraint-chart-cell inner ${placeValueDeactivated(digit, placeValue, constraints) ? "deactivated" : ""} ${placeValueDefinite(digit, placeValue, constraints) ? "definite" : ""}`}>
                            {placeValueMapping[placeValue.toString() as keyof typeof placeValueMapping]}
                            {placeValueDeactivated(digit, placeValue, constraints) &&  <ReactSVG src={PlusIcon} className="constraint-chart-cross" alt="Plus Icon" id="plus-icon-svg" />}    
                        </span>)
                    }
                </div>)
            }
        </div>
    );
}

export default ConstraintChart;