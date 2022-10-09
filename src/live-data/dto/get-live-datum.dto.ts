interface getLiveData {
  id: number;
  live_water: number;
  date_time: Date;
  anchor: string;
  game: string;
  union: string;
}

export class getLiveDataDto {
  total: number;
  page: number;
  pageSize: number;
  data: Array<getLiveData>;
}
