interface getLiveData {
  id: number;
  live_water: number;
  anchor: string;
  game: string;
  union: string;
  children: [
    {
      live_water: number;
      date_time: string;
    },
  ];
}

export class getLiveDataDto {
  total: number;
  page: number;
  pageSize: number;
  data: Array<getLiveData>;
}
