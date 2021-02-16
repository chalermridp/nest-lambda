import { IsNotEmpty, Length } from 'class-validator';

export class AccountsDeliveryAddressUpdateDto {
  @IsNotEmpty()
  place_name: string;
  @IsNotEmpty()
  @Length(1, 200)
  recipient: string;
  @IsNotEmpty()
  @Length(1, 100)
  address_number: string;
  @IsNotEmpty()
  @Length(1, 300)
  moo_soi_road: string;
  @IsNotEmpty()
  province: string;
  @IsNotEmpty()
  district: string;
  @IsNotEmpty()
  subdistrict: string;
  state: string;
  city: string;
  area: string;
  @IsNotEmpty()
  postal_code: string;
  @IsNotEmpty()
  @Length(1, 10)
  contact_number: string;
  @Length(1, 200)
  @IsNotEmpty()
  note_to_delivery: string;
}
