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
      '/financial-connections/customers',
      token,
      { email },
    );

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
    return this.get(`/financial-connections/accounts/${email}`, token);
  }

  async getAccounts(customerId: string, token: string) {
    if (!customerId || !token) return;
    return this.get(`/financial-connections/accounts/${customerId}`, token);
  }

  async getAccountById(accountId: string, token: string) {
    if (!accountId || !token) return;
    return this.get(`/financial-connections/accounts/${accountId}`, token);
  }

  async getTransactions(transactionId: string, token: string) {
    if (!transactionId || !token) return;
    return this.get(
      `/financial-connections/transactions/${transactionId}`,
      token,
    );
  }
}

const stripeAPI = new StripeAPI();

export default stripeAPI;
