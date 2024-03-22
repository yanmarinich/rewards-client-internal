export const getTxErrorMessage = (e: Error) => {
  const msgs = e.message.split('\n');
  const message = `${msgs[0]} ${msgs[1] ?? ""}`;
  return message;
}
