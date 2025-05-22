const enableAdminMode = () => {
  localStorage.setItem("isAdminMode", "true");
  window.location.href = "/admin"; // Redirect to the admin page
};

const disableAdminMode = () => {
  localStorage.removeItem("isAdminMode");
  window.location.href = "/"; // Redirect to the home page
};

const isAdminMode = () => {
  return localStorage.getItem("isAdminMode") === "true";
};

export { enableAdminMode, disableAdminMode, isAdminMode };
