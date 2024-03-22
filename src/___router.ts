import Landing from "./pages/Landing"
import SelectContract from "./pages/SelectContract"
import SelectProtocol from "./pages/SelectProtocol"

// import Connect from "./pages/Connect"

const pages = {
  // connect: Connect,
  default: Landing,
  'select-protocol': SelectProtocol,
  'select-contract': SelectContract,
};

export const getPageComponent = () => {
  const pageName = window.location.pathname.split("/")[1];
  return pages[pageName] || pages.default;
}
