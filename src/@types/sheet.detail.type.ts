type SheetDetail = {
    id: number,
    description: string,
    createdAt: Date,
    creatorUserId: number,
    updatedAt: Date,
    accountsPayable: AccountType[],
    accountsReceivable: AccountType[],
    totalAccountsPayable: number,
    totalAccountsReceivable: number,
    balance: number
}