export const getTxErrorMessage = (e: any) => {
  const msgs = (e?.message || e).split('\n');
  const message = `${msgs[0]} ${msgs[1] ?? ""}`;
  return message;
}
