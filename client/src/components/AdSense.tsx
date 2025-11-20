import { useEffect } from "react";

interface AdSenseProps {
  slot: string;
  format?: "auto" | "rectangle" | "vertical" | "horizontal";
  responsive?: boolean;
  className?: string;
}

/**
 * AdSense ad component
 * Displays Google AdSense ads in various formats
 */
export function AdSense({
  slot,
  format = "auto",
  responsive = true,
  className = "",
}: AdSenseProps) {
  useEffect(() => {
    // Initialize AdSense ads
    try {
      if ((window as any).adsbygoogle) {
        (window as any).adsbygoogle.push({});
      }
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, [slot]);

  return (
    <div className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          textAlign: "center",
        }}
        data-ad-client={process.env.VITE_ADSENSE_CLIENT_ID || "ca-pub-xxxxxxxxxxxxxxxx"}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}

/**
 * Inline ad component (for article content)
 */
export function InlineAd({ className = "" }: { className?: string }) {
  return (
    <AdSense
      slot="1234567890"
      format="rectangle"
      className={`my-6 flex justify-center ${className}`}
    />
  );
}

/**
 * Sidebar ad component
 */
export function SidebarAd({ className = "" }: { className?: string }) {
  return (
    <AdSense
      slot="0987654321"
      format="vertical"
      className={`sticky top-4 ${className}`}
    />
  );
}

/**
 * Header ad component
 */
export function HeaderAd({ className = "" }: { className?: string }) {
  return (
    <AdSense
      slot="1111111111"
      format="horizontal"
      className={`my-4 ${className}`}
    />
  );
}

/**
 * Footer ad component
 */
export function FooterAd({ className = "" }: { className?: string }) {
  return (
    <AdSense
      slot="2222222222"
      format="auto"
      className={`my-6 ${className}`}
    />
  );
}
