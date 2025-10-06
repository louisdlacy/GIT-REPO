import * as hz from 'horizon/core';

/**
 * Economy Manager
 * Manages player currency balances and transaction logic.
 */
class sysEconomyManager extends hz.Component<typeof sysEconomyManager> {
  static propsDefinition = {
    startingBalance: { type: hz.PropTypes.Number, default: 100 }
  };

  private balance!: number;

  start() {
    this.balance = this.props.startingBalance;
    console.log(`sysEconomyManager started. Balance = ${this.balance}`);
  }

  addFunds(amount: number) {
    this.balance += amount;
    console.log(`Balance increased by ${amount}. New balance: ${this.balance}`);
  }

  removeFunds(amount: number) {
    if (this.balance >= amount) {
      this.balance -= amount;
      console.log(`Balance decreased by ${amount}. New balance: ${this.balance}`);
    } else {
      console.log("Not enough funds!");
    }
  }

  getBalance(): number {
    return this.balance;
  }
}

hz.Component.register(sysEconomyManager);