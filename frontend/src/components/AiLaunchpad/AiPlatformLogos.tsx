import type { SVGProps } from "react";

/**
 * OpenAI / ChatGPT Codex official icon
 */
export function ChatGptLogo({ className = "size-6", ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path
        fill="currentColor"
        stroke="none"
        d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.0993 3.8558L12.5973 8.3829l2.02-1.1686a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.4023-.6812zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L8.907 9.2297V6.8974a.0662.0662 0 0 1 .0331-.0615L13.882 3.99a4.5087 4.5087 0 0 1 6.5688 4.7383zm-11.025 4.2985l-2.02-1.1686a.071.071 0 0 1-.038-.052V6.2257a4.504 4.504 0 0 1 7.371-3.4537l-.142.0805-4.7783 2.7582a.7948.7948 0 0 0-.3927.6813zm1.0976 1.8458l2.607-1.505 2.607 1.505v3.01l-2.607 1.505-2.607-1.505z"
      />
    </svg>
  );
}

/**
 * Google Antigravity / Gemini DeepMind icon
 */
export function AntigravityLogo({ className = "size-6", ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="antigravity-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="50%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>
      </defs>
      <path
        d="M12 0C12 6.62742 6.62742 12 0 12C6.62742 12 12 17.3726 12 24C12 17.3726 17.3726 12 24 12C17.3726 12 12 6.62742 12 0Z"
        fill="url(#antigravity-grad)"
      />
      <circle cx="12" cy="12" r="3.5" fill="#FFFFFF" fillOpacity="0.85" />
    </svg>
  );
}

/**
 * Anthropic Claude official logo
 */
export function ClaudeLogo({ className = "size-6", ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      {...props}
    >
      <path
        fill="#D97706"
        d="M13.523 2.128a1.2 1.2 0 0 0-2.046 0L9.043 6.425a1.2 1.2 0 0 1-.86.577l-4.78.694a1.2 1.2 0 0 0-.665 2.046l3.46 3.372a1.2 1.2 0 0 1 .345.1.06l-.817 4.76a1.2 1.2 0 0 0 1.74 1.264l4.276-2.248a1.2 1.2 0 0 1 1.116 0l4.276 2.248a1.2 1.2 0 0 0 1.74-1.264l-.817-4.76a1.2 1.2 0 0 1 .345-.1.06l3.46-3.372a1.2 1.2 0 0 0-.665-2.046l-4.78-.694a1.2 1.2 0 0 1-.86-.577l-2.434-4.297z"
      />
      <path
        fill="#F59E0B"
        d="M12 4.5l1.6 3.2a1 1 0 0 0 .75.55l3.5.5-2.55 2.5a1 1 0 0 0-.3.88l.6 3.5-3.15-1.65a1 1 0 0 0-.95 0L8.4 15.63l.6-3.5a1 1 0 0 0-.3-.88l-2.55-2.5 3.5-.5a1 1 0 0 0 .75-.55L12 4.5z"
      />
    </svg>
  );
}

/**
 * Kiro AI / Code Engine logo
 */
export function KiroLogo({ className = "size-6", ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="kiro-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#kiro-grad)" />
      <path
        d="M7 7.5L12 12L7 16.5M12.5 16.5H17"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
