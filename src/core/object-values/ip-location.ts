type IpLocationProps = {
  country: string;
  region: string;
  regionName: string;
  city: string;
  lat: number;
  lon: number;
  ip: string;
};

export class IpLocation {
  readonly country: string;
  readonly region: string;
  readonly regionName: string;
  readonly city: string;
  readonly lat: number;
  readonly lon: number;
  readonly ip: string;

  constructor(props: IpLocationProps) {
    this.country = props.country;
    this.region = props.region;
    this.regionName = props.regionName;
    this.city = props.city;
    this.lat = props.lat;
    this.lon = props.lon;
    this.ip = props.ip;
  }
}
