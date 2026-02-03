'use client'

import { QRCodeSVG } from 'qrcode.react'
import { cn } from '@/lib/cn'

export interface QRCodeProps {
  /** URL or text to encode */
  url: string
  /** Size in pixels (default: 128) */
  size?: number
  /** Additional class name */
  className?: string
  /** Include text label below QR code */
  label?: string
}

/**
 * QR Code component for print views
 *
 * Used to display video links as scannable QR codes when printing
 */
export function QRCode({ url, size = 128, className, label }: QRCodeProps) {
  return (
    <div className={cn('inline-flex flex-col items-center', className)}>
      <QRCodeSVG
        value={url}
        size={size}
        level="M" // Error correction level
        includeMargin
        bgColor="white"
        fgColor="black"
      />
      {label && (
        <span
          className="text-xs mt-1 text-center max-w-[128px] truncate"
          style={{ color: 'black' }}
        >
          {label}
        </span>
      )}
    </div>
  )
}
