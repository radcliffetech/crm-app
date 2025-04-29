export function NotAuthorized({
  message = "You are not authorized to view this content",
}: {
  message?: string;
}) {
  return (
    <div className="flex items-center justify-center h-screen">
      <img
        src="/images/flaming-eyes.png"
        alt="Logo"
        className="w-48 m-4"
        height="150"
      />
      <h1 className="text-2xl">{message}</h1>
    </div>
  );
}
