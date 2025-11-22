import { ISimpleSelect } from "@/types/IApp";

export const paymentChannels: ISimpleSelect[] = [
  {
    id: "cash",
    name: "Cash",
  },
  {
    id: "card",
    name: "Card",
  },
  {
    id: "transfer",
    name: "Transfer",
  },
];