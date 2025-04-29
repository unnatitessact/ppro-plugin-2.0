import type { AxiosError } from "axios";
import type { SetStateAction } from "react";

import { useState } from "react";

// import { useRouter } from "next/navigation";

import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Kbd } from "../ui/Kbd";

import FormHeading from "./FormHeading";

type LoginMechanism = "otp" | "password";
// import { api } from "../../api-integration/axios";

// import { sendOTP } from "@/actions/auth/otp";

interface SelectLoginMechanismProps {
  emailInput: string;
  setEmailInput: (value: SetStateAction<string>) => void;
  setEmail: (value: SetStateAction<string | null>) => void;
  setSelectedMechanism: (value: SetStateAction<LoginMechanism | null>) => void;
}

const SelectLoginMechanism = ({
  emailInput,
  setEmailInput,
  setEmail,
  setSelectedMechanism,
}: SelectLoginMechanismProps) => {
  const [error, setError] = useState("");
  const [isOTPMechanismLoading, setIsOTPMechanismLoading] = useState(false);
  const [isPasswordMechanismLoading, setIsPasswordMechanismLoading] =
    useState(false);

  const isValidEmail = async (
    email: string,
    setError: (value: SetStateAction<string>) => void
  ): Promise<boolean> => {
    // Check if email is filled
    if (!email) {
      setError("Enter email to proceed");
      return false;
    }

    // Check if email is valid
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!emailRegex.test(email)) {
      setError("Enter a valid email");
      return false;
    }

    try {
      //   await api.post("/auth/check_user", { email });
    } catch (e) {
      const error = e as AxiosError;

      if (error?.response?.status === 404) {
        setError("Email is not registered with us");
        return false;
      }

      setError("Unable to verify if email is registered");
      return false;
    }

    return true;
  };

  const handleOTPMechanism = async () => {
    try {
      setIsOTPMechanismLoading(true);

      // Check if email is valid
      const isEmailValid = await isValidEmail(emailInput, setError);

      if (!isEmailValid) return;

      setSelectedMechanism("otp");

      // Send OTP
      //   const { success } = await sendOTP(emailInput);

      //   if (!success) {
      //     setError("Unable to send OTP");
      //     return;
      //   }

      setEmail(emailInput);
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("mechanism", "otp");
      //   router.push(`/login?${searchParams.toString()}`);
    } finally {
      setIsOTPMechanismLoading(false);
    }
  };

  const handlePasswordMechanism = async () => {
    try {
      setIsPasswordMechanismLoading(true);

      // Check if email is valid
      const isEmailValid = await isValidEmail(emailInput, setError);

      if (!isEmailValid) return;

      setEmail(emailInput);
      setSelectedMechanism("password");
    } finally {
      setIsPasswordMechanismLoading(false);
    }
  };

  //   const router = useRouter();

  return (
    <div className="flex flex-col gap-11">
      <FormHeading
        title="Log In"
        subtitle="Enter your registered email to receive an one-time passcode"
      />
      <form
        className="flex flex-col gap-11"
        onSubmit={async (e) => {
          e.preventDefault();
          await handlePasswordMechanism();
        }}
      >
        <Input
          label="Email"
          placeholder="Enter your company email"
          value={emailInput}
          onChange={(e) => {
            setError("");
            setEmailInput(e.target.value);
          }}
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (e.shiftKey) {
                await handleOTPMechanism();
              } else {
                await handlePasswordMechanism();
              }
            }
          }}
          isInvalid={!!error}
          errorMessage={error}
          autoFocus
        />
        <div className="flex flex-col gap-3">
          <Button
            color="primary"
            isLoading={isPasswordMechanismLoading}
            onPress={async () => await handlePasswordMechanism()}
            size="lg"
            endContent={
              <Kbd keys={["enter"]} className="text-ds-text-primary"></Kbd>
            }
            aria-label="Log in with password"
          >
            Log in with password
          </Button>
          <div className="grid grid-cols-11 items-center gap-4">
            <div className="col-span-5 w-full border border-ds-remix-bar-divider" />
            <p className="col-span-1 text-center text-ds-text-secondary">or</p>
            <div className="col-span-5 w-full border border-ds-remix-bar-divider" />
          </div>
          <Button
            color="default"
            size="lg"
            endContent={
              <Kbd
                keys={["shift", "enter"]}
                className="text-ds-text-primary"
              ></Kbd>
            }
            isLoading={isOTPMechanismLoading}
            onPress={async () => await handleOTPMechanism()}
            aria-label="Send 6-digit code"
          >
            Send 6-digit code
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SelectLoginMechanism;
