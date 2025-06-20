import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users } from "lucide-react";
import { useId } from "react";

function AssignUser() {
  const id = useId();
  return (
    <div className="space-y-2 min-w-[100px]">
      <Select defaultValue="none">
        <SelectTrigger
          id={id}
          className="ps-2 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_img]:shrink-0 [&>svg]:hidden"
        >
          <SelectValue placeholder="Select framework" />
        </SelectTrigger>
        <SelectContent className="[&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2 dark:bg-neutral-950">
          <SelectGroup>
            <SelectLabel className="ps-2">Assignee</SelectLabel>
            <SelectItem
              value="none"
              className="text-sm dark:hover:bg-neutral-900 hover:cursor-pointer"
            >
              <Users className="size-3" />
              Unassigned
            </SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel className="ps-2">Team</SelectLabel>
            <SelectItem value="test" className="text-sm">
              <div className="w-5 h-5 rounded-full bg-lumi flex items-center justify-center">
                <span className="text-white text-xs font-normal">u</span>
              </div>
              User
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export { AssignUser };
