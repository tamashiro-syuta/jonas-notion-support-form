export interface BaseColumn {
  genre: string;
  order: number;
}

export interface BudgetColumn extends BaseColumn {
  budget: number;
}

export interface BalanceColumn extends BaseColumn {
  balance: number;
}

export interface SpendingColumn extends BaseColumn {
  spending: number;
}
