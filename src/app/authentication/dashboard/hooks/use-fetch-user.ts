export default function useFetchUser(userType: string) {
  switch (userType) {
    case "admin":
      return {
        name: "Jamie Lanister",
        activeBranch: { name: "Main branch", id: "yryryrhhs73929" },
        profilePic: "link",
      };
      break;
    case "staff":
      return {
        name: "john doe",
        profilePic: "link",
        permissions: {
          home: true,
          tax: true,
          customers: false,
          rent: false,
          staffs: false,
          openingHours: true,
          services: true,
          settings: true,
          calendar: true,
          pos: false,
          orders: true,
          products: true,
          shipping: false,
          blog: true,
          marketing: false,
        },
      };
      break;
      return {
        name: "Tywin Lanister",
        profilePic: "link",
        permissions: {
          home: true,
          tax: true,
          customers: false,
          rent: false,
          staffs: false,
          openingHours: true,
          services: true,
          settings: true,
          calendar: true,
          pos: false,
          orders: true,
          products: true,
          shipping: false,
          blog: true,
          marketing: false,
        },
      };
      break;
    case "tenant":
      return {
        name: "Cersie Lanister",
        paymentType: "subscription",
        profilePic: "link",
      };
    default:
      throw new Error("Invalid Credentials");
      break;
  }
}
