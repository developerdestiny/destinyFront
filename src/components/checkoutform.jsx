import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

export default function CheckoutForm({terminos, dataUpdate}) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [politicasShow, setpoliticasShow] = useState(false)

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      console.log(paymentIntent, 'paymentIntent');
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);
    if (dataUpdate) {
      await fetch("https://cms.gstmtravel.com/api/lomito/updatePaymentIntent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataUpdate),
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          return
          window.location.reload()
        }
      });
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: "http://localhost:3000/checkout/sucess",
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const renderizarConSaltosDeLinea = (texto) => {
    return texto?.split('\n')?.map((linea, index) => {
      return <React.Fragment key={index}>{linea}<br /></React.Fragment>;
    });
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="mt-5 w-full">
      {politicasShow && <div className="fixed left-0 top-0 w-full h-screen flex items-center justify-center z-50">
        <div className="absolute w-[90%] md:w-1/2 border rounded-lg p-3 bg-[#010417]">
          <div className="flex justify-end font-bold"><button onClick={() => setpoliticasShow(false)}>x</button></div>
          <div className="overflow-y-auto max-h-96 mt-5">
            {
              terminos && <span>{renderizarConSaltosDeLinea(terminos)}</span>
            }
          </div>
        </div>
        <div className="w-full h-full bg-[#010417] bg-opacity-90" onClick={() => setpoliticasShow(false)}></div>
      </div>}
      <PaymentElement id="payment-element" options={{layout: {type: "accordion" }}} onReady={(e) => console.log(e)}/>
      <label className="p-2 border rounded-lg w-full border-[#081358] mb-5 flex items-center gap-3"><input type="checkbox" required="true" onInvalid={(e) => e.target.setCustomValidity('Acepta nuestros terminos y condiciones')}/><span className="font-semibold">Acepto <button onClick={() => setpoliticasShow(true)} className="border-b">Terminos y Condiciones</button></span></label>
      <button disabled={isLoading || !stripe || !elements} id="submitCheckoutForm">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Reservar Ahora"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}