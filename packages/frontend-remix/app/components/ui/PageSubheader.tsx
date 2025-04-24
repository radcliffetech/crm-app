export default function PageSubheader({ children }: { children?: React.ReactNode }) {
    return (<h2 className="text-xl font-semibold mb-4">{children}</h2>
    );
}