// Links to Pop Mart and the resale sites.

export const popmartSearch = (q) => `https://www.popmart.com/de/search?keyword=${encodeURIComponent(q || "")}`;

export const searchLinks = (q) => {
  const e = encodeURIComponent(q);
  return [
    { name: "Vinted", url: `https://www.vinted.de/catalog?search_text=${e}&order=price_low_to_high` },
    { name: "Kleinanzeigen", url: `https://www.kleinanzeigen.de/s-${encodeURIComponent(q.trim().replace(/\s+/g, "-"))}/k0` },
    { name: "eBay (sold)", url: `https://www.ebay.de/sch/i.html?_nkw=${e}&LH_Sold=1&LH_Complete=1` },
  ];
};
