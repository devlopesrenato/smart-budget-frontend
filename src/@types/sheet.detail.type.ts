type SheetDetail = {
    id: number,
    description: string,
    createdAt: Date,
    creatorUserId: number,
    updatedAt: Date,
    accountsPayable: [],
    accountsReceivable: [],
    totalAccountsPayable: number,
    totalAccountsReceivable: number,
    balance: number
}