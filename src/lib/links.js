// Link to the Pop Mart shop search (used for "Check price on Pop Mart" in the figure form).
export const popmartSearch = (q) => `https://www.popmart.com/de/search?keyword=${encodeURIComponent(q || "")}`;
