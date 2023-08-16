import { LocationObjectCoords, reverseGeocodeAsync } from "expo-location";

export async function getAdressLocation({ latitude, longitude }: LocationObjectCoords) {
  try {
    const adressResponse = await reverseGeocodeAsync({ latitude, longitude });

    return adressResponse[0]?.street;
  } catch (error) {
    console.log(error);
  }
}