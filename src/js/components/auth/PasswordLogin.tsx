import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Kbd } from "../ui/Kbd";
import { Link } from "../ui/Link";
import { PasswordInput } from "../ui/PasswordInput";

import FormHeading from "./FormHeading";

import { loginWithEmailPassword } from "../../api-integration/mutations/auth";

import useAuth from "../../hooks/useAuth";

// import { LoginWithPasswordSchema } from '@/schemas/auth';

// import { loginWithPassword } from '@/actions/auth/login';

const LoginWithPasswordSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

interface PasswordLoginProps {
  initialEmail: string;
  next?: string;
}

const PasswordLogin = ({ initialEmail, next }: PasswordLoginProps) => {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    setError,
    watch,
  } = useForm<z.infer<typeof LoginWithPasswordSchema>>({
    resolver: zodResolver(LoginWithPasswordSchema),
  });

  const email = watch("email") ?? initialEmail;

  const { setAuth } = useAuth();

  return (
    <>
      <FormHeading title="Log In" subtitle="Enter your password to step in" />
      <form
        className="flex flex-col gap-10"
        onSubmit={handleSubmit(async (data) => {
          const loginResult = await loginWithEmailPassword(data);
          setAuth({
            accessToken: loginResult.accessToken,
            refreshToken: loginResult.refreshToken,
            user: loginResult.user,
          });
        })}
      >
        <div className="flex flex-col gap-5">
          <Input
            {...register("email")}
            label="Email"
            defaultValue={initialEmail}
            placeholder="Enter your company email"
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
          />
          <PasswordInput
            {...register("password")}
            label="Password"
            autoFocus
            placeholder="Enter your password"
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message}
            description={
              <Link
                href={`/forgot-password${
                  email ? `?email=${encodeURIComponent(email)}` : ""
                }`}
                className="font-medium hover:cursor-pointer"
              >
                Forgot Password
              </Link>
            }
          />
        </div>
        {errors.root && <p className="text-danger">{errors.root.message}</p>}
        <Button
          isLoading={isSubmitting}
          type="submit"
          color="primary"
          size="lg"
          endContent={<Kbd keys={["enter"]} className="text-ds-text-primary" />}
          aria-label="Password Log in"
          onClick={() => {
            // handleSubmit(async (data) => {
            //   await loginWithEmailPassword(data);
            // })();
          }}
        >
          Log In
        </Button>
      </form>
    </>
  );
};

export default PasswordLogin;
