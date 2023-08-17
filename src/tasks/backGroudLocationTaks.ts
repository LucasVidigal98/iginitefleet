import { Accuracy, hasStartedLocationUpdatesAsync, startLocationUpdatesAsync, stopLocationUpdatesAsync } from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { saveStorageLocation } from '../libs/asyncStorage/locationStorage';

export const BACKGROUND_TASK_NAME = 'location-tracking';

TaskManager.defineTask(BACKGROUND_TASK_NAME, async ({ data, error }: any) => {
  try {
    if (error) {
      throw error;
    }

    if (data) {
      const { coords, timestamp } = data.locations[0];

      const currentLocation = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        timestamp: timestamp
      };

      await saveStorageLocation(currentLocation);
    }

  } catch (error) {
    console.log(error);
    stopLoactionTask();
  }
});

export async function startLocationTask() {
  try {
    const hasStarted = await hasStartedLocationUpdatesAsync(BACKGROUND_TASK_NAME);

    if (hasStarted) {
      await stopLoactionTask();
    }

    await startLocationUpdatesAsync(BACKGROUND_TASK_NAME, {
      accuracy: Accuracy.High,
      distanceInterval: 1,
      timeInterval: 1000
    });
  } catch (error) {
    console.log(error);
  }
}

export async function stopLoactionTask() {
  try {
    const hasStarted = await hasStartedLocationUpdatesAsync(BACKGROUND_TASK_NAME);

    if (hasStarted) {
      await stopLocationUpdatesAsync(BACKGROUND_TASK_NAME);
    }

  } catch (error) {
    console.log(error);
  }
}