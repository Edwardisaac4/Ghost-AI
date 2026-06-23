import Link from "next/link";

export default async function WorkspacePlaceholder({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg-base text-text-primary px-6">
      <div className="max-w-md w-full p-8 rounded-3xl bg-bg-surface border border-border-default text-center shadow-xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Workspace Shell
        </h1>
        <p className="text-sm text-text-muted">
          This is a temporary placeholder for room ID: <span className="font-mono text-accent-primary">{roomId}</span>.
        </p>
        <p className="text-xs text-text-faint">
          The collaborative workspace shell and Liveblocks Canvas will be integrated here in the next features.
        </p>
        <div className="pt-4 border-t border-border-default/50">
          <Link
            href="/editor"
            className="inline-flex items-center justify-center w-full bg-accent-primary hover:bg-accent-primary/90 text-bg-base font-semibold py-2 px-4 rounded-xl transition-all cursor-pointer shadow-lg shadow-accent-primary/5"
          >
            Back to Editor Home
          </Link>
        </div>
      </div>
    </div>
  );
}
