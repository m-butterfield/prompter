import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { PaymentPlanName } from "graphql/types";
import React from "react";

// const GET_CHECKOUT_SESSION = gql`
//   mutation getCheckoutSession($paymentPlanName: PaymentPlanName!) {
//     getCheckoutSession(paymentPlanName: $paymentPlanName)
//   }
// `;

type PaymentPlanItemProps = {
  name: PaymentPlanName;
  price: string;
  queriesPerDay: number;
};

export const PaymentPlanItem = ({
  name,
  price,
  queriesPerDay,
}: PaymentPlanItemProps) => {
  // const { user } = useContext(AppContext);
  // const [getCheckout, { error, loading }] = useMutation<
  //   Mutation,
  //   MutationGetCheckoutSessionArgs
  // >(GET_CHECKOUT_SESSION);
  return (
    <Stack
      direction="column"
      // alignItems="center"
      spacing={2}
      sx={{ border: 1, padding: 2, borderRadius: 1 }}
      // onClick={() => {
      //   getCheckout({ variables: { paymentPlanName } });
      // }}
    >
      <Typography fontWeight="bold">{name}</Typography>
      <Stack direction="row" alignItems="flex-end" spacing={2}>
        <Typography variant="h2">${price}</Typography>
        <Typography variant="h4">/ month</Typography>
      </Stack>
      <List
        sx={{
          listStyleType: "disc",
          pl: 2,
          "& .MuiListItem-root": {
            display: "list-item",
          },
        }}
      >
        <ListItem>
          <Typography fontWeight="bold" display="inline">
            {queriesPerDay}{" "}
          </Typography>
          <Typography display="inline">queries per day</Typography>
        </ListItem>
      </List>
      {}
      <Button variant="outlined" size="large">
        Upgrade
      </Button>
    </Stack>
  );
};
