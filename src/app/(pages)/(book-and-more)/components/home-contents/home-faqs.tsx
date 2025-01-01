import React from "react";
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpendMore from "@/icons/untitled-ui/duocolor/expand-more";

const faqs = [
  {
    question: "What is BookAndMore?",
    answer:
      "BookAndMore is the ultimate example of a fully functional, customized web solution tailored for business owners who need more than just a basic website.",
  },
  {
    question: "Is the website free?",
    answer:
      "No, there is a monthly subscription for the website. Please refer to the pricing page for detailed information.",
  },
  {
    question: "Will I be able to accept payments?",
    answer:
      "Yes, you can accept payments through credit/debit cards, PayPal, and CashApp, with Stripe as the payment processor.",
  },
  {
    question: "Can I set up a cancellation policy?",
    answer:
      "Yes, You can charge customers for no show and late appointment cancellation",
  },
  {
    question: "Does it require monthly subscriptions?",
    answer:
      "Yes, there is a monthly subscription required for maintaining the website. Please check the pricing page for more details.",
  },
];

const HomeFaqs = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Typography
        variant="h4"
        align="center"
        sx={{ mb: 4, fontWeight: "bold" }}
      >
        Frequently Asked Questions
      </Typography>
      {faqs.map((faq, index) => (
        <Accordion key={index}>
          <AccordionSummary
            expandIcon={<ExpendMore />}
            aria-controls={`panel${index}-content`}
            id={`panel${index}-header`}
          >
            <Typography variant="subtitle1">{faq.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary">
              {faq.answer}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  );
};

export default HomeFaqs;
