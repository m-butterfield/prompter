import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AppContext } from "app/index";
import React, { useContext } from "react";

type PaymentPlanItemProps = {
  price: string;
  queriesPerDay: number;
};

export const PaymentPlanItem = ({
  price,
  queriesPerDay,
}: PaymentPlanItemProps) => {
  const { user } = useContext(AppContext);
  return (
    <Box sx={{ border: 1, padding: 2, borderRadius: 1 }}>
      <Stack direction="row" alignItems="flex-end" spacing={2}>
        <Typography variant="h2">{price}</Typography>
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
      <Button>Upgrade</Button>
    </Box>
  );
};
