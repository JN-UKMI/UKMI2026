/**
 * RFC-5545 .ics generation for "Tambah ke Kalender" buttons.
 * Time values use floating time (no Z) so the event lands at the same
 * wall-clock time for users in any timezone - appropriate for local campus events.
 */

export interface IcsEventInput {
  title: string;
  /** YYYY-MM-DD */
  date: string;
  /** e.g. "08:00 WIB", "07.30", "Online", "Fleksibel" */
  time?: string;
  location?: string;
  description?: string;
  /** Duration in minutes, defaults to 120. */
  durationMinutes?: number;
}

/** RFC-5545: escape \n , ;  */
function escapeIcs(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function toIcsDate(dateStr: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateStr);
  if (!match) return "20260101";
  return `${match[1]}${match[2]}${match[3]}`;
}

/** Extract HH:MM from "08:00 WIB" or "07.30", or null for all-day events. */
function parseTime(time: string | undefined): { hour: number; minute: number } | null {
  if (!time) return null;
  const match = /(\d{1,2})[.:](\d{2})/.exec(time);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return null;
  return { hour, minute };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function generateIcsEvent(event: IcsEventInput): string {
  const datePart = toIcsDate(event.date);
  const parsed = parseTime(event.time);
  const uid = `${datePart}-${Math.random().toString(36).slice(2, 10)}@jnukmiuns.org`;

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//JN UKMI UNS//ID//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
  ];

  if (parsed) {
    const start = `${datePart}T${pad(parsed.hour)}${pad(parsed.minute)}00`;
    const totalMinutes = (event.durationMinutes ?? 120) + parsed.hour * 60 + parsed.minute;
    const endHour = Math.floor(totalMinutes / 60) % 24;
    const endMinute = totalMinutes % 60;
    const end = `${datePart}T${pad(endHour)}${pad(endMinute)}00`;
    lines.push(`DTSTART:${start}`, `DTEND:${end}`);
  } else {
    // All-day event
    lines.push(`DTSTART;VALUE=DATE:${datePart}`);
  }

  lines.push(`SUMMARY:${escapeIcs(event.title)}`);
  if (event.location) lines.push(`LOCATION:${escapeIcs(event.location)}`);
  if (event.description) lines.push(`DESCRIPTION:${escapeIcs(event.description)}`);
  lines.push("END:VEVENT", "END:VCALENDAR");

  return lines.join("\r\n") + "\r\n";
}

/** Trigger a browser download of the .ics file. */
export function downloadIcsEvent(event: IcsEventInput): void {
  const blob = new Blob([generateIcsEvent(event)], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const safeName = event.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  anchor.href = url;
  anchor.download = `${safeName || "event"}-jn-ukmi.ics`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
