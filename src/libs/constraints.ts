export enum ConstraintType {
    HAS_NUMBER,
    HAS_NUMBER_IN_PLACE,
    CANT_BE_NUMBER,
    CANT_BE_NUMBER_IN_PLACE,
    N_OF_NUMS_LIST_IN_NUMBER,
   N_OF_NUMS_LIST_IN_PLACES,
}

export type HNConstraint = {
    cType: ConstraintType.HAS_NUMBER;
    nums: number[];
};
export type HNIPConstraint = {
    cType: ConstraintType.HAS_NUMBER_IN_PLACE;
    num: number | null;
    place: number;
};
export type CBNConstraint = {
    cType: ConstraintType.CANT_BE_NUMBER;
    nums: number[];
};
export type CBNIPConstraint = {
    cType: ConstraintType.CANT_BE_NUMBER_IN_PLACE;
    num: number | null;
    place: number;
};
export type NONLINConstraint = {
    cType: ConstraintType.N_OF_NUMS_LIST_IN_NUMBER;
    n: number | null;
    nums: number[];
};
export type NONLIPConstraint = {
    cType: ConstraintType.N_OF_NUMS_LIST_IN_PLACES;
    n: number | null;
    nums: number[];
    place: number | null;
};

export type ConstraintParams = HNConstraint | HNIPConstraint | CBNConstraint | CBNIPConstraint | NONLINConstraint | NONLIPConstraint;