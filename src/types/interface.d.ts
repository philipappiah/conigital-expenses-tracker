export enum CategoryEnum {
    Entertainment,
    Transport,
    Groceries,
    Shopping,
    Other
}

export interface Expense {
    ID?:string
    category:CategoryEnum
    title:string
    cost: number
    time: Date
}
