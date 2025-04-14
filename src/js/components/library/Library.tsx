import { Button } from "../ui/Button";
import { ListSparkle, DotGrid1X3Horizontal } from "@tessact/icons";

export const Library = () => {
  return (
    <div className="h-full w-full">
      <nav className="flex items-center justify-between gap-2 p-2">
        <p>Library</p>

        <div className="flex items-center gap-2">
          <Button isIconOnly>
            <ListSparkle size={20} />
          </Button>

          <Button isIconOnly>
            <DotGrid1X3Horizontal size={20} />
          </Button>
        </div>
      </nav>
    </div>
  );
};
