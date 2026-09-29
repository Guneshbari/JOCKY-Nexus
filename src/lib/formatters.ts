export function formatDate(timestamp: string | number | Date): string {
  if (!timestamp) return "N/A"
  const date = new Date(timestamp)
  if (isNaN(date.getTime())) return String(timestamp)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date)
}

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function truncateHash(hash: string, startLength: number = 8, endLength: number = 8): string {
  if (!hash) return ""
  if (hash.length <= startLength + endLength) return hash
  return `${hash.slice(0, startLength)}...${hash.slice(-endLength)}`
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (mins === 0) return `${secs}s`
  const hrs = Math.floor(mins / 60)
  const remainingMins = mins % 60
  if (hrs === 0) return `${remainingMins}m ${secs}s`
  return `${hrs}h ${remainingMins}m`
}

export function formatPercentage(value: number, total: number): string {
  if (total === 0) return "0%"
  return `${Math.round((value / total) * 100)}%`
}
