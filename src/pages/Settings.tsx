import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Download, Trash2, Trophy, Upload } from 'lucide-react'
import { format } from 'date-fns'
import { useAuthStore } from '../state/useAuthStore'
import { signOutUser } from '../hooks/useAuth'
import { useAchievements } from '../hooks/useAchievements'
import { useUserDoc } from '../hooks/useUser'
import { ACHIEVEMENTS } from '../lib/achievements'
import {
  deleteAllUserData,
  downloadJson,
  exportAllUserData,
  importUserData,
  type ExportPayload,
} from '../lib/export'
import { useSettingsStore } from '../state/useSettingsStore'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import './Page.css'
import './Settings.css'

export function Settings() {
  const user = useAuthStore((s) => s.user)
  const { unlocked } = useAchievements()
  const { doc: userDoc } = useUserDoc()
  const unit = useSettingsStore((s) => s.unit)
  const setUnit = useSettingsStore((s) => s.setUnit)
  const [signingOut, setSigningOut] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [importing, setImporting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [busyMsg, setBusyMsg] = useState<string | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  async function onSignOut() {
    setSigningOut(true)
    try {
      await signOutUser()
    } catch {
      setSigningOut(false)
    }
  }

  async function setWeeklyGoal(n: number) {
    if (!user) return
    await setDoc(
      doc(db, 'users', user.uid),
      { weeklyGoalWorkouts: n },
      { merge: true },
    )
  }

  async function onExport() {
    if (!user) return
    setExporting(true)
    setBusyMsg(null)
    try {
      const payload = await exportAllUserData(user.uid)
      const stamp = format(new Date(), 'yyyyMMdd-HHmm')
      downloadJson(`fitlog-export-${stamp}.json`, payload)
      setBusyMsg(
        `exported ${payload.workouts.length} workouts, ${payload.routines.length} routines.`,
      )
    } catch (e) {
      setBusyMsg(e instanceof Error ? e.message : 'export failed.')
    } finally {
      setExporting(false)
    }
  }

  async function onImport(file: File) {
    if (!user) return
    setImporting(true)
    setBusyMsg(null)
    try {
      const text = await file.text()
      const payload = JSON.parse(text) as ExportPayload
      await importUserData(user.uid, payload)
      setBusyMsg(
        `imported ${payload.workouts?.length ?? 0} workouts, ${payload.routines?.length ?? 0} routines.`,
      )
    } catch (e) {
      setBusyMsg(e instanceof Error ? e.message : 'import failed.')
    } finally {
      setImporting(false)
      if (fileInput.current) fileInput.current.value = ''
    }
  }

  async function onDeleteAccount() {
    if (!user) return
    const confirmInput = prompt(
      'this wipes all workouts, routines, PRs, achievements, and measurements. cannot be undone.\n\ntype DELETE to confirm:',
    )
    if (confirmInput !== 'DELETE') return
    setDeleting(true)
    setBusyMsg(null)
    try {
      await deleteAllUserData(user.uid)
      await signOutUser()
    } catch (e) {
      setBusyMsg(e instanceof Error ? e.message : 'delete failed.')
      setDeleting(false)
    }
  }

  return (
    <div className="page">
      <header className="page__head">
        <p className="page__kicker">settings</p>
        <h1 className="page__title">account</h1>
      </header>

      <section className="settings__row">
        <div className="settings__row-main">
          <p className="settings__label">signed in as</p>
          <p className="settings__value">{user?.email ?? '—'}</p>
        </div>
      </section>

      <section className="settings__row">
        <div className="settings__row-main">
          <p className="settings__label">unit</p>
          <p className="settings__value settings__value--mute">
            applies to all weights
          </p>
        </div>
        <div className="settings__seg" role="tablist" aria-label="unit">
          <button
            type="button"
            role="tab"
            aria-selected={unit === 'kg'}
            className={`settings__seg-btn ${unit === 'kg' ? 'is-active' : ''}`}
            onClick={() => setUnit('kg')}
          >
            kg
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={unit === 'lbs'}
            className={`settings__seg-btn ${unit === 'lbs' ? 'is-active' : ''}`}
            onClick={() => setUnit('lbs')}
          >
            lbs
          </button>
        </div>
      </section>

      <section className="settings__row">
        <div className="settings__row-main">
          <p className="settings__label">weekly goal</p>
          <p className="settings__value settings__value--mute">
            workouts per week
          </p>
        </div>
        <div className="settings__seg" role="tablist" aria-label="weekly goal">
          {[3, 4, 5, 6].map((n) => (
            <button
              key={n}
              type="button"
              role="tab"
              aria-selected={userDoc?.weeklyGoalWorkouts === n}
              className={`settings__seg-btn ${
                userDoc?.weeklyGoalWorkouts === n ? 'is-active' : ''
              }`}
              onClick={() => setWeeklyGoal(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </section>

      <Link to="/achievements" className="settings__row settings__row--link">
        <div className="settings__row-icon">
          <Trophy size={18} />
        </div>
        <div className="settings__row-main">
          <p className="settings__label">achievements</p>
          <p className="settings__value">
            {unlocked.size} / {ACHIEVEMENTS.length} unlocked
          </p>
        </div>
        <ChevronRight size={18} className="settings__row-chevron" />
      </Link>

      <section className="settings__data">
        <p className="settings__data-kicker">data</p>
        <div className="settings__data-grid">
          <button
            type="button"
            className="settings__data-btn"
            onClick={onExport}
            disabled={exporting}
          >
            <Download size={16} />
            {exporting ? 'exporting...' : 'export json'}
          </button>
          <button
            type="button"
            className="settings__data-btn"
            onClick={() => fileInput.current?.click()}
            disabled={importing}
          >
            <Upload size={16} />
            {importing ? 'importing...' : 'import json'}
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) onImport(f)
            }}
          />
        </div>
      </section>

      {busyMsg ? (
        <p className="settings__msg" role="status">
          {busyMsg}
        </p>
      ) : null}

      <button
        type="button"
        className="settings__signout"
        onClick={onSignOut}
        disabled={signingOut}
      >
        {signingOut ? 'signing out...' : 'sign out'}
      </button>

      <button
        type="button"
        className="settings__delete"
        onClick={onDeleteAccount}
        disabled={deleting}
      >
        <Trash2 size={14} />
        {deleting ? 'deleting...' : 'delete all data'}
      </button>
    </div>
  )
}
