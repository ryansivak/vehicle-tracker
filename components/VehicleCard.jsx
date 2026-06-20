export function VehicleCard({ vehicle }) {
  return (
    <article className="vehicle-card">
      <div className="vehicle-card__header">
        <div>
          <p className="eyebrow">Example vehicle</p>
          <h2>{vehicle.nickname}</h2>
        </div>
        <span className="pill">Seeded</span>
      </div>

      <dl className="spec-grid">
        <Detail label="Year" value={vehicle.year} />
        <Detail label="Make" value={vehicle.make} />
        <Detail label="Model" value={vehicle.model} />
        <Detail label="VIN" value={vehicle.vin} wide />
        <Detail label="Mileage" value={`${vehicle.currentMileage.toLocaleString()} mi`} />
      </dl>

      <p className="vehicle-notes">{vehicle.notes}</p>
    </article>
  );
}

function Detail({ label, value, wide = false }) {
  return (
    <div className={wide ? 'detail detail-wide' : 'detail'}>
      <dt>{label}</dt>
      <dd>{value || '—'}</dd>
    </div>
  );
}
