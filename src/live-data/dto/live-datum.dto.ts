interface liveDatum {
  id: number;
  live_water: number;
  date_time: Date;
  create_time: Date;
  update_time: Date;
  anchor: string;
  game: string;
  union: string;
}

export interface AllLiveDatumDto {
  total: number;
  page: number;
  limit: number;
  data: Array<liveDatum>;
}
