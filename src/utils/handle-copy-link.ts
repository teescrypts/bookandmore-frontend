"use client"

export default function handleCopyLink(link: string) {
  navigator.clipboard.writeText(link);
  alert("Link copied to clipboard!");
}
