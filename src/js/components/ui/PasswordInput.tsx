import type { InputProps } from "@nextui-org/input";

import { useState } from "react";

import { forwardRef } from "@nextui-org/react";

import { EyeClosed, EyeOpen } from "@tessact/icons";

import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export const PasswordInput = forwardRef(function CustomInput(
  { label, ...props }: InputProps & { label?: string },
  ref
) {
  const [visible, setVisible] = useState<boolean>(false);
  return (
    <Input
      ref={ref}
      label={label || "Password"}
      placeholder="******"
      type={visible ? "text" : "password"}
      endContent={
        <Button
          isIconOnly
          variant="light"
          className="data-[hover=true]:bg-transparent"
          onPress={() => setVisible((prev) => !prev)}
          aria-label="Toggle password visibility"
        >
          {visible ? <EyeOpen size={20} /> : <EyeClosed size={20} />}
        </Button>
      }
      {...props}
    />
  );
});
