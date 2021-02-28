export default class EnumNamingService {
  static getUniqueInt() {
    return this.offset++;
  }
}
EnumNamingService.offset = 0;
