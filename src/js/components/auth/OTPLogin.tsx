import { Fragment, useEffect, useState } from "react";

import { Divider } from "@nextui-org/react";
import OtpInput from "react-otp-input";

import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Kbd } from "../ui/Kbd";
import { Link } from "../ui/Link";

import FormHeading from "./FormHeading";

// import { loginWithOTP } from "@/actions/auth/login";
// import { resendOTP } from "@/actions/auth/otp";

interface OTPLoginProps {
  email: string;
  next?: string;
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
export const renderInput = (inputProps: any, index: number) => (
  <Fragment key={index}>
    <Input
      {...inputProps}
      className="flex h-16 w-14 focus:border-primary-300 focus:outline-none focus:ring-0"
      inputMode="numeric"
      classNames={{
        input: ["text-xl"],
        innerWrapper: ["justify-center", "w-3"],
        inputWrapper: ["py-[14px]", "px-5", "h-full", "justify-center"],
      }}
    />
    {index === 2 && (
      <Divider orientation="vertical" className="h-4 w-0.5 rounded-md" />
    )}
  </Fragment>
);

const OTPLogin = ({ email, next }: OTPLoginProps) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (resendCountdown > 0) {
      interval = setInterval(() => {
        setResendCountdown((currentCountdown) => currentCountdown - 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
      interval = null;
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [resendCountdown]);

  const handleResendOTP = () => {
    setResendCountdown(60);
    // resendOTP(email);
    setError("");
  };

  return (
    <>
      <FormHeading
        title="We sent you a code"
        subtitle={`Please enter the 6-digit verification code sent to ${email}`}
      />
      <form
        className="flex flex-col gap-6"
        onSubmit={async (e) => {
          e.preventDefault();
          setError("");
          setIsSubmitting(true);
          //   await loginWithOTP({ email, otp }, next).then((data) => {
          //     if (data?.error) {
          //       setError(data.error);
          //     }
          //   });
          setIsSubmitting(false);
        }}
      >
        <div className="flex flex-col gap-2">
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            placeholder="000000"
            renderInput={(props, index) => renderInput(props, index)}
            shouldAutoFocus={true}
            containerStyle={{
              gap: "0.625rem",
            }}
          />
          <p className="font-medium text-default-500">
            Didn’t receive a code yet?{" "}
            {resendCountdown > 0 ? (
              <Link>
                {Math.floor(resendCountdown / 60)}:
                {resendCountdown % 60 < 10
                  ? `0${resendCountdown % 60}`
                  : resendCountdown % 60}
                s
              </Link>
            ) : (
              <Link className="cursor-pointer" onPress={handleResendOTP}>
                Resend code
              </Link>
            )}
          </p>
        </div>
        {error && <p className="text-danger">{error}</p>}
        <Button
          type="submit"
          color="primary"
          size="lg"
          endContent={<Kbd keys={["enter"]} className="text-ds-text-primary" />}
          isLoading={isSubmitting}
          aria-label="OTP Log in"
        >
          Log in
        </Button>
      </form>
    </>
  );
};

export default OTPLogin;
