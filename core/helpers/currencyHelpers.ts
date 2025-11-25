export const renderCurrencySymbol = (currencyCode: string) => {
  try {
    if (currencyCode) {
      const parts = Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: currencyCode,
      }).formatToParts(0);

      const symbol = parts.find((part) => part.type === "currency")?.value;
      return symbol;
    } else {
      return "";
    }
  } catch (error) {
    console.log(error);
  }
};
