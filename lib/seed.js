const fixedTimestamp = '2026-06-19T00:00:00.000Z';

export const seedState = {
  vehicles: [
    {
      id: 'veh-equinox',
      nickname: '2010 Chevy Equinox',
      year: 2010,
      make: 'Chevrolet',
      model: 'Equinox',
      trim: '',
      vin: '2CNLFCEW9A6317537',
      licensePlate: '',
      currentMileage: 94285,
      notes: 'Imported example vehicle for the clean Supabase-ready project.',
      createdAt: fixedTimestamp,
      updatedAt: fixedTimestamp,
    },
  ],
  maintenance_logs: [],
  repairs: [],
  fuel_logs: [],
  parts: [],
  documents: [],
  photos: [],
  reminders: [],
};

export function createEmptyDrafts() {
  return {
    maintenance: {
      vehicleId: 'veh-equinox',
      serviceDate: '',
      mileage: '',
      serviceType: 'Oil change',
      description: '',
      cost: '',
      shop: '',
    },
    reminder: {
      vehicleId: 'veh-equinox',
      title: '',
      dueDate: '',
      notes: '',
    },
  };
}
