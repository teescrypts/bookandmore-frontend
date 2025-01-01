import React from "react";
import { RentForm } from "../rent-forms/[id]/page";
import SubscriptionRentForm from "./subscription-rent-form";

interface PropType {
  rentForm: RentForm;
}

const BoothRentForm: React.FC<PropType> = ({ rentForm }) => {
  return <SubscriptionRentForm rentForm={rentForm} />;
};

export default BoothRentForm;
