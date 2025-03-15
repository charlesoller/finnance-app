import { useMemo, useState } from 'react';
import {
  TransactionData,
  TransactionRange,
} from '../../_models/TransactionData';
import { useTransactions } from './TransactionViewer.hooks';
import { Flex, Text } from '@mantine/core';
import TransactionList from './components/TransactionList/TransactionList';
import RecurringTransactions from './components/RecurringTransactions/RecurringTransactions';
import TransactionFilters from './components/TransactionFilters/TransactionFilters';
import { fuzzyFilter } from './TransactionViewer.utils';
import TransactionSkeleton from './components/TransactionSkeleton/TransactionSkeleton';

interface TransactionViewerProps {
  accountIds?: string[];
  onTransactionSelect?: (id: string) => void;
  pageLength?: number;
}

export default function TransactionViewer({
  accountIds,
  onTransactionSelect,
  pageLength = 20,
}: TransactionViewerProps) {
  const [range, setRange] = useState<TransactionRange>('sixMonth');
  const [page, setPage] = useState<number>(1);
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [viewRecurring, setViewRecurring] = useState<boolean>(false);

  const { transactions, isLoading, isPending, error } = useTransactions(
    range,
    accountIds,
  );

  const paginatedTxns = useMemo(() => {
    const filtered = fuzzyFilter(filterQuery, transactions);
    if (!filtered || filtered.length === 0) return [];

    const result: TransactionData[][] = [];
    for (let i = 0; i < filtered.length; i += pageLength) {
      result.push(filtered.slice(i, i + pageLength));
    }
    return result;
  }, [transactions, pageLength, filterQuery]);

  const handleRangeChange = (v: TransactionRange) => {
    setRange(v as TransactionRange);
    setPage(1);
  };

  const handleViewRecurringClick = () => {
    setViewRecurring((prev) => !prev);
  };

  const handleFilter = (v: string) => {
    setFilterQuery(v);
    setPage(1);
  };

  return (
    <Flex direction="column">
      {!!error && <Text>{error.message}</Text>}
      {!isLoading && !isPending && !transactions?.length && !error && (
        <Text size="xl">No transaction data available for this account</Text>
      )}
      <TransactionFilters
        viewRecurring={viewRecurring}
        onViewRecurringClick={handleViewRecurringClick}
        range={range}
        rangeOnChange={handleRangeChange}
        disabled={!transactions}
        page={page}
        pages={paginatedTxns.length}
        pageOnChange={setPage}
        loading={isLoading || isPending}
        filter={filterQuery}
        onFilter={handleFilter}
      />
      {(isLoading || isPending) && <TransactionSkeleton />}
      {!!transactions && !viewRecurring && (
        <TransactionList
          transactions={paginatedTxns[page - 1]}
          onSelect={onTransactionSelect}
          showAccountName={!accountIds?.length ? true : false}
        />
      )}
      {!!transactions && viewRecurring && (
        <RecurringTransactions
          onSelect={onTransactionSelect}
          accountId={accountIds?.length === 1 ? accountIds[0] : undefined}
        />
      )}
    </Flex>
  );
}
