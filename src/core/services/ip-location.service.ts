import { IpApiResponse } from '@/core/@types/ip-api';
import { IpLocation } from '@/core/object-values/ip-location';
import { Injectable } from '@nestjs/common';

@Injectable()
export class IpLocationService {
  async lookup(ip: string): Promise<IpLocation> {
    const url = `http://ip-api.com/json/${ip}`;
    const response = await fetch(url);
    const data = (await response.json()) as IpApiResponse;

    if (data.status !== 'success') {
      throw new Error('IP lookup failed');
    }

    return new IpLocation({
      country: data.country,
      region: data.regionName,
      city: data.city,
      lat: data.lat,
      lon: data.lon,
      ip: data.query,
    });
  }
}
