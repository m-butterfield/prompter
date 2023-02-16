import Stack from "@mui/material/Stack";
import { PaymentPlanItem } from "app/home/PaymentPlanItem";
import React from "react";

export const PaymentPlans = () => {
  return (
    <Stack direction="row" spacing={4}>
      <PaymentPlanItem price={"$5"} queriesPerDay={100} />
      <PaymentPlanItem price={"$15"} queriesPerDay={500} />
      <PaymentPlanItem price={"$30"} queriesPerDay={2500} />
    </Stack>
  );
};
