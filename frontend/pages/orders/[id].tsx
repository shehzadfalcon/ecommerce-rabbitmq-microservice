import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Order from '../../components/Order';
import SEO from '../../components/SEO';
import { homeConfig } from '../../utils';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe("pk_test_51H6fPNIytw0q6bRWi2HVVbpkFnzXNbxsdjp4IA3HndKcAQNNYrU6oj8clFdl2mjb4k25Cf9RTWuv8tPeoVETrQDF007IPMzJwd");
const OrderPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <SEO {...homeConfig} />
      <main className="wrapper py-5">
      <Elements stripe={stripePromise}>
        <Order pageId={id} />
        </Elements>
      </main>
    </>
  );
};
export default OrderPage;
