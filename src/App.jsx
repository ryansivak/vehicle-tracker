import { useEffect, useMemo, useState } from 'react';
import { EmptyState } from '../components/EmptyState.jsx';
import { VehicleCard } from '../components/VehicleCard.jsx';
import { seedState, createEmptyDrafts } from '../lib/seed.js';
import { supabase, supabaseReady } from '../lib/supabaseClient.ts';

const STORAGE_KEY = 'vehicle-tracker-clean-state-v1';

function readStoredState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : seedState;
  } catch {
    return seedState;
  }
}

function writeStoredState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage failures and keep the app usable.
  }
}

export default function App() {
  const [state, setState] = useState(() => seedState);
  const [drafts, setDrafts] = useState(() => createEmptyDrafts());
  const [supabaseStatus, setSupabaseStatus] = useState(
    supabaseReady ? 'Checking Supabase connection...' : 'Supabase not configured yet.'
  );

  useEffect(() => {
    setState(readStoredState());
  }, []);

  useEffect(() => {
    writeStoredState(state);
  }, [state]);

  useEffect(() => {
    let active = true;
    if (!supabase) return undefined;

    supabase
      .from('vehicles')
      .select('id', { count: 'exact', head: true })
      .then(({ count, error }) => {
        if (!active) return;
        if (error) {
          setSupabaseStatus(`Supabase configured, but the query failed: ${error.message}`);
          return;
        }
        setSupabaseStatus(`Supabase connected. ${count || 0} vehicle row(s) available.`);
      })
      .catch((error) => {
        if (active) setSupabaseStatus(`Supabase connection failed: ${error.message}`);
      });

    return () => {
      active = false;
    };
  }, []);

  const vehicle = state.vehicles[0];

  const summary = useMemo(
    () => [
      { label: 'Vehicles', value: state.vehicles.length },
      { label: 'Maintenance logs', value: state.maintenance_logs.length },
      { label: 'Repairs', value: state.repairs.length },
      { label: 'Reminders', value: state.reminders.length },
    ],
    [state]
  );

  function handleMaintenanceSubmit(event) {
    event.preventDefault();
    const entry = {
      id: crypto.randomUUID(),
      vehicleId: drafts.maintenance.vehicleId,
      serviceDate: drafts.maintenance.serviceDate,
      mileage: Number(drafts.maintenance.mileage || 0),
      serviceType: drafts.maintenance.serviceType.trim() || 'Maintenance',
      description: drafts.maintenance.description.trim(),
      cost: Number(drafts.maintenance.cost || 0),
      shop: drafts.maintenance.shop.trim(),
      createdAt: new Date().toISOString(),
    };

    setState((current) => ({
      ...current,
      maintenance_logs: [entry, ...current.maintenance_logs],
    }));

    setDrafts((current) => ({
      ...current,
      maintenance: {
        ...current.maintenance,
        serviceDate: '',
        mileage: '',
        description: '',
        cost: '',
        shop: '',
      },
    }));
  }

  function handleReminderSubmit(event) {
    event.preventDefault();
    const reminder = {
      id: crypto.randomUUID(),
      vehicleId: drafts.reminder.vehicleId,
      title: drafts.reminder.title.trim(),
      dueDate: drafts.reminder.dueDate,
      notes: drafts.reminder.notes.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    if (!reminder.title) return;

    setState((current) => ({
      ...current,
      reminders: [reminder, ...current.reminders],
    }));

    setDrafts((current) => ({
      ...current,
      reminder: {
        ...current.reminder,
        title: '',
        dueDate: '',
        notes: '',
      },
    }));
  }

  return (
    <main className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Vehicle tracker</p>
          <h1>Clean, deployable, Supabase-ready.</h1>
          <p className="lede">
            One example vehicle is seeded locally. Everything else is ready for GitHub, Vercel, and Supabase.
          </p>
        </div>
        <div className="status-card">
          <strong>Supabase</strong>
          <p>{supabaseStatus}</p>
        </div>
      </header>

      <section className="stats-grid">
        {summary.map((item) => (
          <div key={item.label} className="stat-card">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </section>

      <section className="grid-layout">
        <div className="panel">
          <VehicleCard vehicle={vehicle} />
        </div>

        <div className="panel">
          <div className="section-head">
            <div>
              <p className="eyebrow">Maintenance logs</p>
              <h2>Add service</h2>
            </div>
          </div>

          <form className="form-grid" onSubmit={handleMaintenanceSubmit}>
            <label>
              <span>Service date</span>
              <input
                type="date"
                value={drafts.maintenance.serviceDate}
                onChange={(event) =>
                  setDrafts((current) => ({
                    ...current,
                    maintenance: { ...current.maintenance, serviceDate: event.target.value },
                  }))
                }
              />
            </label>
            <label>
              <span>Mileage</span>
              <input
                type="number"
                value={drafts.maintenance.mileage}
                onChange={(event) =>
                  setDrafts((current) => ({
                    ...current,
                    maintenance: { ...current.maintenance, mileage: event.target.value },
                  }))
                }
              />
            </label>
            <label>
              <span>Service type</span>
              <input
                value={drafts.maintenance.serviceType}
                onChange={(event) =>
                  setDrafts((current) => ({
                    ...current,
                    maintenance: { ...current.maintenance, serviceType: event.target.value },
                  }))
                }
              />
            </label>
            <label>
              <span>Cost</span>
              <input
                type="number"
                step="0.01"
                value={drafts.maintenance.cost}
                onChange={(event) =>
                  setDrafts((current) => ({
                    ...current,
                    maintenance: { ...current.maintenance, cost: event.target.value },
                  }))
                }
              />
            </label>
            <label className="full">
              <span>Description</span>
              <textarea
                rows="3"
                value={drafts.maintenance.description}
                onChange={(event) =>
                  setDrafts((current) => ({
                    ...current,
                    maintenance: { ...current.maintenance, description: event.target.value },
                  }))
                }
              />
            </label>
            <label className="full">
              <span>Shop</span>
              <input
                value={drafts.maintenance.shop}
                onChange={(event) =>
                  setDrafts((current) => ({
                    ...current,
                    maintenance: { ...current.maintenance, shop: event.target.value },
                  }))
                }
              />
            </label>
            <button className="primary full" type="submit">
              Save maintenance log
            </button>
          </form>

          <div className="list">
            {state.maintenance_logs.length ? (
              state.maintenance_logs.map((log) => (
                <article key={log.id} className="list-card">
                  <strong>{log.serviceType}</strong>
                  <p>{log.description || 'No description provided.'}</p>
                  <small>
                    {log.serviceDate || 'No date'} · {log.mileage ? `${log.mileage.toLocaleString()} mi` : 'Mileage not set'}
                  </small>
                </article>
              ))
            ) : (
              <EmptyState
                title="No maintenance logs yet"
                text="Add the first service record for the Equinox."
              />
            )}
          </div>
        </div>

        <div className="panel">
          <div className="section-head">
            <div>
              <p className="eyebrow">Reminders</p>
              <h2>Plan follow-ups</h2>
            </div>
          </div>

          <form className="form-grid" onSubmit={handleReminderSubmit}>
            <label>
              <span>Title</span>
              <input
                value={drafts.reminder.title}
                onChange={(event) =>
                  setDrafts((current) => ({
                    ...current,
                    reminder: { ...current.reminder, title: event.target.value },
                  }))
                }
              />
            </label>
            <label>
              <span>Due date</span>
              <input
                type="date"
                value={drafts.reminder.dueDate}
                onChange={(event) =>
                  setDrafts((current) => ({
                    ...current,
                    reminder: { ...current.reminder, dueDate: event.target.value },
                  }))
                }
              />
            </label>
            <label className="full">
              <span>Notes</span>
              <textarea
                rows="3"
                value={drafts.reminder.notes}
                onChange={(event) =>
                  setDrafts((current) => ({
                    ...current,
                    reminder: { ...current.reminder, notes: event.target.value },
                  }))
                }
              />
            </label>
            <button className="primary full" type="submit">
              Save reminder
            </button>
          </form>

          <div className="list">
            {state.reminders.length ? (
              state.reminders.map((reminder) => (
                <article key={reminder.id} className="list-card">
                  <strong>{reminder.title}</strong>
                  <p>{reminder.notes || 'No notes provided.'}</p>
                  <small>{reminder.dueDate || 'No due date'}</small>
                </article>
              ))
            ) : (
              <EmptyState title="No reminders yet" text="Create a due-date reminder for the Equinox." />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
