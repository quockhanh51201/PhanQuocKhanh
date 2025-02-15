interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo';
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = (blockchain: WalletBalance['blockchain']): number => {
    const priorityMap: Record<WalletBalance['blockchain'], number> = {
      Osmosis: 100,
      Ethereum: 50,
      Arbitrum: 30,
      Zilliqa: 20,
      Neo: 20,
    };
    return priorityMap[blockchain] ?? -99;
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance) => {
        const balancePriority = getPriority(balance.blockchain);
        return balancePriority > -99 && balance.amount > 0;
      })
      .sort((lhs, rhs) => getPriority(rhs.blockchain) - getPriority(lhs.blockchain));
  }, [balances]);

  return (
    <div {...rest}>
      {sortedBalances.map((balance) => {
        const usdValue = prices[balance.currency] * balance.amount;
        return (
          <WalletRow
            className={classes.row}
            key={balance.currency}
            amount={balance.amount}
            usdValue={usdValue}
            formattedAmount={balance.amount.toFixed()}
          />
        );
      })}
    </div>
  );
};


// những thay đổi 
// Giảm re-render: useMemo chỉ phụ thuộc vào balances thay vì prices.
// logic trong filter: Kiểm tra đúng balance.amount > 0 thay vì <= 0.
// Tối ưu hiệu suất: getPriority được gọi một lần thay vì hai lần trong .sort().
// Tránh dùng any: blockchain có kiểu cụ thể.
// Dùng key hợp lý trong React: Sử dụng balance.currency thay vì index.