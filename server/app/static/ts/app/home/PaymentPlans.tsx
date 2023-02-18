import { gql, useQuery } from "@apollo/client";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { PaymentPlanItem } from "app/home/PaymentPlanItem";
import { Query } from "graphql/types";
import React from "react";

const PAYMENT_PLAN_TEMPLATES = gql`
  query getPaymentPlanTemplates {
    getPaymentPlanTemplates {
      name
      price
      queriesPerDay
    }
  }
`;

export const PaymentPlans = () => {
  const { data, loading, error } = useQuery<Query>(PAYMENT_PLAN_TEMPLATES);
  if (loading) {
    return <Typography>Loading payment plans...</Typography>;
  }
  if (error) {
    return <Alert severity="error">Error loading payment plans...</Alert>;
  }
  return (
    <Stack direction="row" spacing={4}>
      {data.getPaymentPlanTemplates.map((template) => (
        <PaymentPlanItem
          name={template.name}
          price={template.price}
          queriesPerDay={template.queriesPerDay}
        />
      ))}
    </Stack>
  );
};
