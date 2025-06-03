"use client";

import { useEffect } from "react";
import { useInviteStore } from "@/stores/inviteStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

export default function InboxPage() {
  const {
    invites,
    isLoading,
    error,
    fetchInvites,
    acceptInvite,
    rejectInvite,
  } = useInviteStore();

  useEffect(() => {
    fetchInvites();
  }, [fetchInvites]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container py-8 px-4">
      <h1 className="text-2xl font-semibold mb-8 text-neutral-900 dark:text-neutral-200">
        Inbox
      </h1>
      <div className="space-y-3">
        {invites.length === 0 ? (
          <div>
            <p className="text-neutral-500 dark:text-neutral-400">
              No invites found...
            </p>
          </div>
        ) : (
          invites.map((invite) => (
            <Card
              key={invite.id}
              className="bg-neutral-50 dark:bg-white/5 hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors duration-200"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-lumi flex items-center justify-center">
                        <span className="text-white text-lg font-medium">
                          {invite.boardName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-neutral-900 dark:text-neutral-200">
                          {invite.boardName}
                        </h3>
                        <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
                          <span className="mr-1">From</span>
                          <span className="text-neutral-900 dark:text-neutral-300">
                            {invite.inviterName}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                      {formatDistanceToNow(new Date(invite.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                    {invite.status === "accepted" && (
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                        Accepted
                      </div>
                    )}
                    {invite.status === "rejected" && (
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400">
                        Rejected
                      </div>
                    )}
                  </div>
                  {invite.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        variant={"default"}
                        size={"sm"}
                        onClick={() => acceptInvite(invite.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 h-auto text-sm font-medium transition-colors"
                      >
                        Accept
                      </Button>
                      <Button
                        onClick={() => rejectInvite(invite.id)}
                        size={"sm"}
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-500/10 px-3 py-1.5 h-auto text-sm font-medium transition-colors"
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
