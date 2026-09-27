// Friends log in with a name + 6-digit PIN. Behind the scenes the name is turned
// into an internal address, so nobody needs a real email.
// Set VITE_LOGIN_EMAIL in Vercel to a real address you own (e.g. you@gmail.com).
// Each friend becomes you+pop-name@gmail.com. No emails are sent.
const LOGIN_EMAIL = (import.meta.env.VITE_LOGIN_EMAIL || "").trim();
export const toEmail = (name) => {
  const [local, domain] = LOGIN_EMAIL.split("@");
  if (!local || !domain) throw new Error("VITE_LOGIN_EMAIL is not set in Vercel.");
  return `${local}+pop-${name.trim().toLowerCase()}@${domain}`;
};
