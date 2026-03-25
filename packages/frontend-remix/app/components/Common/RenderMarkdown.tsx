export default function RenderMarkdown({ children }: { children: string }) {
  const html = children
    .replace(/\n/g, "<br />")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>");

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
