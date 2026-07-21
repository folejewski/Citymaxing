export function MockModeBanner({ error }: { error?: string }) {
  return (
    <div className="text-xs rounded-md bg-amber-500/15 text-amber-800 dark:text-amber-400 px-3 py-2">
      Mock mode — no <code>GEMINI_API_KEY</code> configured{error ? ` (last error: ${error})` : ""}.
    </div>
  );
}
