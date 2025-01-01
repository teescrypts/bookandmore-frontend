"use client";

import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ my: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

interface ReusableTabsProps {
  tabLabels: string[];
  tabContents: React.ReactNode[];
}

const ReusableTabs: React.FC<ReusableTabsProps> = ({
  tabLabels,
  tabContents,
}) => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs value={value} onChange={handleChange} aria-label="reusable tabs">
        {tabLabels.map((label, index) => (
          <Tab key={index} label={label} {...a11yProps(index)} />
        ))}
      </Tabs>
      {tabContents.map((content, index) => (
        <TabPanel key={index} value={value} index={index}>
          {content}
        </TabPanel>
      ))}
    </Box>
  );
};

export default ReusableTabs;
