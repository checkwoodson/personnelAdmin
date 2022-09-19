import * as bcrypt from 'bcryptjs';
/**
 *  加密处理
 * -data 要加密的数据
 * - slat 用于哈希加密的盐
 */
const hashPassword = (password: string): string =>
  bcrypt.hashSync(password, 10);

/**
 * 校验
 */
const isOk = (password: string, encryptPassword: string): string | number =>
  bcrypt.compareSync(password, encryptPassword);

export { hashPassword, isOk };
