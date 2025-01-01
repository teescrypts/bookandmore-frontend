import { applyPagination } from "@/utils/apply-pagination";
import { applySort } from "@/utils/apply-sort";
import { OrderType } from "../../../orders/page";

type Request = {
  filters?: { query: string | undefined; status: string | undefined };
  page?: number;
  rowsPerPage?: number;
  sortBy?: keyof OrderType;
  sortDir?: "asc" | "desc";
};

const now = new Date();

// const order = {
//   id: "5ecb8a6879877087d4aa2690",
//   coupon: null,
//   createdAt: subDays(subHours(now, 4), 1).getTime(),
//   currency: "$",
//   customer: {
//     address1: "Street John Wick, no. 7",
//     address2: "House #25",
//     city: "San Diego",
//     country: "USA",
//     email: "miron.vitold@devias.io",
//     name: "Miron Vitold",
//   },
//   items: [
//     {
//       id: "5ecb8abbdd6dfb1f9d6bf98b",
//       billingCycle: "monthly",
//       currency: "$",
//       name: "Project Points",
//       quantity: 25,
//       unitAmount: 50.25,
//     },
//     {
//       id: "5ecb8ac10f116d04bed990eb",
//       billingCycle: "monthly",
//       currency: "$",
//       name: "Freelancer Subscription",
//       quantity: 1,
//       unitAmount: 5.0,
//     },
//   ],
//   logs: [
//     {
//       id: "9a50be1fa5ec7317d459d5a8",
//       createdAt: subHours(Date.now(), 18).getTime(),
//       message: "Stripe charge complete (Charge ID: 5ecb8a6879877087d4aa2690)",
//     },
//     {
//       id: "41845b427db837502b4d6a57",
//       createdAt: subHours(Date.now(), 21).getTime(),
//       message: "Order status changed from Pending payment to Completed.",
//     },
//   ],
//   number: "DEV-103",
//   paymentMethod: "CreditCard",
//   promotionCode: "PROMO1",
//   status: "pending",
//   totalAmount: 500.0,
// };

// const orders = [
//   {
//     id: "5ecb8a6d9f53bfae09e16115",
//     createdAt: subDays(subHours(now, 4), 1).getTime(),
//     currency: "$",
//     customer: {
//       address1: "Street John Wick, no. 7",
//       address2: "House #25",
//       city: "San Diego",
//       country: "USA",
//       email: "miron.vitold@devias.io",
//       name: "Miron Vitold",
//     },
//     items: [
//       {
//         id: "5ecb8abbdd6dfb1f9d6bf98b",
//         billingCycle: "monthly",
//         currency: "$",
//         name: "Project Points",
//         quantity: 25,
//         unitAmount: 50.25,
//       },
//       {
//         id: "5ecb8ac10f116d04bed990eb",
//         billingCycle: "monthly",
//         currency: "$",
//         name: "Freelancer Subscription",
//         quantity: 1,
//         unitAmount: 5.0,
//       },
//     ],
//     number: "DEV-102",
//     paymentMethod: "CreditCard",
//     status: "pending",
//     totalAmount: 500.0,
//   },
//   {
//     id: "5ecb8a738aa6f3e577c2b3ec",
//     createdAt: subDays(subHours(now, 7), 1).getTime(),
//     currency: "$",
//     customer: {
//       address1: "Street John Wick, no. 7",
//       address2: "House #25",
//       city: "San Diego",
//       country: "USA",
//       email: "miron.vitold@devias.io",
//       name: "Miron Vitold",
//     },
//     items: [
//       {
//         id: "5ecb8abbdd6dfb1f9d6bf98b",
//         billingCycle: "monthly",
//         currency: "$",
//         name: "Project Points",
//         quantity: 25,
//         unitAmount: 50.25,
//       },
//       {
//         id: "5ecb8ac10f116d04bed990eb",
//         billingCycle: "monthly",
//         currency: "$",
//         name: "Freelancer Subscription",
//         quantity: 1,
//         unitAmount: 5.0,
//       },
//     ],
//     number: "DEV-101",
//     paymentMethod: "PayPal",
//     status: "complete",
//     totalAmount: 324.5,
//   },
//   {
//     id: "5ecb8a795e53f134013eba3b",
//     createdAt: subDays(subHours(now, 2), 2).getTime(),
//     currency: "$",
//     customer: {
//       address1: "Street John Wick, no. 7",
//       address2: "House #25",
//       city: "San Diego",
//       country: "USA",
//       email: "miron.vitold@devias.io",
//       name: "Miron Vitold",
//     },
//     items: [
//       {
//         id: "5ecb8abbdd6dfb1f9d6bf98b",
//         billingCycle: "monthly",
//         currency: "$",
//         name: "Project Points",
//         quantity: 25,
//         unitAmount: 50.25,
//       },
//       {
//         id: "5ecb8ac10f116d04bed990eb",
//         billingCycle: "monthly",
//         currency: "$",
//         name: "Freelancer Subscription",
//         quantity: 1,
//         unitAmount: 5.0,
//       },
//     ],
//     number: "DEV-100",
//     paymentMethod: "CreditCard",
//     status: "canceled",
//     totalAmount: 746.5,
//   },
//   {
//     id: "5ecb8a7f738cc572a9ce0277",
//     createdAt: subDays(subHours(now, 3), 5).getTime(),
//     currency: "$",
//     customer: {
//       address1: "Street John Wick, no. 7",
//       address2: "House #25",
//       city: "San Diego",
//       country: "USA",
//       email: "miron.vitold@devias.io",
//       name: "Miron Vitold",
//     },
//     items: [
//       {
//         id: "5ecb8abbdd6dfb1f9d6bf98b",
//         billingCycle: "monthly",
//         currency: "$",
//         name: "Project Points",
//         quantity: 25,
//         unitAmount: 50.25,
//       },
//       {
//         id: "5ecb8ac10f116d04bed990eb",
//         billingCycle: "monthly",
//         currency: "$",
//         name: "Freelancer Subscription",
//         quantity: 1,
//         unitAmount: 5.0,
//       },
//     ],
//     number: "DEV-99",
//     paymentMethod: "PayPal",
//     status: "rejected",
//     totalAmount: 56.89,
//   },
//   {
//     id: "5e86805e2bafd54f66cc95c3",
//     createdAt: subDays(subHours(now, 1), 6).getTime(),
//     currency: "$",
//     customer: {
//       address1: "Street John Wick, no. 7",
//       address2: "House #25",
//       city: "San Diego",
//       country: "USA",
//       email: "miron.vitold@devias.io",
//       name: "Miron Vitold",
//     },
//     items: [
//       {
//         id: "5ecb8abbdd6dfb1f9d6bf98b",
//         billingCycle: "monthly",
//         currency: "$",
//         name: "Project Points",
//         quantity: 25,
//         unitAmount: 50.25,
//       },
//       {
//         id: "5ecb8ac10f116d04bed990eb",
//         billingCycle: "monthly",
//         currency: "$",
//         name: "Freelancer Subscription",
//         quantity: 1,
//         unitAmount: 5.0,
//       },
//     ],
//     number: "DEV-98",
//     paymentMethod: "PayPal",
//     status: "complete",
//     totalAmount: 541.59,
//   },
//   {
//     id: "5ecb8a85a850c16fa413849c",
//     createdAt: subDays(subHours(now, 3), 7).getTime(),
//     currency: "$",
//     customer: {
//       address1: "Street John Wick, no. 7",
//       address2: "House #25",
//       city: "San Diego",
//       country: "USA",
//       email: "miron.vitold@devias.io",
//       name: "Miron Vitold",
//     },
//     items: [
//       {
//         id: "5ecb8abbdd6dfb1f9d6bf98b",
//         billingCycle: "monthly",
//         currency: "$",
//         name: "Project Points",
//         quantity: 25,
//         unitAmount: 50.25,
//       },
//       {
//         id: "5ecb8ac10f116d04bed990eb",
//         billingCycle: "monthly",
//         currency: "$",
//         name: "Freelancer Subscription",
//         quantity: 1,
//         unitAmount: 5.0,
//       },
//     ],
//     status: "pending",
//     number: "DEV-97",
//     paymentMethod: "CreditCard",
//     totalAmount: 941.21,
//   },
//   {
//     id: "5ecb8a8e69ba2e409ea0168f",
//     createdAt: subDays(subHours(now, 6), 8).getTime(),
//     currency: "$",
//     customer: {
//       address1: "Street John Wick, no. 7",
//       address2: "House #25",
//       city: "San Diego",
//       country: "USA",
//       email: "miron.vitold@devias.io",
//       name: "Miron Vitold",
//     },
//     items: [
//       {
//         id: "5ecb8abbdd6dfb1f9d6bf98b",
//         billingCycle: "monthly",
//         currency: "$",
//         name: "Project Points",
//         quantity: 25,
//         unitAmount: 50.25,
//       },
//       {
//         id: "5ecb8ac10f116d04bed990eb",
//         billingCycle: "monthly",
//         currency: "$",
//         name: "Freelancer Subscription",
//         quantity: 1,
//         unitAmount: 5.0,
//       },
//     ],
//     number: "DEV-96",
//     paymentMethod: "CreditCard",
//     status: "complete",
//     totalAmount: 499.12,
//   },
//   {
//     id: "5ecb8a9341c68839d387e1c4",
//     createdAt: subDays(subHours(now, 7), 8).getTime(),
//     currency: "$",
//     customer: {
//       address1: "Street John Wick, no. 7",
//       address2: "House #25",
//       city: "San Diego",
//       country: "USA",
//       email: "miron.vitold@devias.io",
//       name: "Miron Vitold",
//     },
//     items: [
//       {
//         id: "5ecb8abbdd6dfb1f9d6bf98b",
//         billingCycle: "monthly",
//         currency: "$",
//         name: "Project Points",
//         quantity: 25,
//         unitAmount: 50.25,
//       },
//       {
//         id: "5ecb8ac10f116d04bed990eb",
//         billingCycle: "monthly",
//         currency: "$",
//         name: "Freelancer Subscription",
//         quantity: 1,
//         unitAmount: 5.0,
//       },
//     ],
//     number: "DEV-95",
//     paymentMethod: "PayPal",
//     status: "rejected",
//     totalAmount: 588.75,
//   },
//   {
//     id: "5ecb8a984bfbb97c9ae458e8",
//     createdAt: subDays(subHours(now, 6), 9).getTime(),
//     currency: "$",
//     customer: {
//       address1: "Street John Wick, no. 7",
//       address2: "House #25",
//       city: "San Diego",
//       country: "USA",
//       email: "miron.vitold@devias.io",
//       name: "Miron Vitold",
//     },
//     items: [
//       {
//         id: "5ecb8abbdd6dfb1f9d6bf98b",
//         billingCycle: "monthly",
//         currency: "$",
//         name: "Project Points",
//         quantity: 25,
//         unitAmount: 50.25,
//       },
//       {
//         id: "5ecb8ac10f116d04bed990eb",
//         billingCycle: "monthly",
//         currency: "$",
//         name: "Freelancer Subscription",
//         quantity: 1,
//         unitAmount: 5.0,
//       },
//     ],
//     number: "DEV-94",
//     paymentMethod: "CreditCard",
//     status: "canceled",
//     totalAmount: 399.99,
//   },
//   {
//     id: "5ecb8aa08d9127dba654ce7a",
//     createdAt: subDays(subHours(now, 3), 10).getTime(),
//     currency: "$",
//     customer: {
//       address1: "Street John Wick, no. 7",
//       address2: "House #25",
//       city: "San Diego",
//       country: "USA",
//       email: "miron.vitold@devias.io",
//       name: "Miron Vitold",
//     },
//     items: [
//       {
//         id: "5ecb8abbdd6dfb1f9d6bf98b",
//         billingCycle: "monthly",
//         currency: "$",
//         name: "Project Points",
//         quantity: 25,
//         unitAmount: 50.25,
//       },
//       {
//         id: "5ecb8ac10f116d04bed990eb",
//         billingCycle: "monthly",
//         currency: "$",
//         name: "Freelancer Subscription",
//         quantity: 1,
//         unitAmount: 5.0,
//       },
//     ],
//     number: "DEV-93",
//     paymentMethod: "PayPal",
//     status: "canceled",
//     totalAmount: 500.0,
//   },
// ];

class OrdersApi {
  getOrders(request = {}, orders: OrderType[]) {
    const { filters, page, rowsPerPage, sortBy, sortDir }: Request = request;

    let data = orders;
    let count = data.length;

    if (typeof filters !== "undefined") {
      data = data.filter((order) => {
        if (typeof filters.query !== "undefined" && filters.query !== "") {
          // Checks only the order number, but can be extended to support other fields, such as customer
          // name, email, etc.
          const containsQuery = (order._id || "")
            .toLowerCase()
            .includes(filters.query.toLowerCase());

          if (!containsQuery) {
            return false;
          }
        }

        if (typeof filters.status !== "undefined") {
          const statusMatched = order.status === filters.status;

          if (!statusMatched) {
            return false;
          }
        }

        return true;
      });
      count = data.length;
    }

    if (typeof sortBy !== "undefined" && typeof sortDir !== "undefined") {
      data = applySort(data, sortBy, sortDir);
    }

    if (typeof page !== "undefined" && typeof rowsPerPage !== "undefined") {
      data = applyPagination(data, page, rowsPerPage);
    }

    return Promise.resolve({
      data,
      count,
    });
  }

  // getOrder(request: Request) {
  //   const order = orders.find((order) => order._id === request.filters?.query)
  //   return Promise.resolve(order);
  // }
}

export const ordersApi = new OrdersApi();
