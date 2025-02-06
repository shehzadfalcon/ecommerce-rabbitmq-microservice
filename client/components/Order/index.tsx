import { Row, Col, ListGroup, Card, Button, Image } from "react-bootstrap";
import { PayPalButton } from "react-paypal-button-v2";
import Link from "next/link";
import { useOrderActions, useTypedSelector } from "../../hooks";
import Loader from "../Loader";
import Message from "../Message";
import { useEffect, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
interface OrderProps {
  pageId: string | string[] | undefined;
}

const Order: React.FC<OrderProps> = ({ pageId }) => {
  const { loading, data, error, success } = useTypedSelector(
    (state) => state.order
  );
  const { loading: loadingDeliver } = useTypedSelector(
    (state) => state.orderDeliver
  );
  const user = useTypedSelector((state) => state.user);
  const { fetchOrder, payOrder, deliverOrder } = useOrderActions();
  const stripe = useStripe();
  const elements = useElements();
  const [stripeError, setstripeError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [delivered, setDelivered] = useState(false);
  useEffect(() => {
    if (!data._id || success) {
      if (!pageId) return;

      fetchOrder(pageId as string);
    }
  }, [fetchOrder, pageId, success, data,delivered]);
  
  // const onPaymentHandler = ({
  //   id,
  //   payer: { email_address },
  //   update_time,
  //   status,
  // }: any) => {
  //   const paymentResult = {
  //     id,
  //     email_address,
  //     update_time,
  //     status,
  //   };

  //   payOrder(data._id!, paymentResult);
  // };


  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    try {
      const { data: clientSecret } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/orders/create-payment-intent`,
        {
          amount: Math.round(data.totalPrice), // Replace with the order's total price
        }
      );
      

      const result: any = await stripe.confirmCardPayment(clientSecret.client_secret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        setstripeError(result.error.message || "Payment failed");
        setProcessing(false);
      } else if (result.paymentIntent?.status === "succeeded") {
        const paymentResult:any = {
          id: result.paymentIntent.id,
          email_address:user?.data?.email,
          update_time:new Date(),
           status:"Paid",
        };
        alert("success!");
        payOrder(data._id!, paymentResult);
        setstripeError(null);
      }
    } catch (err: any) {
      setstripeError(err.message);
      setProcessing(false);
    }
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <h1>Order {data._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {data.user?.name}
              </p>
              <p>
                <strong>Email: </strong>{" "}
                <a href={`mailto:${data.user?.email}`}>{data.user?.email}</a>
              </p>
              <p>
                <strong>Address: </strong>
                {data.shippingDetails.address}, {data.shippingDetails.city}{" "}
                {data.shippingDetails.postalCode},{" "}
                {data.shippingDetails.country}
              </p>
              {data.isDelivered ? (
                <Message variant="success">
                  Delivered on {data.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {data.paymentMethod}
              </p>
              {data.isPaid ? (
                <Message variant="success">Paid on {data.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {data.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {data.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link href={`/product/${item.productId}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${data.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>
                    {data.shippingPrice !== 0
                      ? `$${data.shippingPrice}`
                      : "Free"}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${data.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${data.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {!data.isPaid && (
                <ListGroup.Item>
                  {loading && <Loader />}

                  <form onSubmit={handleSubmit}>
                    <CardElement />

                    {stripeError && (
                      <div style={{ color: "red" }}>{stripeError}</div>
                    )}

                    <Button
                      type="submit"
                      variant="primary"
                      className="mt-3"
                      disabled={!stripe || processing}
                    >
                      {processing ? "Processing..." : "Pay"}
                    </Button>
                  </form>
                </ListGroup.Item>
              )}
              {loadingDeliver && <Loader />}

              {user.data &&
                user.data.isAdmin &&
                data.isPaid &&
                !data.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={async () => {
                        setDelivered(true)
                       await deliverOrder(data._id!)
                        setTimeout(() => {
                          setDelivered(false)
                        }, 2000);
                      
                      }}
                    >
                      {delivered?"Delivering Order":"Mark As Delivered"}
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Order;
