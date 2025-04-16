interface FormHeadingProps {
  title: string;
  subtitle?: string;
  link?: {
    href: string;
    text: string;
  };
}

const FormHeading = ({ title, subtitle, link }: FormHeadingProps) => {
  return (
    <div className="flex w-full flex-col gap-4">
      <h2 className="text-4xl font-bold">{title}</h2>
      <p className="text-lg text-default-500">{subtitle} </p>
      {/* {link && <Link href={link.href}>{link.text}</Link>} */}
    </div>
  );
};

export default FormHeading;
