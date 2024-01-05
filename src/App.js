import React, { useState } from "react";
import "./App.css";

function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    plan: "arcade",
    billingCycle: "monthly",
    addons: {
      onlineService: false,
      largerStorage: false,
      customizableProfile: false,
    },
  });

  const [confirmed, setConfirmed] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleConfirm = () => {
    // Set confirmed to true to display the confirmation page
    setConfirmed(true);
  };

  const validateStep1 = () => {
    const { name, email, phone } = formData;
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate Name
    if (!name.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "This field is required",
      }));
      isValid = false;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }

    // Validate Email
    if (!emailRegex.test(email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "This field is required",
      }));
      isValid = false;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }

    // Validate Phone
    if (!phone.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phone: "This field is required",
      }));
      isValid = false;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }

    return isValid;
  };

  const handleNext = () => {
    // If the current step is 1, validate and move to the next step
    if (step === 1) {
      if (validateStep1()) {
        setStep(step + 1);
      }
    } else {
      // For subsequent steps, simply move to the next step
      if (step < 4) {
        setStep(step + 1);
      }
    }
  };

  // const handleNext = () => {
  //   if (step < 4) {
  //     setStep(step + 1);
  //   }
  // };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;

  //   setFormData((prevData) => {
  //     const updatedData = {
  //       ...prevData,
  //       [name]: value,
  //     };
  //     if (errors[name]) {
  //       setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  //     }
  //     return updatedData;
  //   });
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: name === "phone" ? formatPhoneNumber(value) : value,
      };

      // Clear the corresponding error if there was one
      if (errors[name]) {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      }

      return updatedData;
    });
  };

  const formatPhoneNumber = (input) => {
    // Remove non-numeric characters
    const phoneNumber = input.replace(/\D/g, "");

    // Format as (XXX) XXX-XXXX
    let formattedValue = "";
    if (phoneNumber.length > 0) {
      formattedValue = `(${phoneNumber.slice(0, 3)}`;
    }
    if (phoneNumber.length > 3) {
      formattedValue += `) ${phoneNumber.slice(3, 6)}`;
    }
    if (phoneNumber.length > 6) {
      formattedValue += `-${phoneNumber.slice(6, 10)}`;
    }

    return formattedValue;
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    console.log("Name:", name);
    console.log("Value:", value);
    console.log("Type:", type);
    console.log("Checked:", checked);

    if (name === "billingCycle") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else if (name === "plan") {
      setFormData((prevData) => ({
        ...prevData,
        plan: value,
      }));
    } else if (name.startsWith("addons.")) {
      const addonName = name.substring("addons.".length);
      setFormData((prevData) => ({
        ...prevData,
        addons: {
          ...prevData.addons,
          [addonName]: checked,
        },
      }));
    }
  };

  const calculateTotal = () => {
    let total = 0;
    const { plan, billingCycle, addons } = formData;
    const planPrice =
      plan === "arcade"
        ? billingCycle === "monthly"
          ? 9
          : 90
        : plan === "advanced"
        ? billingCycle === "monthly"
          ? 12
          : 120
        : billingCycle === "monthly"
        ? 15
        : 150;
    total += planPrice;
    if (addons.onlineService) total += billingCycle === "monthly" ? 1 : 10;
    if (addons.largerStorage) total += billingCycle === "monthly" ? 2 : 20;
    if (addons.customizableProfile)
      total += billingCycle === "monthly" ? 2 : 20;
    return total;
  };

  const calculatePlanPrice = () => {
    const { plan, billingCycle } = formData;
    let planPrice = 0;

    if (plan === "arcade") {
      planPrice = billingCycle === "monthly" ? 9 : 90;
    } else if (plan === "advanced") {
      planPrice = billingCycle === "monthly" ? 12 : 120;
    } else if (plan === "pro") {
      planPrice = billingCycle === "monthly" ? 15 : 150;
    }

    return planPrice;
  };

  const planPrice = calculatePlanPrice();

  const toggleBillingCycle = () => {
    setFormData((prevData) => ({
      ...prevData,
      billingCycle: prevData.billingCycle === "monthly" ? "yearly" : "monthly",
    }));
  };

  const billingCycleLabel = formData.billingCycle === "monthly" ? "mo" : "yr";
  const totalLabel =
    formData.billingCycle === "monthly" ? "per month" : "per year";

  return (
    <div className="App">
      <div className="main ">
        <div className="sidebar">
          <ol className="sidebar-ol">
            <li className={step === 1 ? "active" : ""}>
              <div className="step-wrapper">
                <p className="sidebar-step-number">Step 1</p>
                <p className="sidebar-step-names">Your Info</p>
              </div>
            </li>
            <li className={step === 2 ? "active" : ""}>
              <div className="step-wrapper">
                <p className="sidebar-step-number">Step 2</p>
                <p className="sidebar-step-names">Select Plan</p>
              </div>
            </li>
            <li className={step === 3 ? "active" : ""}>
              <div className="step-wrapper">
                <p className="sidebar-step-number">Step 3</p>
                <p className="sidebar-step-names">Add-Ons</p>
              </div>
            </li>
            <li className={step === 4 ? "active" : ""}>
              <div className="step-wrapper">
                <p className="sidebar-step-number">Step 4</p>
                <p className="sidebar-step-names">Summary</p>
              </div>
            </li>
          </ol>
        </div>
        <div className="form-container">
          {step === 1 && (
            <div className="form-content">
              <header>
                <h1>Personal Info</h1>
                <p>
                  Please provide your name, email address, and phone number.
                </p>
              </header>
              <span className="labelErrorContainer">
                <label className="form-label">Name</label>
                <p className="error-message">{errors.name}</p>
              </span>
              <input
                className={`step-one-input ${
                  errors.name ? "invalid-input" : ""
                }`}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                // onChange={handleChange}
                // onBlur={handleChange}
                placeholder="e.g. Stephen King"
              />
              <span className="labelErrorContainer">
                <label className="form-label">Email Address</label>
                <p className="error-message">{errors.email}</p>
              </span>
              <input
                className={`step-one-input ${
                  errors.email ? "invalid-input" : ""
                }`}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                // onChange={handleChange}
                // onBlur={handleChange}
                placeholder="e.g. stephenking@lorem.com"
              />
              <span className="labelErrorContainer">
                <label className="form-label">Phone Number</label>
                <p className="error-message">{errors.phone}</p>
              </span>
              <input
                className={`step-one-input ${
                  errors.phone ? "invalid-input" : ""
                }`}
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                // onChange={handleChange}
                // onBlur={handleChange}
                placeholder="e.g. +1 555 555 5555"
              />
              <footer>
                <button className="next-button" onClick={handleNext}>
                  Next Step
                </button>
              </footer>
            </div>
          )}
          {step === 2 && (
            <div className="form-content">
              <header>
                <h1>Select your plan</h1>
                <p>You have the option of monthly or yearly billing.</p>
              </header>
              <div className="three-options-container">
                <label
                  className={`plan-label ${
                    formData.plan === "arcade" ? "selected-plan" : ""
                  }`}
                >
                  <img className="plan-image" src="icon-arcade.svg" alt="" />
                  <input
                    type="radio"
                    name="plan"
                    value="arcade"
                    checked={formData.plan === "arcade"}
                    onChange={handleChange}
                  />
                  <div className="divForFlex">
                    <span className="plan-title">Arcade</span> <br />
                    <span className="price-text">
                      {" "}
                      {formData.billingCycle === "monthly" ? (
                        "$9/mo"
                      ) : (
                        <>
                          {" "}
                          $90/yr <br />{" "}
                          <span className="two-months-free">2 months free</span>
                        </>
                      )}
                    </span>
                  </div>
                </label>
                <label
                  className={`plan-label ${
                    formData.plan === "advanced" ? "selected-plan" : ""
                  }`}
                >
                  <img className="plan-image" src="icon-advanced.svg" alt="" />
                  <input
                    type="radio"
                    name="plan"
                    value="advanced"
                    checked={formData.plan === "advanced"}
                    onChange={handleChange}
                  />
                  <div>
                    <span className="plan-title">Advanced</span> <br />
                    <span className="price-text">
                      {" "}
                      {formData.billingCycle === "monthly" ? (
                        "$12/mo"
                      ) : (
                        <>
                          {" "}
                          $120/yr <br />{" "}
                          <span className="two-months-free">2 months free</span>
                        </>
                      )}
                    </span>
                  </div>
                </label>
                <label
                  className={`plan-label ${
                    formData.plan === "pro" ? "selected-plan" : ""
                  }`}
                >
                  <img className="plan-image" src="icon-pro.svg" alt="" />
                  <input
                    type="radio"
                    name="plan"
                    value="pro"
                    checked={formData.plan === "pro"}
                    onChange={handleChange}
                  />
                  <div>
                    <span className="plan-title">Pro</span>
                    <br />
                    <span className="price-text">
                      {" "}
                      {formData.billingCycle === "monthly" ? (
                        "$15/mo"
                      ) : (
                        <>
                          $150/yr
                          <br />
                          <span className="two-months-free">2 months free</span>
                        </>
                      )}
                    </span>
                  </div>
                </label>
              </div>
              {/* TOGGLE SWITCH */}
              <div className="toggle-container">
                <label
                  className={`switch-label ${
                    formData.billingCycle === "monthly" ? "selected" : ""
                  }`}
                >
                  Monthly
                </label>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={formData.billingCycle === "yearly"}
                    onChange={() =>
                      handleChange({
                        target: {
                          name: "billingCycle",
                          value:
                            formData.billingCycle === "monthly"
                              ? "yearly"
                              : "monthly",
                        },
                      })
                    }
                  />
                  <span className="slider round"></span>
                </label>
                <label
                  className={`switch-label ${
                    formData.billingCycle === "yearly" ? "selected" : ""
                  }`}
                >
                  Yearly
                </label>
              </div>
              <footer>
                <button className="back-button" onClick={handleBack}>
                  Go Back
                </button>
                <button className="next-button" onClick={handleNext}>
                  Next Step
                </button>
              </footer>{" "}
            </div>
          )}
          {/* STEP 3 */}
          {step === 3 && (
            <div className="form-content">
              <header>
                <h1>Pick Add-Ons</h1>
                <p>Add-ons help enahnce your gaming experience</p>
              </header>{" "}
              {/* ONLINE SERVICE */}
              <label
                className={`addOnButton ${
                  formData.addons.onlineService ? "checked" : ""
                }`}
                htmlFor="onlineService"
              >
                <input
                  id="onlineService"
                  className="checkboxInput"
                  type="checkbox"
                  name="addons.onlineService"
                  checked={formData.addons.onlineService}
                  onChange={handleChange}
                />
                <span className="checkboxBox"></span>
                <span className="addon-flex-container">
                  <h4>Online Service</h4>
                  <p>Access to multiplayer games</p>
                </span>{" "}
                <div className="addOnPrices">
                  {formData.billingCycle === "monthly" ? "+$1/mo" : "+$10/yr"}
                </div>
              </label>
              {/* LARGER STORAGE */}
              <label
                className={`addOnButton ${
                  formData.addons.largerStorage ? "checked" : ""
                }`}
                htmlFor="largerStorage"
              >
                <input
                  id="largerStorage"
                  className="checkboxInput"
                  type="checkbox"
                  name="addons.largerStorage"
                  checked={formData.addons.largerStorage}
                  onChange={handleChange}
                />
                <span className="checkboxBox"></span>
                <div className="addon-flex-container">
                  <h4>Larger Storage</h4> <p>Extra 1TB of cloud storage</p>
                </div>{" "}
                <div className="addOnPrices">
                  {formData.billingCycle === "monthly" ? "+$2/mo" : "+$20/yr"}
                </div>
              </label>
              {/* CUSTOMIZABLE PROFILE */}
              <label
                className={`addOnButton ${
                  formData.addons.customizableProfile ? "checked" : ""
                }`}
                htmlFor="customizableProfile"
              >
                <input
                  id="customizableProfile"
                  className="checkboxInput"
                  type="checkbox"
                  name="addons.customizableProfile"
                  checked={formData.addons.customizableProfile}
                  onChange={handleChange}
                />
                <span className="checkboxBox"></span>
                <div className="addon-flex-container">
                  <h4>Customizable Profile</h4>
                  <p>Custom theme on your profile</p>
                </div>{" "}
                <div className="addOnPrices">
                  {formData.billingCycle === "monthly" ? "+$2/mo" : "+$20/yr"}
                </div>
              </label>
              <footer>
                <button className="back-button" onClick={handleBack}>
                  Go Back
                </button>
                <button className="next-button" onClick={handleNext}>
                  Next Step
                </button>
              </footer>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && !confirmed && (
            <div className="form-content">
              <header>
                <h1>Finishing Up</h1>
                <p>Double-check everything looks OK before confirming.</p>
              </header>
              <div className="summary">
                <p className="planSelection">
                  <span className="confirmedPlan">
                    {formData.plan} ({formData.billingCycle})
                  </span>
                  <p>
                    ${planPrice}/{billingCycleLabel}
                  </p>
                </p>
                <button className="toggleButton" onClick={toggleBillingCycle}>
                  Change
                </button>
                <p className="spanBorder"></p>
                {formData.addons.onlineService && (
                  <p
                    className="confirmedList
                  "
                  >
                    {" "}
                    Online Service
                    <span className="confirmedListPrice">
                      {formData.billingCycle === "monthly"
                        ? "+$1/mo"
                        : "+$20/yr"}
                    </span>
                  </p>
                )}
                {formData.addons.largerStorage && (
                  <p
                    className="confirmedList
                  "
                  >
                    {" "}
                    Larger Storage
                    <span className="confirmedListPrice">
                      {formData.billingCycle === "monthly"
                        ? "+$2/mo"
                        : "+$20/yr"}
                    </span>
                  </p>
                )}
                {formData.addons.customizableProfile && (
                  <p
                    className="confirmedList
                  "
                  >
                    {" "}
                    Customizable Profile
                    <span className="confirmedListPrice">
                      {formData.billingCycle === "monthly"
                        ? "+$2/mo"
                        : "+$20/yr"}
                    </span>
                  </p>
                )}
              </div>
              <p className="confirmedTotal">
                Total ({totalLabel})
                <p className="confirmedTotalPrice">
                  +${calculateTotal()}/{billingCycleLabel}
                </p>
              </p>
              <footer>
                <button className="back-button" onClick={handleBack}>
                  Go Back
                </button>
                <button className="next-button" onClick={handleConfirm}>
                  Confirm
                </button>
              </footer>
            </div>
          )}
          {step === 4 && confirmed && (
            <div className="form-content confirmedPage">
              <img src="icon-thank-you.svg" alt="" />
              <h1>Thank You!</h1>
              <p>
                Thanks for confirming your subscription! We hope you have fun
                using our platform. If you ever need support, please feel free
                to email us at support@loremgaming.com
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
