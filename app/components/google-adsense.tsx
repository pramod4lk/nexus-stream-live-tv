import Script from "next/script";

type Props = {
    pId: string;
};

export default function GoogleAdsense({ pId }: Props) {
    if (process.env.NODE_ENV !== "production") {
        return null;
    }

    return (
        <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pId.startsWith("ca-") ? pId : `ca-${pId}`}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
        />
    );
}
