import { getStripe } from './_clients/StripeClient';
import APIService from './APIService';

class StripeAPI extends APIService {
  async initiateStripeAuth(email: string, token: string) {
    if (!email || !token) return;

    const stripe = await getStripe();
    if (!stripe) {
      console.error('Stripe failed to load');
      return;
    }

    const clientSecret = await this.post(
      '/financial-connections/accounts',
      token,
      { email },
    );
    console.log('SECRET: ', clientSecret);
    await stripe.collectFinancialConnectionsAccounts({
      clientSecret,
    });
  }

  async disconnectAccount(accountId: string, token: string) {
    if (!accountId || !token) return;
    return this.delete(`/financial-connections/accounts/${accountId}`, token);
  }

  async getCustomerInfo(email: string, token: string) {
    if (!email || !token) return;
    return this.get(`/financial-connections/accounts/email/${email}`, token);
  }

  async getAccounts(customerId: string, token: string) {
    if (!customerId || !token) return;
    return this.get(
      `/financial-connections/accounts/customer/${customerId}`,
      token,
    );
  }

  async getAccountById(accountId: string, token: string) {
    if (!accountId || !token) return;
    return this.get(`/financial-connections/accounts/${accountId}`, token);
  }

  async getTransactions(accountId: string, token: string) {
    if (!accountId || !token) return;
    return this.get(
      `/financial-connections/accounts/${accountId}/transactions`,
      token,
    );
  }

  async getTransaction(transactionId: string, token: string) {
    if (!transactionId || !token) return;
    return this.get(
      `/financial-connections/transactions/${transactionId}`,
      token,
    );
  }

  async getCustomerTransactionData(
    customerId: string,
    omit: string[],
    token: string,
  ) {
    if (!customerId || !token) return;
    const omitStr = omit.length ? `?omit=${omit.join(',')}` : '';
    console.log('Making request: ', omitStr);
    return this.get(
      `/financial-connections/transactions/customer/${customerId}${omitStr}`,
      token,
    );
  }
}

const stripeAPI = new StripeAPI();

export default stripeAPI;
