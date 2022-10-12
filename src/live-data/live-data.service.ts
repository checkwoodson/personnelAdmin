import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import * as xlsx from 'xlsx';
import { AnchorsEntity } from './entities/anchors.entity';
import { GamesEntity } from './entities/games.entity';
import { LiveDataEntity } from './entities/live-data.entity';
import { UnionEntity } from './entities/union.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Worker } from 'worker_threads';
import { uniqueFunc } from '../utils/common';
import * as dayjs from 'dayjs';
import { getLiveDataDto } from './dto/get-live-datum.dto';
@Injectable()
export class LiveDataService {
  constructor(
    @InjectRepository(AnchorsEntity)
    private anchors: Repository<AnchorsEntity>,
    @InjectRepository(GamesEntity)
    private games: Repository<GamesEntity>,
    @InjectRepository(LiveDataEntity)
    private liveData: Repository<LiveDataEntity>,
    @InjectRepository(UnionEntity)
    private union: Repository<UnionEntity>,
  ) {}
  @OnEvent('order.uploadSuccess', { async: true })
  async handleFileUploadSuccess(file) {
    const wb = xlsx.readFile(file.path, {
      type: 'binary',
      cellDates: true,
    });
    const sheetNames = wb.SheetNames.filter((sheet) => sheet.match('-'));
    // 读工作进程返回的数据
    this.createWorker(wb, sheetNames);
  }
  // 创建工作进程
  createWorker(wb, sheetNames) {
    let worker = new Worker('./src/utils/excelTojson.ts', {
      workerData: { wb, sheetNames },
    });
    return new Promise((resolve, reject) => {
      worker.on('message', (val) => {
        this.handleData(val);
        resolve(val);
      });
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`worker error: ${code}`));
        }
      });
    });
  }

  async handleData(data) {
    // 这一步只是对子表的数据进行筛查插入
    const gameName = data.map((item) => {
      return { name: item.gameName };
    });
    const dataFlat = data.map((item) => item[item.gameName]).flat();
    const [anchors, unions] = ['anchor', 'union'].map((item) => {
      return uniqueFunc(dataFlat, item)
        .filter((el) => el !== '')
        .map((item) => {
          return { name: item };
        });
    });
    Promise.allSettled([
      this.sqlInsert(this.union, unions),
      this.sqlInsert(this.anchors, anchors),
      this.sqlInsert(this.games, gameName),
    ])
      .then((res) => {
        res.every((item) => item.status === 'fulfilled') &&
          this.insertLiveData(data);
      })
      .catch((err) => {
        console.error(err, '子表数据插入失败');
      });
  }
  // 插入总表
  async insertLiveData(gameData) {
    let [getGameId, getUnionId, getAnchorId] = await Promise.all([
      this.getSqlName(this.games),
      this.getSqlName(this.union),
      this.getSqlName(this.anchors),
    ]);
    if ([getGameId, getUnionId, getAnchorId].every((item) => item.size > 0)) {
      gameData.forEach((item) => {
        item[item.gameName].forEach(async (el) => {
          const formatDate = dayjs(el.date_time).format('YYYY-MM-DD');
          !!el.anchor &&
            el.live_water !== '/' &&
            el.live_water !== '' &&
            !!formatDate &&
            (await this.liveData.insert({
              anchor_id: getAnchorId.get(el.anchor),
              game_id: getGameId.get(item.gameName),
              union_id: getUnionId.get(el.union),
              live_water: el.live_water,
              date_time: formatDate,
            }));
        });
      });
    }
  }
  // 插入数据库
  async sqlInsert(entities, name) {
    const getName = await this.getSqlName(entities);
    // 直接一次性插入
    const filterName = name.filter((item) => !getName.get(item.name));
    await entities.insert(filterName);
  }

  // 查询子表的id或name
  async getSqlName(sqlName, getName = false) {
    const findData = new Map();
    const sqlData = await sqlName.find();
    sqlData &&
      sqlData.forEach((item) => {
        !getName
          ? findData.set(item.name, item.id)
          : findData.set(item.id, item.name);
      });
    return findData;
  }

  // 查询excel数据并做处理
  async getGameData(getLiveDataDto): Promise<any> {
    const { page, pageSize, gameNameId, startDay, endDay } = getLiveDataDto;
    const [getAnchorName, getGamesName, getUnionName] = await Promise.all([
      this.getSqlName(this.anchors, true),
      this.getSqlName(this.games, true),
      this.getSqlName(this.union, true),
    ]);

    // m = maps
    // data.each(function (key, value) {
    //  key = value.gameID + value.AnId + value.UnionId
    //    if(m.has(key)) {
    //       m[] = value
    //}
    //}
    const [handleData, total] = await this.liveData.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: {
        game_id: gameNameId,
        date_time: Between(startDay, endDay),
      },
    });
    const obj = {};
    const a = handleData.map((item) => {
      let key = `${item.game_id} -${item.anchor_id} - ${item.union_id}`;
      console.log(key);
      if (!obj[key]) {
        obj[key] = {
          gameId: item.game_id,
          child: [],
        };
      }
    });
    console.log(Object.values(obj));
    const data = handleData.map((item) => {
      const { id, live_water, date_time, anchor_id, game_id, union_id } = item;
      return {
        id,
        anchor: getAnchorName.get(anchor_id),
        game: getGamesName.get(game_id),
        union: getUnionName.get(union_id),
        live_water,
        date_time,
      };
    });
    return {
      total,
      page,
      pageSize,
      data,
    };
  }
  async getAllParameters(): Promise<any> {
    return {
      anchorsList: await this.anchors.find(),
      games: await this.games.find(),
      union: await this.union.find(),
    };
  }
}
