import React from "react";
import { StaffForm as StaffFormType } from "../staff-onboarding-form/[id]/page";
import RegularStaffForm from "./regular-staff-form";
import CommissionStaffForm from "./commission-staff-form";

function StaffForm({ staffForm }: { staffForm: StaffFormType }) {
  const category = staffForm.category;

  if (category === "commission") {
    return <CommissionStaffForm staffForm={staffForm} />;
  }

  return <RegularStaffForm staffForm={staffForm} />;
}

export default StaffForm;
