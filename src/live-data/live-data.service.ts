import { Injectable, HttpStatus } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import * as xlsx from 'xlsx';
import { AnchorsEntity } from './entities/anchors.entity';
import { GamesEntity } from './entities/games.entity';
import { LiveDataEntity } from './entities/live-data.entity';
import { UnionEntity } from './entities/union.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Worker } from 'worker_threads';
import { uniqueFunc } from '../utils/common';
import * as dayjs from 'dayjs';

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
    const gameData = data.map((item) => {
      this.sqlInsert(this.games, item.gameName);
      ['anchor', 'union'].forEach((sqlName) =>
        uniqueFunc(item[item.gameName], sqlName).map(
          (item) =>
            item !== '' &&
            this.sqlInsert(
              sqlName === 'anchor' ? this.anchors : this.union,
              item,
            ),
        ),
      );
      return item;
    });
    this.insertLiveData(gameData);
  }
  // 插入总表
  async insertLiveData(gameData) {
    const getGameId = await this.getSqlName(this.games);
    const getUnionId = await this.getSqlName(this.union);
    const getAnchorId = await this.getSqlName(this.anchors);
    if ([getGameId, getUnionId, getAnchorId].every((item) => item.size > 0)) {
      gameData.forEach((item) => {
        item[item.gameName].forEach(async (el) => {
          const formatDate = dayjs(el.date_time).format('YYYY-MM-DD');
          !!el.anchor &&
            el.live_water !== '/' &&
            el.live_water !== '' &&
            !!formatDate &&
            (await this.liveData.insert({
              anchor: getAnchorId.get(el.anchor),
              game: getGameId.get(item.gameName),
              union: getUnionId.get(el.union),
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
    // 没有查到就插入数据
    !getName.get(name) && (await entities.insert({ name }));
  }

  // 查询子表的id和name
  async getSqlName(sqlName) {
    const findData = new Map();
    const sqlData = await sqlName.find();
    sqlData &&
      sqlData.forEach((item) => {
        findData.set(item.name, item.id);
      });
    return findData;
  }

  // 查询excel数据并做处理
  getGameData(): Promise<any> {
    return this.liveData.find({
      relations: ['anchor', 'game', 'union'],
    });
  }
}
