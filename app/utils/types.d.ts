export interface ScheduleEntry {
  from_date: string;
  start_date?: string;
  [key: string]: string | null | undefined; // To handle additional properties
}
