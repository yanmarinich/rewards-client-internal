export class TVal {
  constructor() { }

  isString(value: any) {
    return typeof value === "string";
  }

  isArray(value: any): value is any[] {
    return Array.isArray(value);
  }

  isObject(value: any): value is {} {
    return (
      typeof value === "object" &&
      !this.isNull(value) &&
      !this.isArray(value) &&
      !this.isArrayBuffer(value)
    );
  }

  isNull(value: any): value is null {
    return typeof value === "object" && value === null;
  }

  isNaN(value: any): value is typeof NaN {
    return typeof value === "number" && isNaN(value);
  }

  isUndefined(value: any): value is undefined {
    return typeof value === "undefined";
  }

  isBool(value: any): value is boolean {
    return typeof value === "boolean";
  }

  isBoolean(value: any): value is boolean {
    return this.isBool(value);
  }

  isInfinity(value: any): value is typeof Infinity {
    return typeof value === "number" && Math.abs(value) === Infinity;
  }

  isBigInt(value: any): value is bigint {
    return (
      typeof value === "bigint" && !this.isNaN(value)
    );
  }

  isNumber(value: any): value is number {
    return (
      typeof value === "number" &&
      !this.isNaN(value) &&
      Math.abs(value) !== Infinity
    );
  }

  isPosNumber(value: any): value is number {
    return this.isNumber(value) && value > 0;
  }

  isNegNumber(value: any): value is number {
    return this.isNumber(value) && value < 0;
  }

  isFunction(value: any): value is Function {
    return typeof value === "function";
  }

  isArrayBuffer(value: any): value is ArrayBuffer {
    return value instanceof ArrayBuffer && this.isNumber(value?.byteLength);
  }

  getString(value: any, defaultValue = ""): string {
    return this.isString(value) && value.length
      ? value
      : this.isString(defaultValue)
        ? defaultValue
        : "";
  }

  getArray(value: any, defaultValue = []): any[] {
    return this.isArray(value)
      ? value
      : this.isArray(defaultValue)
        ? defaultValue
        : [];
  }

  getObject(value: any, defaultValue = {}): any {
    return this.isObject(value) && this.isFunction(value.hasOwnProperty)
      ? value
      : this.isObject(defaultValue)
        ? defaultValue
        : {};
  }

  getFunction(value: any, defaultValue = {}): Function {
    return this.isFunction(value)
      ? value
      : this.isFunction(defaultValue)
        ? defaultValue
        : () => { };
  }

  isDateString(value: any): value is Date {
    try {
      if (!this.isString(value)) return false;
      return !!new Date(value).getTime();
    } catch (e: any) {
      return false;
    }
  }

  getBoolFromValue(value: any): boolean {
    if (this.isPosNumber(+value)) return !!+value;
    if (this.isString(value)) return value.trim().toLowerCase() === "true";
    return !!value;
  }

  getBooleanFromValue(value: any): boolean {
    return this.getBoolFromValue(value);
  }

  getNumber(value: any, { floor = false, abs = false, toFixed = false } = {}): number {
    if (!this.isNumber(+value)) return 0;
    let res = value;
    res = abs ? Math.abs(res) : res;
    res = floor ? Math.floor(+res) : +res;
    return this.isPosNumber(toFixed) ? +res.toFixed(+toFixed) : res;
  }

  getPosNumber(
    value: any,
    {
      floor = false,
      min = false,
      max = false,
      abs = false,
      toFixed = false
    } = {}
  ): number {
    if (!this.isNumber(+value)) return 0;
    let ret = value;
    ret = abs ? Math.abs(ret) : ret;
    ret = floor ? Math.floor(+ret) : +ret;

    ret =
      this.isNumber(min) && ret < min
        ? min
        : this.isNumber(max) && ret > max
          ? max
          : ret;

    return this.isPosNumber(toFixed) ? +(+ret).toFixed(+toFixed) : ret;
  }

  constrainNumber(amount: number, min: number, max: number): number {
    return amount < min ? min : amount >= max ? max : amount;
  }

  isValidPhone(phone: string): boolean {
    if (!this.isString(phone)) return false;
    const mPhoneRegExp = new RegExp(/^([+]?)([\d]{8,15})$/);
    return mPhoneRegExp.test(phone);
  }

  isEnv(env: string): boolean {
    return this.isString(env) && env === this.getEnv("NODE_ENV");
  }

  getEnv(key: string, toObject = false): string {
    try {
      if (!this.isString(process.env[key])) return '';
      return toObject ? JSON.parse(process.env[key] || "{}") : process.env[key];
    } catch (e: any) {
      console.error(
        `#tval:getEnv: ${e.message}  key: [${key}], toObject: [${toObject}]`
      );
      return '';
    }
  }

  getEnvAsObject(key: string): {} {
    try {
      return JSON.parse(process.env[key] || "{}");
    } catch (e: any) {
      console.error(
        `#tval:getEnvAsObject: ${e.message} key: [${key}]`
      );
      return {};
    }
  }

  getEnvOnceAsObject(key: string): {} {
    try {
      return JSON.parse(process.env[key] || "{}");
    } catch (e: any) {
      console.error(`#tval:getEnvOnceAsObject: ${e.message} key: [${key}]`);
      return {};
    }
  }

  getEnvOnce(key: string): string {
    try {
      if (!this.isString(process.env[key])) return '';
      return process.env[key] || "";
    } catch (e: any) {
      console.error(`#tval:getEnvOnce: ${e.message} key: [${key}]`);
      return "";
    }
  }

  getEnvAsBool(key: string): boolean {
    try {
      if (!this.isString(process.env[key])) return false;
      return this.getBoolFromValue(process.env[key]);
    } catch (e: any) {
      console.error(`#tval:getEnvAsBool: ${e.message}  key: [${key}]`);
      return false;
    }
  }

  getEnvAsInt(key: string): number {
    try {
      if (!this.isString(process.env[key])) return 0;
      return this.getNumber(process.env[key], { floor: true, abs: false });
    } catch (e: any) {
      console.error(`#tval:getEnvAsInt: ${e.message}  key: [${key}]`);
      return 0;
    }
  }

  getEnvAsFloat(key: string): number {
    try {
      if (!this.isString(process.env[key])) return 0;
      return this.getNumber(process.env[key], { floor: false, abs: false });
    } catch (e: any) {
      console.error(`#tval:getEnvAsFloat: ${e.message}  key: [${key}]`);
      return 0;
    }
  }

  getEnvAs(key: string, as: string): string | number | boolean {
    try {
      switch (as) {
        case 'string':
          return this.getEnv(key);
        case 'number':
        case 'int':
        case 'integer':
          return this.getEnvAsInt(key);
        case 'float':
        case 'double':
          return this.getEnvAsFloat(key);
        case 'boolean':
        case 'bool':
          return this.getEnvAsBool(key);
      }

      return "";

    } catch (e: any) {
      console.error(`#tval:getEnvAs:(${as}): ${e.message}  key: [${key}]`);
      return false;
    }
  }

  async sleep(msec: number): Promise<boolean> {
    return new Promise((res) => {
      setTimeout(() => { res(true) }, msec);
    })
  }

  res(success: boolean, message: string, data?: any) {
    return { success, message, data };
  }
}

const mTVal = new TVal();
export default mTVal;
