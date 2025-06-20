"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getWorkspaceTeam } from "@/stores/getWorkspaceTeam";
import { Users, Loader2 } from "lucide-react";
import { useEffect, useId } from "react";
import { useParams } from "next/navigation";

function AssignUser() {
  const id = useId();
  const params = useParams();
  const workspaceId = params.id as string;

  const { data, loading, error, fetchData } = getWorkspaceTeam();

  useEffect(() => {
    if (workspaceId && fetchData) {
      fetchData(workspaceId);
    }
  }, [workspaceId, fetchData]);

  return (
    <div className="space-y-2 min-w-[100px]">
      <Select defaultValue="none">
        <SelectTrigger
          id={id}
          className="ps-2 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_img]:shrink-0 [&>svg]:hidden"
        >
          <SelectValue placeholder="Select assignee" />
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

          {loading && (
            <SelectGroup>
              <SelectLabel className="ps-2">Loading...</SelectLabel>
              <SelectItem value="loading" disabled className="text-sm">
                <Loader2 className="size-3 animate-spin" />
                Loading team members...
              </SelectItem>
            </SelectGroup>
          )}

          {error && (
            <SelectGroup>
              <SelectLabel className="ps-2 text-red-500">Error</SelectLabel>
              <SelectItem
                value="error"
                disabled
                className="text-sm text-red-500"
              >
                Failed to load team members
              </SelectItem>
            </SelectGroup>
          )}

          {data && data.team && data.team.length > 0 && (
            <SelectGroup>
              <SelectLabel className="ps-2">Team</SelectLabel>
              {data.team.map((member) => (
                <SelectItem
                  key={member.id}
                  value={member.id}
                  className="text-sm dark:hover:bg-neutral-900 hover:cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-lumi flex items-center justify-center">
                    <span className="text-white text-xs font-normal">
                      {member.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="flex items-center gap-2">
                    {member.username}
                  </span>
                </SelectItem>
              ))}
            </SelectGroup>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}

export { AssignUser };
