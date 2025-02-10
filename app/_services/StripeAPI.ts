import { getStripe } from './_clients/StripeClient';
import APIService from './APIService';
import { Config } from './Config';

class StripeAPI extends APIService {
  static getBaseURL() {
    return Config.getBaseURL();
  }

  async initiateStripeAuth(email: string, token: string) {
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

  async getCustomerInfo(email: string, token: string) {
    // if (!email || !token) return;
    return this.get(`/financial-connections/accounts/${email}`, token);
  }

  async getAccounts(customerId: string, token: string) {
    // if (!customerId || !token) return;
    return this.get(`/financial-connections/accounts/${customerId}`, token);
  }
}

const stripeAPI = new StripeAPI(StripeAPI.getBaseURL());

export default stripeAPI;
