import Stack from "@mui/material/Stack";
import { PaymentPlanItem } from "app/home/PaymentPlanItem";
import React from "react";

export const PaymentPlans = () => {
  return (
    <Stack direction="row" spacing={4}>
      <PaymentPlanItem price={"$5"} queriesPerDay={100} />
      <PaymentPlanItem price={"$20"} queriesPerDay={1000} />
      <PaymentPlanItem price={"$80"} queriesPerDay={10000} />
    </Stack>
  );
};
