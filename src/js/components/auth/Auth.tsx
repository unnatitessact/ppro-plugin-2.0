("");

import { useEffect, useState } from "react";

import OTPLogin from "./OTPLogin";
import PasswordLogin from "./PasswordLogin";
import SelectLoginMechanism from "./SelectLoginMechanism";

type LoginMechanism = "otp" | "password";

const LoginPage = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState<string>("");

  const [selectedMechanism, setSelectedMechanism] =
    useState<LoginMechanism | null>(null);

  //   const selectedLoginMechanism = searchParams.get(
  //     "mechanism"
  //   ) as LoginMechanism;

  useEffect(() => {
    if (!email && selectedMechanism) {
      // TODO: redirect to the appropriate page
    }
  }, [selectedMechanism, email]);

  return (
    <div className="flex w-full items-center justify-center flex-col gap-11">
      <div className="max-w-md mx-auto">
        {!email || !selectedMechanism ? (
          <SelectLoginMechanism
            emailInput={emailInput}
            setEmailInput={setEmailInput}
            setEmail={setEmail}
            setSelectedMechanism={setSelectedMechanism}
          />
        ) : selectedMechanism === "otp" ? (
          <OTPLogin email={email} next={undefined} />
        ) : (
          <PasswordLogin initialEmail={email} next={undefined} />
        )}
      </div>
    </div>
  );
};

export default LoginPage;
