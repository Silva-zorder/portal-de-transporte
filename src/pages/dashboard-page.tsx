import magazordWordmark from "@/assets/magazord-wordmark.svg";

function DashboardPage() {
  return (
    <section
      aria-label="Portal de transportes"
      className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-accent-0 px-xl py-xs"
      data-testid="dashboard-empty"
    >
      <img
        src={magazordWordmark}
        alt="Magazord Digital Commerce"
        width={969}
        height={161.929}
        className="h-auto max-w-full opacity-30"
      />
    </section>
  );
}

export { DashboardPage };
