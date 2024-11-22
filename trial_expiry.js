const paths = [
  "/login",
  "/signup",
  "/resetpassword",
  "/password-update",
  "payment-success",
  "redirect",
];

if (!paths.includes(n.path)) {
  console.log("trialExpiry comp var");

  const organization = r.get_user_data.data[0].organizations[0];
  console.log("organization: ", organization);

  const trialExpiryModal = document.querySelector(
    '[w-el="trial-expiry-modal"]'
  );
  function unsetExpiry() {
    console.log("unsetExpiry called");
    localStorage.removeItem("sleakTrialExpired");
    console.log("sleakTrialExpired removed from localStorage");
    trialExpiryModal.style.display = "none";
    console.log("trialExpiryModal display set to none");
    return true;
  }
  function setExpiry() {
    localStorage.setItem("sleakTrialExpired", true);
    trialExpiryModal.style.display = "flex";
    console.log("is expired");
    return false;
  }

  if (
    organization.subscription_status !== "active" ||
    organization.subscription_status == null
  ) {
    console.log("subscription is not active");

    const currentDate = new Date();
    const createdAt = new Date(organization.created_at);
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(currentDate.getDate() - 14);

    if (fourteenDaysAgo > createdAt) {
      console.log("+14 days ago");

      if (organization.trial_extended) {
        console.log("trial is extended");
        const extendedDate = new Date(organization.trial_extended);
        if (extendedDate < currentDate) {
          console.log("extended date is earlier than current date");
          return setExpiry();
        } else {
          console.log("extended date is later than current date");
          return unsetExpiry();
        }
      } else {
        console.log("no extended date");
        return setExpiry();
      }
    } else {
      console.log("not +14 days ago");
      return unsetExpiry();
    }
  } else if (localStorage.getItem("sleakTrialExpired")) {
    console.log("subscription is active");
    return unsetExpiry();
  }
}
