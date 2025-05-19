type IpLocationProps = {
  country: string;
  region: string;
  city: string;
  lat: number;
  lon: number;
  ip: string;
};

export class IpLocation {
  readonly country: string;
  readonly region: string;
  readonly city: string;
  readonly lat: number;
  readonly lon: number;
  readonly ip: string;

  constructor(props: IpLocationProps) {
    this.country = props.country;
    this.region = props.region;
    this.city = props.city;
    this.lat = props.lat;
    this.lon = props.lon;
    this.ip = props.ip;
  }
}
