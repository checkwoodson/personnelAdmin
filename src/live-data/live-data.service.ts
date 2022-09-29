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
import { resolve } from 'path';

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
  private findData = new Map();
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
        this.insertData(val);
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
  async insertData(data) {
    await this.getSqlName(this.games);
    await this.getSqlName(this.anchors);
    data.forEach(async (item) => {
      //const gameId = await this.getSqlId(item.gameName, this.games);
      const anchor = this.uniqueFunc(item[item.gameName], 'anchor');
      anchor.forEach(async (item) => {
        if (item.anchor === '') return;
        await this.getSqlId(item.anchor, this.anchors);
      });
    });
  }
  uniqueFunc(arr, uniId) {
    let obj = {};
    return arr.reduce((accum, item) => {
      obj[item[uniId]] ? '' : (obj[item[uniId]] = true && accum.push(item));
      return accum;
    }, []);
  }
  // 查询子表的id和name
  async getSqlName(sqlName) {
    const sqlData = await sqlName.find();
    sqlData &&
      sqlData.forEach((item) => {
        this.findData.set(item.name, item.id);
      });
    return this.findData;
  }
  async getSqlId(name, entity) {
    let sqlId = this.findData.get(name);
    if (sqlId) {
      return sqlId;
    }
    return new Promise(async (resolve) => {
      const sqlData = await entity.insert({ name });
      const sqlId = await sqlData.raw.insertId;
      resolve(sqlId);
    }).then((res) => {
      this.findData.set(name, res);
      return res;
    });
  }
}
