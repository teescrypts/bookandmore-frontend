"use client";

import React, { useState, useEffect } from "react";
import PromoModal from "./promo-modal";

const PromoPopUp: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const promoCode = "SAVE20";

  // Automatically open the modal after a delay (optional)
  useEffect(() => {
    const timer = setTimeout(() => {
      const hasSeenPromo = localStorage.getItem("hasSeenPromo");
      if (!hasSeenPromo) {
        setIsModalOpen(true);
        localStorage.setItem("hasSeenPromo", "true");
      }
    }, 5000); // Show modal 2 seconds after page load

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <PromoModal
        open={isModalOpen}
        onClose={handleClose}
        promoCode={promoCode}
      />
    </>
  );
};

export default PromoPopUp;
