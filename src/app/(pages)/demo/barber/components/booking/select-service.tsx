"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Tabs,
  Tab,
  Card,
  ListItemButton,
} from "@mui/material";

interface Addon {
  name: string;
  price: string;
}

interface Product {
  name: string;
  price: string;
}

interface Service {
  name: string;
  description: string;
  price: string;
  priceStructure: string; // "Starts with" or "Fixed"
  estimatedTime: string;
  homeServiceAvailable: boolean;
  homeServiceCharge?: string;
  addons: Addon[];
  products: Product[];
  isCombo: boolean;
}

interface SelectServicesProps {
  services: Service[];
}

const SelectServices: React.FC<SelectServicesProps> = ({ services }) => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isHomeService, setIsHomeService] = useState<boolean>(false);
  const [tab, setTab] = useState<"standard" | "combo">("standard");

  const handleServiceSelect = (serviceName: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceName)
        ? prev.filter((name) => name !== serviceName)
        : [...prev, serviceName]
    );
  };

  const filteredServices = services.filter((service) =>
    tab === "combo" ? service.isCombo : !service.isCombo
  );

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select Services
      </Typography>
      <List>
        {filteredServices.map((service, idx) => (
          <Card key={idx} sx={{ mb: 2, p: 2 }}>
            <ListItem
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <ListItemText
                primary={
                  <Typography variant="h6">
                    {service.name} <br />
                    {service.description} <br />
                    Estimated Time: {service.estimatedTime} <br />
                    Price: $ {service.price}
                  </Typography>
                }
              />
              <ListItemButton>BOOK NOW</ListItemButton>
            </ListItem>
          </Card>
        ))}
      </List>
    </Box>
  );
};

export default SelectServices;
