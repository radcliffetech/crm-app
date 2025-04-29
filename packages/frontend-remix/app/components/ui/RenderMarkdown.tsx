import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";

export default function RenderMarkdown({ children }: { children: string }) {
  const processedChildren = children.replace(/\n/gi, "&nbsp; \n");

  return (
    <Markdown
      rehypePlugins={[rehypeRaw]}
      remarkPlugins={[remarkBreaks]}
    >
      {processedChildren}
    </Markdown>
  );
}
