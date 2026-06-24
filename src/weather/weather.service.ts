import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WeatherService {
  constructor(private readonly http: HttpService) {}

  async getWeather(city: string) {
    const key = process.env.OPENWEATHER_API_KEY;
    const url = 'https://api.openweathermap.org/data/2.5/weather';

    const { data } = await firstValueFrom(
      this.http.get(url, {
        params: { q: city || 'Dakar', appid: key, units: 'metric', lang: 'fr' },
      }),
    );

    return {
      ville: data.name,
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      icone: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      humidite: data.main.humidity,
    };
  }
}
