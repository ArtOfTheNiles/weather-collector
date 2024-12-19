import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbLocation = path.join(__dirname, './../../../server/db/db.json');

class City {
  name: string;
  id: string;
  constructor(name: string, id: string){
    this.name = name;
    this.id = id;
  }
}


class HistoryService {

  private async read() {
    return await fs.readFile(dbLocation, {
      flag: 'a+',
      encoding: 'utf8',
    });
  }

  private async write(cities: City[]) {
    return await fs.writeFile(dbLocation, JSON.stringify(cities, null, '\t'));
  }

  async getCities() {
    return await this.read()
      .then((data) =>{
        let parsedData: City[];

        try {
          parsedData = [].concat(JSON.parse(data));
        } catch (error) {
          console.trace('Error in GetCities() function!');
          parsedData = [];
        }

        return parsedData;
      });
  }

  async addCity(inputCity: string) {
    if(!inputCity) {
      throw new Error('Input required!');
    }

    const newCity: City = { name: inputCity, id: uuidv4() };

    return await this.getCities()
      .then((cities) => {
        if(cities.find((i) => i.name === inputCity)){
          return cities;
        }
        return [...cities, newCity];
      })
      .then((updatedCities) => this.write(updatedCities))
      .then(() => newCity);
  }

  async removeCity(id: string) {
    return await this.getCities()
      .then((cities) => cities.filter((city) => city.id !== id))
      .then((filteredCities) => this.write(filteredCities));
  }
}

export default new HistoryService();
