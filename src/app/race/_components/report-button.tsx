"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import type { Snippet } from "@prisma/client";
import { getRandomSnippet } from "../(play)/loaders";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";
import { downVoteSnippetAction } from "@/app/result/actions";

export function ReportButton({
  snippetId,
  language,
}: {
  snippetId: string;
  language: string;
}) {
  const [prevReportedSnippets, setPrevReportedSnippets] = React.useState<
    Snippet["id"][]
  >([]);
  const [isPending, startTransition] = React.useTransition();

  const router = useRouter();
  const pathname = usePathname();
  return (
    <Button
      disabled={isPending}
      // className="self-start"
      variant="destructive"
      onClick={() => {
        startTransition(async () => {
          await downVoteSnippetAction({ snippetId });
          const snippet = await getRandomSnippet({
            language: language,
            reportedSnippets: [...prevReportedSnippets, snippetId],
          });

          setPrevReportedSnippets((prev) => [snippetId, ...prev]);

          if (!snippet) {
            return void toast({
              title: "Oops, it's the last snippet that you didn't report",
              description:
                "You can try creating new one or choosing different language",
              variant: "destructive",
            });
          }

          router.push(
            `${pathname}?lang=${encodeURIComponent(
              language,
            )}&snippetId=${encodeURIComponent(snippet.id)}`,
          );
          router.refresh();
        });
      }}
    >
      {isPending && <Icons.spinner className="mr-2 animate-spin h-4 w-4" />}
      Report this snippet
    </Button>
  );
}
